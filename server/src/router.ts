import express from 'express';
import flatbuffers from 'flatbuffers';
import inversify from 'inversify';
import mongodb from 'mongodb';

import { Draw, DrawBuffer, Draws } from './data_generated';
import { Database } from './database';
import { TYPES } from './types';

enum StatusCode {
	CREATED = 201,
	ACCEPTED,
	NO_CONTENT = 204,
	NOT_ACCEPTABLE = 406,
	IM_A_TEAPOT = 418,
}

interface Entry {
	_id: number;
	data: mongodb.Binary;
}

@inversify.injectable()
class Router {
	private readonly _router: express.Router;

	constructor(@inversify.inject(TYPES.Database) private readonly db: Database) {
		this._router = express.Router();
		this.router.get('/draw', this.methodGet());
		this.router.post('/draw', this.methodPost());
		this.router.put('/draw/:id', this.methodPut());
		// this.router.delete('/draw/:id', this.methodDelete());
		this.router.get('/del', this.methodDelete());
		this.router.get('/ping', (_req, res) =>
			res.sendStatus(StatusCode.NO_CONTENT),
		);
		this.router.get('/brew-coffee', (_req, res) =>
			res.sendStatus(StatusCode.IM_A_TEAPOT),
		);
	}

	get router(): express.Router {
		return this._router;
	}

	private verify(buf: Uint8Array): string | null {
		const fbBB = new flatbuffers.flatbuffers.ByteBuffer(buf);
		const draw = Draw.getRoot(fbBB);
		const name = draw.name();
		if (name == null || name.length < 3 || name.length > 21) {
			return `nom “${name}” invalide`;
		}
		for (let i = draw.tagsLength(); i--; ) {
			const tag = draw.tags(i);
			if (tag.length < 3 || tag.length > 21) {
				return `étiquette “${tag}” invalide`;
			}
		}
		return null;
	}

	private methodGet(): express.RequestHandler {
		return async (_req, res, next): Promise<void> => {
			const fbb = new flatbuffers.flatbuffers.Builder();
			let entries: Entry[];
			try {
				entries = await this.db.all();
			} catch (err) {
				return next(err);
			}
			const drawBufferOffsets = entries.map(entry => {
				const bufOffset = DrawBuffer.createBufVector(fbb, entry.data.buffer);
				return DrawBuffer.create(fbb, entry._id, bufOffset);
			});
			const drawBuffers = Draws.createDrawBuffersVector(fbb, drawBufferOffsets);
			const draws = Draws.create(fbb, drawBuffers);
			fbb.finish(draws);
			res.send(Buffer.from(fbb.asUint8Array()));
		};
	}

	// medium.com/@dineshuthakota/how-to-save-file-in-mongodb-usipostDatang-node
	//  -js-1a9d09b019c1
	private methodPost(): express.RequestHandler {
		return async (req, res, next): Promise<void> => {
			// req.body is a Buffer (which extends Uint8Array)
			const errMsg = this.verify(req.body);
			if (!!errMsg) {
				res.status(StatusCode.NOT_ACCEPTABLE).send(errMsg);
				return;
			}
			const data = new mongodb.Binary(req.body);
			try {
				const _id = await this.db.nextID();
				await this.db.insert({
					_id,
					data,
				});
				res.status(StatusCode.CREATED).send(_id.toString());
			} catch (err) {
				next(err);
			}
		};
	}

	private methodPut(): express.RequestHandler {
		return async (req, res, next): Promise<void> => {
			if (!this.verify(req.body)) {
				res.sendStatus(StatusCode.NOT_ACCEPTABLE);
				next();
				return;
			}
			try {
				await this.db.replace({
					_id: Number(req.params.id),
					data: new mongodb.Binary(req.body),
				});
				res.sendStatus(StatusCode.ACCEPTED);
			} catch (err) {
				next(err);
			}
		};
	}

	private methodDelete(): express.RequestHandler {
		return async (req, res, next): Promise<void> => {
			const id = Number(req.params.id);
			try {
				await this.db.delete(id);
				res.sendStatus(StatusCode.ACCEPTED);
			} catch (err) {
				next(err);
			}
		};
	}
}

export { Router };
