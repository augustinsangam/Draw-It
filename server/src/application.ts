import express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import inversify from 'inversify';
import log from 'loglevel';

import { COLOR } from './color';
import { Router } from './router';
import { TYPES } from './types';

@inversify.injectable()
class Application {
	private readonly app: express.Application;

	constructor(@inversify.inject(TYPES.Router) router: Router) {
		this.app = express();
		this.app.use((req, res, next) => {
			log.info(`${COLOR.fg.green}${req.method}${COLOR.reset}: ${req.url}`);
			res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
			res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		});
		// expressjs.com/en/api.html#express.raw
		this.app.use(
			express.raw({
				limit: '10mb',
			}),
		);
		// Router must be the last middleware
		this.app.use(router.router);
	}

	// from @types/koa
	callback(): (req: IncomingMessage, res: ServerResponse) => void {
		return this.app;
	}
}

export { Application };
