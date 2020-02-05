import chai from 'chai';

import { Warrior } from '../interfaces';
import { myContainer } from '../inversify.config';
import { TYPES } from '../types';

describe('all', () => {
	let ninja: Warrior;
	beforeEach(() => {
		ninja = myContainer.get<Warrior>(TYPES.Warrior);
	});
	it('should cut', () => {
		chai.expect(ninja.fight()).eql('cut!');
	});
	it('should hit', () => {
		chai.expect(ninja.sneak()).eql('hit!');
	});
});
