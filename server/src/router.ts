import express from 'express';
import inversify from 'inversify';

@inversify.injectable()
class Router {
	readonly router: express.Router;

	constructor() {
		this.router = express.Router();
		this.router.get('/', (req, res) => {
			res.send('Hello, world!');
			console.log(req.httpVersion);
		});
	}
}

export { Router };
