import log from 'loglevel';

import { TYPES } from './constants';
import { myContainer } from './inversify.config';
import { Server } from './server';

log.setLevel('trace');

log.info(`PID is ${process.pid}`);

const main = async (): Promise<void> => {
	// TODO : Pas d'abréviations
	const s = myContainer.get<Server>(TYPES.Server);
	try {
		await s.launch();
		log.info('Server launched');
		await {
			then(r: () => void): void {
				process.on('SIGINT', r);
			},
		};
		log.info('SIGINT');
		await s.close();
		log.info('Server closed');
	} catch (err) {
		log.error('Unable to start server');
		log.error(err);
	}
};

main();
