import express from 'express';
import flatbuffers from 'flatbuffers';
import inversify from 'inversify';
import log from 'loglevel';
import mongodb from 'mongodb';

import { COLORS, ContentType, StatusCode, TextLen, TYPES } from './constants';
import { Draw, DrawBuffer, Draws } from './data_generated';
import { Database, Entry } from './database';

interface Id {
	id: number;
	err?: Error;
}

// Source: zellwk.com/blog/async-await-express/
@inversify.injectable()
class Router {
	readonly router: express.Router;

	constructor(@inversify.inject(TYPES.Database) private readonly db: Database) {
		this.router = express.Router();
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

		const tagsLen = draw.tagsLength();
		for (let i = 0; i < tagsLen; ++i) {
			const tag = draw.tags(i);
			if (tag.length < TextLen.MIN || tag.length > TextLen.MAX) {
				return `Étiquette “${tag}” invalide`;
			}
		}

		return null;
	}

	private verifyID(textID: string): Id {
		const possibleId: Id = {
			id: Number(textID),
		};

		if (isNaN(possibleId.id)) {
			possibleId.err = new Error(`ID “${textID}” n’est pas un nombre`);
		} else if (!isFinite(possibleId.id)) {
			possibleId.err = new Error(`ID “${textID}” ne doit pas être infini`);
		} else if (!Number.isInteger(possibleId.id)) {
			possibleId.err = new Error(`ID “${possibleId.id}” doit être un entier`);
		} else if (possibleId.id < 1) {
			possibleId.err = new Error(
				`ID “${possibleId.id}” doit être suppérieur à zéro`,
			);
		}

		return possibleId;
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

			const possibleId = this.verifyID(req.params.id);
			if (!!possibleId.err) {
				res.status(StatusCode.BAD_REQUEST).send(possibleId.err.message);
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
						_id: possibleId.id,
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
			const possibleId = this.verifyID(req.params.id);
			if (!!possibleId.err) {
				res.status(StatusCode.BAD_REQUEST).send(possibleId.err.message);
				return;
			}

			try {
				await this.db.delete({ _id: possibleId.id });
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
