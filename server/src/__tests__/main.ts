// tslint:disable: no-magic-numbers

import chai from 'chai';
import log from 'loglevel';
import sinon from 'sinon';

import { TYPES } from '../constants';
import { myContainer } from '../inversify.config';
import { main } from '../main';
import { Server } from '../server';

describe('main', () => {
	let server: Server;

	before(() => (server = myContainer.get<Server>(TYPES.Server)));

	it('#main should launch all application', async () =>
		main(server)(new Promise((resolve) => setTimeout(resolve, 5000)))).timeout(
		7000,
	);

	it('#main should not abort program on launch fail', async () => {
		const serverLaunchStub = sinon.stub(server, 'launch');
		serverLaunchStub.rejects('foobar');

		log.setLevel('silent');
		try {
			await main(server)(Promise.resolve());
		} catch (_) {
			chai.assert.fail();
		}

		serverLaunchStub.restore();
	}).timeout(7000);
});
