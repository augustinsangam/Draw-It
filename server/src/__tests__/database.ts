// TODO: Pertinance du max-class
// tslint:disable: no-any no-string-literal no-unused-expression max-classes-per-file

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongodb from 'mongodb';
import sinon from 'sinon';

import { ANSWER_TO_LIFE, ERRORS, TYPES } from '../constants';
import { Database, Entry } from '../database';
import { myContainer } from '../inversify.config';

interface MongoFindAndModifyWriteOpResultObjectMock {
	value: {
		seq: number;
	};
}

class MongoCursorMock {
	async toArray(): Promise<Entry[]> {
		return [{ _id: ANSWER_TO_LIFE }];
	}
}

class MongoCollectionMock {
	readonly internalCursor: MongoCursorMock;
	constructor() {
		this.internalCursor = new MongoCursorMock();
	}
	find(): MongoCursorMock {
		return this.internalCursor;
	}
	async deleteOne(entry: Entry): Promise<mongodb.DeleteWriteOpResultObject> {
		return {
			result: {
				ok: 1,
				n: 1,
			},
			deletedCount: 1,
		};
	}
	async insertOne(
		entry: Entry,
	): Promise<mongodb.InsertOneWriteOpResult<Entry>> {
		return {
			connection: {},
			insertedCount: 1,
			insertedId: entry._id,
			ops: [entry],
			result: {
				ok: 1,
				n: 1,
			},
		};
	}
	async replaceOne(a: any, b: any, c: any): Promise<any> {
		return Promise.resolve();
	}
	async updateOne(a: any, b: any, c: any): Promise<void> {
		return Promise.resolve();
	}
	async findOneAndUpdate(
		a: any,
		b: any,
		c: any,
	): Promise<MongoFindAndModifyWriteOpResultObjectMock> {
		return Promise.resolve({
			value: {
				seq: ANSWER_TO_LIFE,
			},
		});
	}
}

class MongoDbMock {
	readonly internalCollection: MongoCollectionMock;
	constructor() {
		this.internalCollection = new MongoCollectionMock();
	}
	collection(_: string): MongoCollectionMock {
		return this.internalCollection;
	}
}

describe('database', () => {
	let db: Database;
	let dbMock: MongoDbMock;

	before(() => {
		db = myContainer.get<Database>(TYPES.Database);
		dbMock = new MongoDbMock();
		chai.use(chaiAsPromised);
	});

	it('connect should throw on connection fail', async () => {
		const errMessage = 'foobar';
		const clientConnectStub = sinon.stub(db['client'], 'connect');
		clientConnectStub.rejects(errMessage);

		try {
			await db.connect();
		} catch (err) {
			chai.expect(err.name).to.equal(errMessage);
			clientConnectStub.restore();
			return;
		}

		chai.assert.fail('did not throw');
	});

	it('connect should setup collection', async () => {
		const client = db['client'];

		const clientConnectStub = sinon.stub(client, 'connect');
		clientConnectStub.resolves();

		const updateOneStub = sinon.stub(dbMock.internalCollection, 'updateOne');

		const clientDbStub = sinon.stub(client, 'db');
		clientDbStub.returns(dbMock as any);

		await db.connect();

		chai.expect(updateOneStub.calledOnce).to.be.true;
		chai.expect(db['_collection']).to.equal(dbMock.internalCollection as any);

		clientDbStub.restore();
		updateOneStub.restore();
		clientConnectStub.restore();

		db['_db'] = undefined;
		db['_collection'] = undefined;
	});

	it('close should call close of client', () => {
		const clientCLoseStub = sinon.stub(db['client'], 'close');

		db.close();

		chai.assert.ok(clientCLoseStub.calledOnce);

		clientCLoseStub.restore();
	});

	it('nextID should reject with error', () =>
		chai.expect(db.nextID()).to.eventually.be.rejectedWith(ERRORS.nullDb));

	it(`nextID should return ${ANSWER_TO_LIFE}`, async () => {
		const dbStub = sinon.stub(db, 'db');
		dbStub.get(() => dbMock);

		await chai.expect(db.nextID()).to.eventually.equal(ANSWER_TO_LIFE);

		dbStub.restore();
	});

	it('all should reject with error', () =>
		chai.expect(db.all()).to.eventually.be.rejectedWith(ERRORS.nullCollection));

	it('all should returns a promise of entry array', async () => {
		const collectionStub = sinon.stub(db, 'collection');
		collectionStub.get(() => dbMock.internalCollection);

		const entries = await db.all();

		chai.expect(entries[0]._id).to.equal(ANSWER_TO_LIFE);

		collectionStub.restore();
	});

	it('insert should reject with error', () =>
		chai
			.expect(db.insert({ _id: ANSWER_TO_LIFE }))
			.to.eventually.be.rejectedWith(ERRORS.nullCollection));

	it('insert should return number of inserted', async () => {
		const collectionStub = sinon.stub(db, 'collection');
		collectionStub.get(() => dbMock.internalCollection);

		const res = await db.insert({ _id: ANSWER_TO_LIFE });
		chai.expect(res.insertedId).to.equal(ANSWER_TO_LIFE);

		collectionStub.restore();
	});

	it('replace should reject with error', () =>
		chai
			.expect(db.replace({ _id: ANSWER_TO_LIFE }, true))
			.to.eventually.be.rejectedWith(ERRORS.nullCollection));

	it('replace should call replaceOne', () => {
		const collectionStub = sinon.stub(db, 'collection');
		collectionStub.get(() => dbMock.internalCollection);

		const replaceOneStub = sinon.stub(dbMock.internalCollection, 'replaceOne');

		db.replace({ _id: ANSWER_TO_LIFE }, true);

		chai.expect(replaceOneStub.calledOnce).to.be.true;

		replaceOneStub.restore();
		collectionStub.restore();
	});

	it('delete should reject with error', () =>
		chai
			.expect(db.delete({ _id: ANSWER_TO_LIFE }))
			.to.eventually.be.rejectedWith(ERRORS.nullCollection));

	it('delete should return 1', async () => {
		const collectionStub = sinon.stub(db, 'collection');
		collectionStub.get(() => dbMock.internalCollection);

		const res = await db.delete({ _id: ANSWER_TO_LIFE });
		chai.expect(res.deletedCount).to.equal(1);

		collectionStub.restore();
	});
});
