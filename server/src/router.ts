import express from 'express';
import flatbuffers from 'flatbuffers';
import inversify from 'inversify';
import mongodb from 'mongodb';
import { log } from 'util';

import { Draw, Draws, Element } from './data_generated';
import { Database } from './database';
import { TYPES } from './types';

enum StatusCode {
	CREATED = 201,
	ACCEPTED,
	NO_CONTENT = 204,
	NOT_ACCEPTABLE = 406,
	IM_A_TEAPOT = 418,
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
		this.router.get('/ping', (_req, res) =>
			res.sendStatus(StatusCode.NO_CONTENT),
		);
		this.router.get('/brew-coffee', (_req, res) =>
			res.sendStatus(StatusCode.IM_A_TEAPOT),
		);
	}

	private static serialize(
		fbbb: flatbuffers.flatbuffers.ByteBuffer,
	): Uint8Array {
		return fbbb.bytes().subarray(fbbb.position(), fbbb.capacity());
	}

	private static deserialize(
		data: ArrayBuffer,
	): flatbuffers.flatbuffers.ByteBuffer {
		return new flatbuffers.flatbuffers.ByteBuffer(new Uint8Array(data));
	}

	private static decode(fbbb: flatbuffers.flatbuffers.ByteBuffer): Draw {
		return Draw.getRoot(fbbb);
	}

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

	get router(): express.Router {
		return this._router;
	}

	private getHelloWorld(): express.RequestHandler {
		return (_req, res, next): void => {
			res.send('Hello, world!');
			console.log(this.db.db?.databaseName);
			next();
		};
	}

	private getAll(): express.RequestHandler {
		return (req, res): void => {
			const fbb = new flatbuffers.flatbuffers.Builder();
			const name1 = fbb.createString('Draw1');
			Draw.start(fbb);
			Draw.addName(fbb, name1);
			const draw1 = Draw.end(fbb);
			const name2 = fbb.createString('Draw2');
			Draw.start(fbb);
			Draw.addName(fbb, name2);
			const draw2 = Draw.end(fbb);
			const draws = Draws.createDrawsVector(fbb, [draw1, draw2]);
			const end = Draws.create(fbb, draws);
			fbb.finish(end);
			const encoded = fbb.dataBuffer();
			const serialized = Router.serialize(encoded);
			res.send(new Buffer(serialized));
		};
	}

	// medium.com/@dineshuthakota/how-to-save-file-in-mongodb-usipostDatang-node-js-1a9d09b019c1
	private postData(): express.RequestHandler {
		return (req, res, next): void => {
			//console.log(internalDB.collection('draw'));
			const deserialized = Router.deserialize(req.body);
			const decoded = Router.decode(deserialized);
			const name = decoded.name();
			if (!!name) {
				console.log('Name is ' + name);
			}
			const tagsLen = decoded.tagsLength();
			for (let i = 0; i < tagsLen; i++) {
				console.log(`Tag #${i}: ${decoded.tags(i)}`);
			}
			const svg = decoded.svg();
			if (!!svg) {
				Router.disp(svg);
			}
			const binary = new mongodb.Binary(req.body);
			//console.log(`${binary.length()} bytes received`);
			//collection.insertOne('yoo');
			res.status(StatusCode.CREATED).send('42');
			next();
		};
	}

	private putData(): express.RequestHandler {
		return (req, res, next): void => {
			log(req.params.id);
			res.sendStatus(StatusCode.ACCEPTED);
			next();
			// do smthg
		};
	}
}

export { Router };
