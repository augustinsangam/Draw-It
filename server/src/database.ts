import inversify from 'inversify';
import mongodb from 'mongodb';

import secrets from './secrets.json';

interface Entry {
	_id: number;
	data: mongodb.Binary;
}

@inversify.injectable()
class Database {
	private readonly client: mongodb.MongoClient;
	private _db?: mongodb.Db;
	private _collection?: mongodb.Collection;

	constructor() {
		// this._db = await mongodb.MongoClient.connect('mongodb://[::1]/log2990', {
		this.client = new mongodb.MongoClient('mongodb://127.0.0.1/log2990', {
			auth: secrets.mongodb.auth,
			// Next does not work with IPv6
			useUnifiedTopology: true,
		});
	}

	get db(): mongodb.Db | undefined {
		return this._db;
	}

	get collection(): mongodb.Collection | undefined {
		return this._collection;
	}

	// docs.mongodb.com/manual/reference/operator/update/setOnInsert/#example
	async connect(dbName?: string): Promise<mongodb.Db> {
		await this.client.connect();
		this._db = this.client.db(dbName);
		await this._db.collection('counter').updateOne(
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
		this._collection = this._db?.collection('drawings');
		return this._db;
	}

	close(force?: boolean): Promise<void> {
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
			);
			return obj.value.seq;
		}
		return Promise.reject('database is null');
	}

	all(): Promise<Entry[]> {
		if (!!this.collection) {
			return this.collection.find<Entry>().toArray();
		}
		return Promise.reject('collection is null');
	}

	insert(entry: Entry): Promise<mongodb.InsertOneWriteOpResult<Entry>> {
		if (!!this.collection) {
			return this.collection.insertOne(entry);
		}
		return Promise.reject('collection is null');
	}

	replace(entry: Entry): Promise<mongodb.ReplaceWriteOpResult> {
		if (!!this.collection) {
			return this.collection.replaceOne(
				{
					_id: entry._id,
				},
				{
					data: entry.data,
				},
			);
		}
		return Promise.reject('collection is null');
	}

	delete(_id: number): Promise<mongodb.DeleteWriteOpResultObject> {
		if (!!this.collection) {
			return this.collection.deleteOne({
				_id,
			});
		}
		return Promise.reject('collection is null');
	}
}

export { Database, Entry };
