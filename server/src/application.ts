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
		this.app.disable('x-powered-by');
		this.app.use(Application.log);
		this.app.use(
			express.raw({
				limit: '10mb',
			}),
		);
		this.app.use(router.router);
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
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
		res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
		next();
	}

	// Arguments need to follow the error handler prototype from express
	// That’s why we disable tslint warnings about underscores
	private static err(
		err: Error | mongodb.MongoError,
		// tslint:disable-next-line: variable-name
		_req: express.Request,
		res: express.Response,
		// tslint:disable-next-line: variable-name
		_next: express.NextFunction,
	): void {
		log.error(`[${COLORS.fg.red}ERR${COLORS.reset}] ${err}`);
		res
			.status(StatusCode.INTERNAL_SERVER_ERROR)
			.send(`${err.name}: ${err.message}`);
	}

	callback(): (req: IncomingMessage, res: ServerResponse) => void {
		return this.app;
	}
}

// Due to a bug, c8 reports the export line as uncovered even tho
// it’s used outside of the current file
// See the bug submission https://github.com/bcoe/c8/issues/196
/* c8 ignore next */
export { Application };
