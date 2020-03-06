import chai from 'chai';

import { TYPES } from '../constants';
import { Database } from '../database';
import { myContainer } from '../inversify.config';

describe('all', () => {
	let db: Database;

	beforeEach(() => {
		db = myContainer.get<Database>(TYPES.Database);
	});

	it('should cut', () => {
		// console.log(db['client']);
		chai.expect(true).be.true;
	});
});
