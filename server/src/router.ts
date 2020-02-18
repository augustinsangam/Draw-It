import express from 'express';
import flatbuffers from 'flatbuffers';
import inversify from 'inversify';
import mongodb from 'mongodb';
import { log } from 'util';

import { Draw, Element } from './data_generated';
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
		this.router.post('/draw', this.postData());
		this.router.put('/draw/:id', this.putData());
		this.router.get('/ping', (_req, res) =>
			res.sendStatus(StatusCode.NO_CONTENT),
		);
		this.router.get('/brew-coffee', (_req, res) =>
			res.sendStatus(StatusCode.IM_A_TEAPOT),
		);
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

			
			this.getNExtId()?.then(count => {
				const drawingsColl = this.db.db?.collection('drawings');
				console.log(count);
				const elementConcret = {
					_id : `${count}`,
					name: `${name}`,
					tags: `${decoded.tags}`,
					data: `${binary}`,
				};
				drawingsColl?.insertOne(elementConcret);
				res.status(StatusCode.CREATED).send(count);
				next();
			});

		};
	}

	private putData(): express.RequestHandler {
		return (req, res, next): void => {
			log(req.params.id);
			const deserialized = Router.deserialize(req.body);	// une fonction a faire pour ces deux lignes
			const decoded = Router.decode(deserialized);
			const binary = new mongodb.Binary(req.body);
			const concretElement = {
				_id : `${req.params.id}`,
				name: `${decoded.name()}`,
				tags: `${decoded.tags}`,
				data: `${binary}`,
			};
			const drawingsColl = this.db.db?.collection('drawings');
			drawingsColl?.remove({_id: `${req.params.id}`});
			drawingsColl?.insertOne(concretElement);

			res.sendStatus(StatusCode.ACCEPTED);
			next();
			// do smthg
		};
	}

	private getNExtId(): Promise<number> | undefined {
		const counterCollection = this.db.db?.collection('counter');
		const sequenceDocument = counterCollection?.findOneAndUpdate(
			{ _id: 'productid' },
			{ $inc: { sequenceValue: 1 } },
		);

		return sequenceDocument?.then(a => a.value.sequenceValue);
	}
}

export { Router };
