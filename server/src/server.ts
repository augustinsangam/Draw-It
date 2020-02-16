import { createServer, Server as HttpServer } from 'http';
import inversify from 'inversify';
import { ListenOptions } from 'net';

import { Application } from './application';
import { TYPES } from './types';

@inversify.injectable()
class Server {
	private readonly listenOptions: ListenOptions = {
		host: '::1',
		ipv6Only: true,
		port: 8080,
	};
	private readonly srv: HttpServer;

	constructor(
		@inversify.inject(TYPES.Application) private readonly app: Application,
	) {
		this.srv = createServer();
		this.srv.on('request', this.app.callback());
		// TODO: ws
	}

	launch(): void {
		this.srv.listen(this.listenOptions);
	}

	close(callback?: (err?: Error) => void): void {
		this.srv.close(callback);
	}
}

export { Server };
