import inversify from 'inversify';
import mongodb from 'mongodb';

import { ERRORS } from './constants.js';
import secrets from './secrets.json';

interface Entry {
	_id: number;
	data: mongodb.Binary;
}

const mongo = mongodb;

@inversify.injectable()
class Database {
	private readonly client: mongodb.MongoClient;

	// TODO: No underscore
	// tslint:disable-next-line: variable-name
	private _db?: mongodb.Db;
	// tslint:disable-next-line: variable-name
	private _collection?: mongodb.Collection;

	constructor() {
		const uri = new URL(secrets.mongodb.uri);
		uri.pathname = 'log2990';
		uri.searchParams.append('serverSelectionTimeoutMS', '3000');
		uri.searchParams.append('retryWrites', 'true');
		uri.searchParams.append('w', 'majority');
		this.client = new mongo.MongoClient(uri.href, {
			auth: secrets.mongodb.auth,
			useUnifiedTopology: true,
		};
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
		if (!!this.db) {
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

		return Promise.reject(ERRORS.nullDb);
	}

	async all(): Promise<Entry[]> {
		if (!!this.collection) {
			return this.collection.find<Entry>().toArray();
		}

		return Promise.reject(ERRORS.nullCollection);
	}

	async insert(entry: Entry): Promise<mongodb.InsertOneWriteOpResult<Entry>> {
		if (!!this.collection) {
			return this.collection.insertOne(entry);
		}

		return Promise.reject(ERRORS.nullCollection);
	}

	async replace(
		entry: Entry,
		upsert: boolean,
	): Promise<mongodb.ReplaceWriteOpResult> {
		if (!!this.collection) {
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

		return Promise.reject(ERRORS.nullCollection);
	}

	async delete(id: number): Promise<mongodb.DeleteWriteOpResultObject> {
		if (!!this.collection) {
			return this.collection.deleteOne({
				_id: id,
			});
		}

		return Promise.reject(ERRORS.nullCollection);
	}
}

export { Database, Entry };
