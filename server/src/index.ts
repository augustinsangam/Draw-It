import log from 'loglevel';

import { TYPES } from './constants';
import { myContainer } from './inversify.config';
import { main } from './main';
import { Server } from './server';

const server = myContainer.get<Server>(TYPES.Server);
const sigint = new Promise<void>((resolve) => {
	process.on('SIGINT', () => resolve());
	process.on('SIGTERM', () => resolve());
});

main(server)(sigint);
