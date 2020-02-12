import express from 'express';
import inversify from 'inversify';

import { Router } from './router';
import { TYPES } from './types';

@inversify.injectable()
class Application {
	private readonly app: express.Application;
	constructor(@inversify.inject(TYPES.Router) private readonly router: Router) {
		this.app = express();
		this.app.use('/', router.router);
	}
	callback() {
		return this.app;
	}
}

export { Application };
