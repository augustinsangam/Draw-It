import express from 'express';
import inversify from 'inversify';
import { log } from 'util';

import { Database } from './database';
import { TYPES } from './types';

@inversify.injectable()
class Router {
	private readonly _router: express.Router;

	constructor(@inversify.inject(TYPES.Database) private readonly db: Database) {
		this._router = express.Router();
		db.connect()
			.then(internalDB => {
				log(`Successfully connected to “${internalDB.databaseName}”`);
				//console.log(internalDB.collection('draw'));
				//mongodb.Binary();
				//collection.insertOne('yoo');
				this.router.get('/', this.getHelloWorld());
				this.router.post('/send', this.postData());
			})
			.catch(e => console.error(e));
	}

	get router(): express.Router {
		return this._router;
	}

	private getHelloWorld(): express.RequestHandler {
		return (_req, res, next): void => {
			res.send('Hello, world!');
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
