import { createServer, Server as HttpServer } from 'http';
import inversify from 'inversify';
import { ListenOptions } from 'net';
import { promisify } from 'util';

import { Application } from './application';
import { Database } from './database';
import { TYPES } from './types';

@inversify.injectable()
class Server {
	private readonly listenOptions: ListenOptions;
	private readonly srv: HttpServer;

	constructor(
		@inversify.inject(TYPES.Application) private readonly app: Application,
		@inversify.inject(TYPES.Database) private readonly db: Database,
	) {
		this.listenOptions = {
			host: '::1',
			ipv6Only: true,
			port: 8080,
		};
		this.srv = createServer();
		this.srv.on('request', this.app.callback());
		// TODO: ws
	}

	async launch(): Promise<void> {
		await this.db.connect();
		this.srv.listen(this.listenOptions);
	}

	async close(): Promise<void> {
		// github.com/nodejs/node/blob/master/doc/api/util.md#utilpromisifyoriginal
		const closePromise = promisify(this.srv.close).bind(this.srv);
		await closePromise();
		return this.db.close();
	}
}

export { Server };
