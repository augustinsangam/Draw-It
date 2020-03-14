// TODO: Pertinance du max-class
// tslint:disable: no-any no-string-literal no-unused-expression max-classes-per-file

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongodb from 'mongodb';
import sinon from 'sinon';

import { ANSWER_TO_LIFE, ERRORS, TYPES } from '../constants';
import { Database } from '../database';
import { myContainer } from '../inversify.config';

interface MongoFindAndModifyWriteOpResultObjectMock {
	value: {
		seq: number;
	};
}

class MongoCollectionMock {
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

describe('all', () => {
	let db: Database;

	before(() => {
		db = myContainer.get<Database>(TYPES.Database);
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

		const pseudoDb = new MongoDbMock();
		const updateOneStub = sinon.stub(pseudoDb.internalCollection, 'updateOne');

		const clientDbStub = sinon.stub(client, 'db');
		clientDbStub.returns(pseudoDb as any);

		await db.connect();

		chai.expect(updateOneStub.calledOnce).to.be.true;
		chai.expect(db['_collection']).to.equal(pseudoDb.internalCollection as any);

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
		const pseudoDb = new MongoDbMock();
		const clientDbStub = sinon.stub(db, 'db');
		clientDbStub.get(() => pseudoDb);

		await chai.expect(db.nextID()).to.eventually.equal(ANSWER_TO_LIFE);

		clientDbStub.restore();
	});

	it('all should reject with error', () =>
		chai.expect(db.all()).to.eventually.be.rejectedWith(ERRORS.nullCollection));

	it('insert should reject with error', () =>
		chai
			.expect(db.insert({ _id: ANSWER_TO_LIFE }))
			.to.eventually.be.rejectedWith(ERRORS.nullCollection));

	it('replace should reject with error', () =>
		chai
			.expect(db.replace({ _id: ANSWER_TO_LIFE }, true))
			.to.eventually.be.rejectedWith(ERRORS.nullCollection));

	it('delete should reject with error', () =>
		chai
			.expect(db.delete({ _id: ANSWER_TO_LIFE }))
			.to.eventually.be.rejectedWith(ERRORS.nullCollection));
});
