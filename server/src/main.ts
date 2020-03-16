import log from 'loglevel';

import { Server } from './server';

log.setLevel('trace');

const main = (server: Server) => {
	return async (quit: Promise<void>): Promise<void> => {
		try {
			await server.launch();
			log.info('Server launched');
			await quit;
			await server.close();
			log.info('Server closed');
		} catch (err) {
			log.error(err);
		}
	};
};

export { main };
