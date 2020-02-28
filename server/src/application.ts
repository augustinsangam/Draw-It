import express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import inversify from 'inversify';
import log from 'loglevel';

import { Router } from './router';
import { TYPES } from './types';

@inversify.injectable()
class Application {
	private readonly app: express.Application;

	constructor(@inversify.inject(TYPES.Router) router: Router) {
		this.app = express();
		this.app.use((req, res, next) => {
			log.info(`\x1b[0;32m${req.method}\x1b[0m: ${req.url}`);
			res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
			res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		});
		this.app.use(express.raw());
		// Router must be the last middleware
		this.app.use(router.router);
	}

	// from @types/koa
	callback(): (req: IncomingMessage, res: ServerResponse) => void {
		return this.app;
	}
}

export { Application };
