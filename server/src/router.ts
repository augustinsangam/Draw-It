import EmailValidator from 'email-validator';
import express from 'express';
import flatbuffers from 'flatbuffers';
import { IncomingMessage } from 'http';
import inversify from 'inversify';
import log from 'loglevel';
import mongodb from 'mongodb';
import multer from 'multer';
import { promisify } from 'util';

import { COLORS, ContentType, EMAIL_API, ERRORS, Header, StatusCode, TextLen, TYPES } from './constants';
import { Database, Entry } from './database';
import { Draw, DrawBuffer, Draws } from './data_generated';
import { Email } from './email';

interface Id {
	id: number;
	err?: Error;
}

// Source: zellwk.com/blog/async-await-express/
@inversify.injectable()
class Router {
	readonly router: express.Router;

	constructor(
		@inversify.inject(TYPES.Database) private readonly db: Database,
		@inversify.inject(TYPES.Email) private readonly email: Email,
	) {
		const upload = multer({ dest: 'uploads/' });
		this.router = express.Router();
		this.router.post('/send', upload.single('media'), this.sendEmail());
		this.router.get('/draw', this.methodGet());
		this.router.post('/draw', this.methodPost());
		this.router.put('/draw/:id', this.methodPut());
		this.router.delete('/draw/:id', this.methodDelete());
		this.router.get('/ping', (_, res) => res.sendStatus(StatusCode.NO_CONTENT));
		this.router.get('/brew-coffee', (_, res) =>
			res.sendStatus(StatusCode.IM_A_TEAPOT),
		);
	}

	private verifyBuffer(buf: Uint8Array): string | null {
		const fbByteBuffer = new flatbuffers.flatbuffers.ByteBuffer(buf);
		const draw = Draw.getRoot(fbByteBuffer);

		const name = draw.name();
		if (
			name == null ||
			name.length < TextLen.MIN ||
			name.length > TextLen.MAX
		) {
			return `Nom “${name}” invalide`;
		}

		for (let i = draw.tagsLength(); i-- !== 0; ) {
			const tag = draw.tags(i);
			if (tag.length < TextLen.MIN || tag.length > TextLen.MAX) {
				return `Étiquette “${tag}” invalide`;
			}
		}

		return null;
	}

	private verifyID(textID: string): number | Error {
		const id = Number(textID);

		if (isNaN(id)) {
			return new Error(`ID “${textID}” n’est pas un nombre`);
		}

		if (!isFinite(id)) {
			return new Error(`ID “${textID}” ne doit pas être infini`);
		}

		if (!Number.isInteger(id)) {
			return new Error(`ID “${id}” doit être un entier`);
		}

		if (id < 1) {
			return new Error(`ID “${id}” doit être suppérieur à zéro`);
		}

		return id;
	}

	private sendEmail(): express.RequestHandler {
		return async (req, res, next): Promise<void> => {
			const recipient = req.body.recipient;
			if (recipient == null || req.file == null) {
				res.status(StatusCode.BAD_REQUEST).send('“recipient” ou “media” manquant');
				return;
			}

			if (!EmailValidator.validate(recipient)) {
				res.status(StatusCode.NOT_ACCEPTABLE).send('Courriel invalide');
				return;
			}

			let resEmail: IncomingMessage;
			try {
				resEmail = await this.email.send(recipient, req.file);
			} catch(err) {
				return next(err);
			}

			const count = resEmail.headers[EMAIL_API.headers.count];
			const max = resEmail.headers[EMAIL_API.headers.max];

			switch (resEmail.statusCode) {
			case StatusCode.OK:
				res.status(StatusCode.OK);
				res.send(`Courriel envoyé (${count}/${max})`);
				return;
			case StatusCode.ACCEPTED:
				res.status(StatusCode.OK);
				res.send(`Courriel probabablement envoyé (${count}/${max})`);
				return;
			default:
				break;
			}

			if (resEmail.headers[Header.CONTENT_TYPE] !== ContentType.JSON) {
				return next(ERRORS.reposneNotJson);
			}

			const chunks = new Array();
			resEmail.on('data', chunks.push.bind(chunks));

			await promisify(resEmail.on)('end');

			const textResult = Buffer.concat(chunks).toString();
			try {
				const result = JSON.parse(textResult);
				res.type(ContentType.PLAIN_UTF8);
				res.status(StatusCode.NOT_ACCEPTABLE).send(result.error);
			} catch (err) {
				next(err);
			}
		};
	}

	private methodGet(): express.RequestHandler {
		return async (_, res, next): Promise<void> => {
			let entries: Entry[];
			try {
				entries = await this.db.all();
			} catch (err) {
				return next(err);
			}

			const fbBuilder = new flatbuffers.flatbuffers.Builder();
			const drawBufferOffsets = entries
				.filter((entry) => !!entry.data)
				.map((entry) => {
					const bufOffset = DrawBuffer.createBufVector(
						fbBuilder,
						// I am guaranteed the data proprety is not undefined
						// because of the filter instruction above
						// tslint:disable-next-line: no-non-null-assertion
						entry.data!.buffer,
					);
					return DrawBuffer.create(fbBuilder, entry._id, bufOffset);
				});
			const drawBuffers = Draws.createDrawBuffersVector(
				fbBuilder,
				drawBufferOffsets,
			);
			const draws = Draws.create(fbBuilder, drawBuffers);
			fbBuilder.finish(draws);
			res.send(Buffer.from(fbBuilder.asUint8Array()));
		};
	}

	// Source: medium.com/@dineshuthakota/how-to-save-file-in-mongodb-usipostDatang-node-js-1a9d09b019c1
	private methodPost(): express.RequestHandler {
		return async (req, res, next): Promise<void> => {
			res.type(ContentType.PLAIN_UTF8);

			if (!req.is(ContentType.OCTET_STREAM)) {
				res.status(StatusCode.BAD_REQUEST).send('Requète incorrecte');
				return;
			}

			const buffer = req.body as Buffer;

			const errMessage = this.verifyBuffer(buffer);
			if (!!errMessage) {
				res.status(StatusCode.NOT_ACCEPTABLE).send(errMessage);
				return;
			}

			try {
				const id = await this.db.nextID();
				await this.db.insert({
					_id: id,
					data: new mongodb.Binary(buffer),
				});
				log.info(`${COLORS.fg.yellow}ID${COLORS.reset}: ${id}`);
				res.status(StatusCode.CREATED).send(id.toString());
			} catch (err) {
				next(err);
			}
		};
	}

	private methodPut(): express.RequestHandler {
		return async (req, res, next): Promise<void> => {
			res.type(ContentType.PLAIN_UTF8);

			if (!req.is(ContentType.OCTET_STREAM)) {
				res.status(StatusCode.BAD_REQUEST).send('Requète incorrecte');
				return;
			}

			const idOrError = this.verifyID(req.params.id);
			if (idOrError instanceof Error) {
				res.status(StatusCode.BAD_REQUEST).send(idOrError.message);
				return;
			}

			const errMessage = this.verifyBuffer(req.body);
			if (!!errMessage) {
				res.status(StatusCode.NOT_ACCEPTABLE).send(errMessage);
				return;
			}

			try {
				await this.db.replace(
					{
						_id: idOrError,
						data: new mongodb.Binary(req.body),
					},
					true,
				);
			} catch (err) {
				return next(err);
			}
			res.sendStatus(StatusCode.ACCEPTED);
		};
	}

	private methodDelete(): express.RequestHandler {
		return async (req, res, next): Promise<void> => {
			const idOrError = this.verifyID(req.params.id);
			if (idOrError instanceof Error) {
				res.status(StatusCode.BAD_REQUEST).send(idOrError.message);
				return;
			}

			try {
				await this.db.delete({ _id: idOrError });
			} catch (err) {
				return next(err);
			}
			res.sendStatus(StatusCode.ACCEPTED);
		};
	}
}

// Due to a bug, c8 reports the export line as uncovered even tho
// it’s used outside of the current file
// See the bug submission https://github.com/bcoe/c8/issues/196
/* c8 ignore next */
export { Router };
