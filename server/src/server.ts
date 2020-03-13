import { createServer, Server as HttpServer } from 'http';
import inversify from 'inversify';
import { ListenOptions, Socket } from 'net';
import { promisify } from 'util';

import { Application } from './application';
import { TIMEOUT, TYPES } from './constants';
import { Database } from './database';

@inversify.injectable()
class Server {
	private readonly listenOptions: ListenOptions;
	private readonly openedSockets: Set<Socket>;
	private readonly srv: HttpServer; // TODO

	constructor(
		@inversify.inject(TYPES.Application) private readonly app: Application,
		@inversify.inject(TYPES.Database) private readonly db: Database,
	) {
		// TDOD : Constant; pas d'abréviations
		this.listenOptions = {
			host: '::1',
			ipv6Only: true,
			port: 8080,
		};
		this.openedSockets = new Set<Socket>();
		this.srv = createServer();
		this.srv.on('request', this.app.callback());
		this.srv.on('connection', socket => {
			this.openedSockets.add(socket);
			socket.on('close', () => this.openedSockets.delete(socket));
		});
	}

	async launch(): Promise<void> {
		await this.db.connect();
		this.srv.listen(this.listenOptions);
	}

	async close(): Promise<void> {
		const timer = setTimeout(
			() => this.openedSockets.forEach(socket => socket.destroy()),
			TIMEOUT,
		);
		// Source : github.com/nodejs/node/blob/master/doc/api/util.md#utilpromisifyoriginal
		const closePromise = promisify(this.srv.close).bind(this.srv);
		await closePromise();
		clearTimeout(timer);
		return this.db.close();
	}
}

export { Server };
