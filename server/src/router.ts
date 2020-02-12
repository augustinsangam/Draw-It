import express from 'express';
import inversify from 'inversify';

@inversify.injectable()
class Router {
	readonly router: express.Router;
	constructor() {
		this.router = express.Router();
		this.router.get('/', (_req, res) => {
			res.send('Hello, world!');
		});
	}
}

export { Router };
