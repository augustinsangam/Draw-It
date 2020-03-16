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
	private readonly server: HttpServer;

	constructor(
		@inversify.inject(TYPES.Application) private readonly app: Application,
		@inversify.inject(TYPES.Database) private readonly db: Database,
	) {
		this.listenOptions = {
			host: '::1',
			ipv6Only: true,
			port: 8080,
		};
		this.openedSockets = new Set();
		this.server = createServer();
	}

	private setupServer(): void {
		this.server.on('request', this.app.callback());
		this.server.on('connection', (socket) => {
			this.openedSockets.add(socket);
			socket.on('close', () => this.openedSockets.delete(socket));
		});
	}

	async launch(): Promise<void> {
		this.setupServer();
		await this.db.connect();
		this.server.listen(this.listenOptions);
	}

	private async promisifyServerClose(): Promise<void> {
		return promisify(this.server.close).bind(this.server)();
	}

	async close(): Promise<void> {
		// Source: nodejs.org/api/util.html#util_util_promisify_original
		const timer = setTimeout(
			() => this.openedSockets.forEach((socket) => socket.destroy()),
			TIMEOUT,
		);
		await this.promisifyServerClose();
		clearTimeout(timer);
		return this.db.close();
	}
}

// Due to a bug, c8 reports the export line as uncovered even tho
// it’s used outside of the current file
// See the bug submission https://github.com/bcoe/c8/issues/196
/* c8 ignore next */
export { Server };
