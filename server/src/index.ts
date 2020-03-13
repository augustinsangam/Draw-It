import log from 'loglevel';

import { TYPES } from './constants';
import { myContainer } from './inversify.config';
import { Server } from './server';

log.setLevel('trace');

log.info(`PID is ${process.pid}`);

const main = async (): Promise<void> => {
	const server = myContainer.get<Server>(TYPES.Server);
	try {
		await server.launch();
		log.info('Server launched');
		await {
			then(resolve: () => void): void {
				process.on('SIGINT', resolve);
			},
		};
		log.info('SIGINT');
		await server.close();
		log.info('Server closed');
	} catch (err) {
		log.error('Unable to start server');
		log.error(err);
	}
};

main();
