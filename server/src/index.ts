import { log } from 'util';

import { myContainer } from './inversify.config';
import { Server } from './server';
import { TYPES } from './types';

const s = myContainer.get<Server>(TYPES.Server);

const sigint = new Promise(resolve =>
	process.on('SIGINT', () => {
		log('SIGINT');
		resolve();
	}),
);

s.launch()
	.then(() => console.info('Server launched'))
	.then(() => sigint)
	.then(() => s.close())
	.then(() => console.info('Server closed'))
	.catch(err => {
		console.error('Unable to start server');
		console.error(err);
	});
