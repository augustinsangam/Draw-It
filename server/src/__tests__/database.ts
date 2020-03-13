// tslint:disable: no-any no-string-literal no-unused-expression

import chai from 'chai';
import sinon from 'sinon';

import { TYPES } from '../constants';
import { Database } from '../database';
import { myContainer } from '../inversify.config';

describe('all', () => {
	let db: Database;

	beforeEach(() => {
		db = myContainer.get<Database>(TYPES.Database);
	});

	it('connect should throw on connection fail', async () => {
		const errMessage = 'foobar';
		const clientConnectStub = sinon.stub(db['client'], 'connect');
		clientConnectStub.rejects(errMessage);

		try {
			await db.connect();
		} catch (err) {
			chai.expect(err.name).to.equal(errMessage);
			return;
		}

		clientConnectStub.restore();
		chai.assert.fail('did not throw');
	});

	it('connect should throw on connection fail', async () => {
		const errMessage = 'foobar';
		const clientConnectStub = sinon.stub(db['client'], 'connect');
		clientConnectStub.rejects(errMessage);

		try {
			await db.connect();
		} catch (err) {
			chai.expect(err.name).to.equal(errMessage);
			return;
		}

		clientConnectStub.restore();
		chai.assert.fail('did not throw');
	});

	it.only('connect should throw on connection fail', async () => {
		const client = db['client'];

		const clientConnectStub = sinon.stub(client, 'connect');
		clientConnectStub.resolves();

		const;
		// try {
		await db.connect();
		/*} catch (err) {
			chai.expect(err.name).to.equal(errMessage);
			return;
		}*/

		clientConnectStub.restore();
		chai.assert.fail('did not throw');
	});
});
