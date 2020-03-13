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

	it.only('connect should handle connection fail', () => {
		const client = db['client'];
		const clientConnectStub = sinon.stub(client, 'connect');
		clientConnectStub.rejects('foobar');

		db.connect();

		clientConnectStub.restore();
	});
});
