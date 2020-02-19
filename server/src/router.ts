import express from 'express';
import flatbuffers from 'flatbuffers';
import inversify from 'inversify';
import mongodb from 'mongodb';
import { log } from 'util';

import { Draw, DrawBuffer, Draws, Element } from './data_generated';
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
		return (_req, res): void => {
			const fbb = new flatbuffers.flatbuffers.Builder();
			const serializedDrawsLen = 1; // TODO: Get from DB
			const drawBufferOffsets = new Array<number>();
			for (let i = 0; i < serializedDrawsLen; i++) {
				const serializedDraw = new Uint8Array(); // TODO: Get from DB
				const bufOffset = DrawBuffer.createBufVector(fbb, serializedDraw);
				const drawBuffer = DrawBuffer.create(fbb, 42, bufOffset);
				drawBufferOffsets.push(drawBuffer);
			}
			const drawBuffers = Draws.createDrawBuffersVector(fbb, drawBufferOffsets);
			const draws = Draws.create(fbb, drawBuffers);
			fbb.finish(draws);
			res.send(Buffer.from(fbb.asUint8Array()));
		};
	}

	// medium.com/@dineshuthakota/how-to-save-file-in-mongodb-usipostDatang-node-js-1a9d09b019c1
	private postData(): express.RequestHandler {
		return (req, res, next): void => {
			// req.body is a Buffer (which extends Uint8Array)
			const fbBB = new flatbuffers.flatbuffers.ByteBuffer(req.body);
			const draw = Draw.getRoot(fbBB);

			const name = draw.name();
			if (!!name) {
				console.log('Name is ' + name);
			}
			const tags = new Array<string>();
			for (let i = draw.tagsLength(); i--; ) {
				tags.push(draw.tags(i));
			}
			const svg = draw.svg();
			if (!!svg) {
				Router.disp(svg);
			}
			const binary = new mongodb.Binary(req.body);

			this.getNExtId()?.then(count => {
				const drawingsColl = this.db.db?.collection('drawings');
				console.log(count);
				// TODO: no string
				const elementConcret = {
					_id: `${count}`,
					name: `${name}`,
					tags: `${tags}`,
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
			const fbBB = new flatbuffers.flatbuffers.ByteBuffer(req.body);
			const draw = Draw.getRoot(fbBB);
			const tags = new Array<string>();
			for (let i = draw.tagsLength(); i--; ) {
				tags.push(draw.tags(i));
			}
			const binary = new mongodb.Binary(req.body);
			const concretElement = {
				_id: `${req.params.id}`,
				name: `${draw.name()}`,
				tags: `${tags}`,
				data: `${binary}`,
			};
			const drawingsColl = this.db.db?.collection('drawings'); // Mettre les collections dans le constructeur
			drawingsColl?.remove({ _id: `${req.params.id}` }); // a revoir
			drawingsColl?.insertOne(concretElement);

			res.sendStatus(StatusCode.ACCEPTED);
			next();
		};
	}

	// Pour la mise à jour apres suppression
	deleteData(): express.RequestHandler {
		return (req, res, next): void => {
			const drawingsColl = this.db.db?.collection('drawings');
			drawingsColl?.remove({ _id: `${req.params.id}` });
			res.sendStatus(StatusCode.ACCEPTED);
			next();
		};
	}

	getAllSerializedDraws(): Promise<Uint8Array[]> | undefined {
		/*const drawingsColl = this.db.db?.collection('drawings');
		return drawingsColl?.find({}).toArray();*/
		if (true) {
			return new Promise<Draw[]>();
		}
	}

	private getNExtId(): Promise<number> | undefined {
		const counterCollection = this.db.db?.collection('counter');
		const sequenceDocument = counterCollection?.findOneAndUpdate(
			{ _id: 'productid' },
			{ $inc: { sequenceValue: 1 } },
		);

		return sequenceDocument?.then(a => a.value.sequenceValue);
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
