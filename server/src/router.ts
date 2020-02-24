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
	INTERNAL_SERVER_ERROR = 500,
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
		this.router.get('/', this.getHelloWorld());
		this.router.get('/draw', this.getAll());
		this.router.post('/draw', this.postData());
		this.router.put('/draw/:id', this.putData());
		this.router.delete('/draw/:id', this.deleteData());
		this.router.get('/ping', (_req, res) =>
			res.sendStatus(StatusCode.NO_CONTENT),
		);
		this.router.get('/brew-coffee', (_req, res) =>
			res.sendStatus(StatusCode.IM_A_TEAPOT),
		);
	}
	/*
	private static disp(el: Element): void {
		console.log(el.name());
		const attrsLen = el.attrsLength();
		for (let i = 0; i < attrsLen; i++) {
			const attr = el.attrs(i);
			console.log(`- ${attr?.k()}: ${attr?.v()}`);
		}
		const childrenLen = el.childrenLength();
		for (let i = 0; i < childrenLen; i++) {
			const child = el.children(i);
			if (!!child) {
				Router.disp(child);
			}
		}
	}
	*/
	get router(): express.Router {
		return this._router;
	}

	private verify(buf: Uint8Array): boolean {
		const fbBB = new flatbuffers.flatbuffers.ByteBuffer(buf);
		const draw = Draw.getRoot(fbBB);
		const name = draw.name();
		if (name == null || name.length < 3 || name.length > 21) {
			return false;
		}
		for (let i = draw.tagsLength(); i--; ) {
			const tag = draw.tags(i);
			if (tag.length < 3 || tag.length > 21) {
				return false;
			}
		}
		return true;
		/*const svg = draw.svg();
		if (!!svg) {
			Router.disp(svg);
		}*/
	}

	private getHelloWorld(): express.RequestHandler {
		return (_req, res): void => {
			res.send('Hello, world!');
			this.getAllSerializedDraws()?.then(arr => {
				console.log(arr[0].data.buffer);
			});
		};
	}

	private getAll(): express.RequestHandler {
		return (_req, res): void => {
			const fbb = new flatbuffers.flatbuffers.Builder();
			const drawBufferOffsets = new Array<number>();
			this.getAllSerializedDraws()?.then(serializedDraws => {
				for (let i = serializedDraws.length; i--; ) {
					const serializedDraw = serializedDraws[i];
					const bufOffset = DrawBuffer.createBufVector(
						fbb,
						serializedDraw.data.buffer,
					);
					const drawBuffer = DrawBuffer.create(
						fbb,
						serializedDraw._id,
						bufOffset,
					);
					drawBufferOffsets.push(drawBuffer);
				}
				const drawBuffers = Draws.createDrawBuffersVector(
					fbb,
					drawBufferOffsets,
				);
				const draws = Draws.create(fbb, drawBuffers);
				fbb.finish(draws);
				res.send(Buffer.from(fbb.asUint8Array()));
			});
		};
	}

	// medium.com/@dineshuthakota/how-to-save-file-in-mongodb-usipostDatang-node-js-1a9d09b019c1
	private postData(): express.RequestHandler {
		return (req, res, next): void => {
			// req.body is a Buffer (which extends Uint8Array)
			if (!this.verify(req.body)) {
				res.sendStatus(StatusCode.NOT_ACCEPTABLE);
				next();
				return;
			}
			const binary = new mongodb.Binary(req.body);
			this.getNExtId()
				?.then(count => {
					const drawingsColl = this.db.db?.collection('drawings');
					const elementConcret: Entry = {
						_id: count,
						data: binary,
					};
					return drawingsColl?.insertOne(elementConcret);
				})
				.then(insertRes => {
					const id = insertRes?.insertedId;
					res.status(StatusCode.CREATED).send(id.toString());
					next();
				})
				.catch(err => {
					console.error(err);
					res.sendStatus(StatusCode.INTERNAL_SERVER_ERROR);
					next();
				});
		};
	}

	private putData(): express.RequestHandler {
		return (req, res, next): void => {
			if (!this.verify(req.body)) {
				res.sendStatus(StatusCode.NOT_ACCEPTABLE);
				next();
				return;
			}
			const id = Number(req.params.id);
			const binary = new mongodb.Binary(req.body);
			const drawingsColl = this.db.db?.collection('drawings');
			drawingsColl
				?.replaceOne(
					{
						_id: id,
					},
					{
						data: binary,
					},
				)
				?.then(() => {
					res.sendStatus(StatusCode.ACCEPTED);
					next();
				})
				.catch(() => {
					res.sendStatus(StatusCode.INTERNAL_SERVER_ERROR);
					next();
				});
		};
	}

	private deleteData(): express.RequestHandler {
		return (req, res, next): void => {
			const id = Number(req.params.id);
			const drawingsColl = this.db.db?.collection('drawings');
			drawingsColl
				?.deleteOne({
					_id: id,
				})
				.then(() => {
					res.sendStatus(StatusCode.ACCEPTED);
					next();
				})
				.catch(err => {
					console.error(err);
					res.sendStatus(StatusCode.INTERNAL_SERVER_ERROR);
					next();
				});
		};
	}

	private getAllSerializedDraws(): Promise<Entry[]> | undefined {
		const drawingsColl = this.db.db?.collection('drawings');
		return drawingsColl?.find().toArray();
	}

	private getNExtId(): Promise<number> | undefined {
		return this.db.db
			?.collection('counter')
			?.findOneAndUpdate(
				{
					_id: 'productid',
				},
				{
					$inc: {
						sequenceValue: 1,
					},
				},
			)
			.then(a => a.value.sequenceValue);
	}

	/*findElementByName(nameToSearch: string): Promise<any[]> | undefined {
		const drawingsColl = this.db.db?.collection('drawings');
		return drawingsColl?.find({ name: `${nameToSearch}` }).toArray();
	}*/

	/*findElementById(id: string): Promise<Draw[]> | undefined {
		const drawingsColl = this.db.db?.collection('drawings');
		return drawingsColl?.find({ _id: `${id}` }).toArray();
	}*/
}

export { Router };
