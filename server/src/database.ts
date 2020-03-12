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

	// mongodb.github.io/node-mongodb-native/3.5/api/MongoClient.html
	// nodejs.org/api/url.html
	// mongodb.github.io/mongo-java-driver/3.8/javadoc/com/mongodb/ConnectionString.html
	constructor() {
		const uri = new URL('mongodb+srv://cluster0-5pews.mongodb.net');
		// const uri = new URL('mongodb://127.0.0.1');
		uri.pathname = 'log2990';
		uri.searchParams.append('serverSelectionTimeoutMS', '3000');
		uri.searchParams.append('retryWrites', 'true');
		uri.searchParams.append('w', 'majority');
		// this._db = await mongodb.MongoClient.connect(uri.href, {
		this.client = new mongodb.MongoClient(uri.href, {
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
		return Promise.reject(new Error('database is null'));
	}

	async all(): Promise<Entry[]> {
		if (!!this.collection) {
			return this.collection.find<Entry>().toArray();
		}
		return Promise.reject(new Error('collection is null'));
	}

	async insert(entry: Entry): Promise<mongodb.InsertOneWriteOpResult<Entry>> {
		if (!!this.collection) {
			return this.collection.insertOne(entry);
		}
		return Promise.reject(new Error('collection is null'));
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
		return Promise.reject(new Error('collection is null'));
	}

	async delete(id: number): Promise<mongodb.DeleteWriteOpResultObject> {
		if (!!this.collection) {
			return this.collection.deleteOne({
				_id: id,
			});
		}
		return Promise.reject(new Error('collection is null'));
	}
}

export { Database, Entry };
