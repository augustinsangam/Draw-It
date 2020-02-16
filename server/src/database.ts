import inversify from 'inversify';
import mongodb from 'mongodb';

import secrets from './secrets.json';

@inversify.injectable()
class Database {
	private readonly client: mongodb.MongoClient;
	private _db?: mongodb.Db;

	constructor() {
		// this._db = await mongodb.MongoClient.connect('mongodb://[::1]/log2990', {
		this.client = new mongodb.MongoClient('mongodb://[::1]/log2990', {
			auth: secrets.mongodb.auth,
			//	useUnifiedTopology: true, DOES NOT WORK WITH IPV6
		});
	}

	get db(): mongodb.Db | undefined {
		return this._db;
	}

	async connect(dbName?: string): Promise<mongodb.Db> {
		await this.client.connect();
		return (this._db = this.client.db(dbName));
	}
}

export { Database };
