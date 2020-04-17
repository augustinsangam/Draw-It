import inversify from 'inversify';
import mongodb from 'mongodb';

import { ERRORS } from './constants.js';
import secrets from './secrets.json';

interface Entry {
	_id: number;
	data?: mongodb.Binary;
}

@inversify.injectable()
class Database {
	private readonly client: mongodb.MongoClient;

	// LES UNDERSCORES SONT AUTORISÉS PAR LA SYNTAXE DE TYPESCRIPT
	// VOIR: https://www.typescriptlang.org/docs/handbook/classes.html#accessors
	// FORUM: https://moodle.polymtl.ca/mod/forum/discuss.php?d=73661
	// tslint:disable-next-line: variable-name
	private _db?: mongodb.Db;
	// tslint:disable-next-line: variable-name
	private _collection?: mongodb.Collection;

	constructor() {
		const url = new URL(secrets.mongodb.url);
		url.pathname = 'log2990';
		url.searchParams.append('serverSelectionTimeoutMS', '3000');
		url.searchParams.append('retryWrites', 'true');
		url.searchParams.append('w', 'majority');
		this.client = new mongodb.MongoClient(url.href, {
			auth: secrets.mongodb.auth,
			useUnifiedTopology: true,
		});
	}

	get db(): mongodb.Db | undefined {
		return this._db;
	}

	get collection(): mongodb.Collection | undefined {
		return this._collection;
	}

	// Source: docs.mongodb.com/manual/reference/operator/update/setOnInsert/#example
	async connect(dbName?: string): Promise<mongodb.Db> {
		await this.client.connect();
		const db = this.client.db(dbName);
		await db.collection('counter').updateOne(
			{
				_id: 'productid',
			},
			{
				$setOnInsert: {
					seq: 0,
				},
			},
			{
				upsert: true,
			},
		);
		this._collection = db.collection('drawings');
		return (this._db = db);
	}

	async close(force?: boolean): Promise<void> {
		return this.client.close(force);
	}

	async nextID(): Promise<number> {
		if (this.db === undefined) {
			return Promise.reject(ERRORS.nullDb);
		}

		const obj = await this.db.collection('counter').findOneAndUpdate(
			{
				_id: 'productid',
			},
			{
				$inc: {
					seq: 1,
				},
			},
			{
				returnOriginal: false,
			},
		);
		return obj.value.seq;
	}

	async all(): Promise<Entry[]> {
		if (this.collection === undefined) {
			return Promise.reject(ERRORS.nullCollection);
		}

		return this.collection.find<Entry>().toArray();
	}

	async insert(entry: Entry): Promise<mongodb.InsertOneWriteOpResult<Entry>> {
		if (this.collection === undefined) {
			return Promise.reject(ERRORS.nullCollection);
		}

		return this.collection.insertOne(entry);
	}

	async replace(
		entry: Entry,
		upsert: boolean,
	): Promise<mongodb.ReplaceWriteOpResult> {
		if (this.collection === undefined) {
			return Promise.reject(ERRORS.nullCollection);
		}

		return this.collection.replaceOne(
			{
				_id: entry._id,
			},
			{
				data: entry.data,
			},
			{
				upsert,
			},
		);
	}

	async delete(entry: Entry): Promise<mongodb.DeleteWriteOpResultObject> {
		if (this.collection === undefined) {
			return Promise.reject(ERRORS.nullCollection);
		}

		return this.collection.deleteOne(entry);
	}
}

// Due to a bug, c8 reports the export line as uncovered even tho
// it’s used outside of the current file
// See the bug submission https://github.com/bcoe/c8/issues/196
/* c8 ignore next */
export { Database, Entry };
