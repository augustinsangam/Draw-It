import express from 'express';
import flatbuffers from 'flatbuffers';
import inversify from 'inversify';

import { Attr, Element } from './data_generated';
import { Database } from './database';
import { TYPES } from './types';

@inversify.injectable()
class Router {
	private readonly _router: express.Router;

	constructor(@inversify.inject(TYPES.Database) private readonly db: Database) {
		this._router = express.Router();
		this.router.get('/', this.getHelloWorld());
		this.router.post('/send', this.postData());
	}

	get router(): express.Router {
		return this._router;
	}

	private getHelloWorld(): express.RequestHandler {
		return (_req, res, next): void => {
			res.send('Hello, world!');
			console.log(this.db.db?.databaseName);
			//console.log(internalDB.collection('draw'));
			//mongodb.Binary();
			//collection.insertOne('yoo');
			next();
		};
	}

	private postData(): express.RequestHandler {
		return (req, _res, next): void => {
			console.log('hi');
			console.log(req.headers);
			console.log(req.body);
			next();
		};
	}
}

export { Router };
