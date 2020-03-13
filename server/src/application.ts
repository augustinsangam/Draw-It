import express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import inversify from 'inversify';
import log from 'loglevel';
import mongodb from 'mongodb';

import { COLORS, StatusCode, TYPES } from './constants';
import { Router } from './router';

@inversify.injectable()
class Application {
	private readonly app: express.Application;

	constructor(@inversify.inject(TYPES.Router) router: Router) {
		this.app = express();
		// Logging middleware
		this.app.use(Application.log);
		// expressjs.com/en/api.html#express.raw
		this.app.use(
			express.raw({
				limit: '10mb',
			}),
		);
		// Router must be the last middleware
		this.app.use(router.router);
		// Error middleware
		this.app.use(Application.err);
	}

	private static log(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	): void {
		let logMsg = '';
		logMsg += `[${COLORS.fg.green}LOG${COLORS.reset}] `;
		logMsg += `${req.method} - ${req.url}`;
		log.info(logMsg);
		res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
		res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		// goto next middleware
		next();
	}

	/* log.warn(`[${COLORS.fg.yello}WRN${COLORS.reset}]: …`);
	 */

	private static err(
		err: Error | mongodb.MongoError,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction,
	): void {
		log.error(`[${COLORS.fg.red}ERR${COLORS.reset}] ${err}`);
		res
			.status(StatusCode.INTERNAL_SERVER_ERROR)
			.send(`${err.name}: ${err.message}`);
	}

	// from @types/koa
	callback(): (req: IncomingMessage, res: ServerResponse) => void {
		return this.app;
	}
}

export { Application };
