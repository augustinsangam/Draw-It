import express from 'express';
import flatbuffers from 'flatbuffers';
import inversify from 'inversify';
import mongodb from 'mongodb';
import { log } from 'util';

import { Attr, Element } from './data_generated';
import { Database } from './database';
import { TYPES } from './types';

enum StatusCode {
	CREATED = 201,
	ACCEPTED,
	NO_CONTENT = 204,
}

@inversify.injectable()
class Router {
	private readonly _router: express.Router;

	constructor(@inversify.inject(TYPES.Database) private readonly db: Database) {
		this._router = express.Router();
		this.router.get('/ping', (_req, res) =>
			res.sendStatus(StatusCode.NO_CONTENT),
		);
		this.router.get('/', this.getHelloWorld());
		this.router.post('/draw', this.postData());
		this.router.put('/draw/:id', this.putData());
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
			const binary = new mongodb.Binary(req.body);
			console.log(`${binary.length()} bytes received`);
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
