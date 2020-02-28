import chai from 'chai';

import { Database } from '../database';
import { myContainer } from '../inversify.config';
import { TYPES } from '../types';

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
