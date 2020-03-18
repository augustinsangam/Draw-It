// tslint:disable: no-string-literal max-classes-per-file no-unused-expression no-magic-numbers no-any

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import express from 'express';
import sinon from 'sinon';
import supertest from 'supertest';

import { promisifiedTimeout, StatusCode, TIMEOUT, TYPES } from '../constants';
import { myContainer } from '../inversify.config';
import { Server } from '../server';

class SocketMock {
	active: boolean;
	constructor() {
		this.active = true;
	}
	destroy(): void {
		this.active = false;
	}
}

describe('server', () => {
	let server: Server;

	before(() => chai.use(chaiAsPromised));

	beforeEach(() => {
		server = myContainer.get<Server>(TYPES.Server);
	});

	it('#promisifyServerClose should return a promise', async () =>
		chai
			.expect(server['promisifyServerClose']())
			.to.eventually.be.rejectedWith('Server is not running.'));

	it('#close should destroy all active sockets', async () => {
		const openedSockets = [new SocketMock(), new SocketMock()];
		const openedSocketsMock = sinon.stub(server as any, 'openedSockets');
		openedSocketsMock.value(openedSockets);

		const serverStub = sinon.stub(server as any, 'promisifyServerClose');
		serverStub.returns(
			new Promise((resolve) => setTimeout(resolve, TIMEOUT + 200)),
		);

		await server.close();
		chai.expect(openedSockets[0].active).to.be.false;
		chai.expect(openedSockets[1].active).to.be.false;

		serverStub.restore();
		openedSocketsMock.restore();
	});

	it('#launch should call db.connect', async () => {
		const dbConnectStub = sinon.stub(server['db'], 'connect');
		dbConnectStub.resolves();

		const serverListenStub = sinon.stub(server['server'], 'listen');

		await server.launch();
		chai.expect(dbConnectStub.calledOnce).to.be.true;

		serverListenStub.restore();
		dbConnectStub.restore();
	});

	it('#launch should call server.listen', async () => {
		const dbConnectStub = sinon.stub(server['db'], 'connect');
		dbConnectStub.resolves();

		const serverListenStub = sinon.stub(server['server'], 'listen');

		await server.launch();
		chai.expect(serverListenStub.calledOnce).to.be.true;

		serverListenStub.restore();
		dbConnectStub.restore();
	});

	it('#should add socket on connection', async () => {
		const app = express();
		app.get('/', (_, res) => res.sendStatus(StatusCode.OK));
		const appCallbackStub = sinon.stub(server['app'], 'callback');
		appCallbackStub.returns(app);

		server['setupServer']();
		await supertest(server['server'])
			.get('/')
			.then();
		chai.expect(server['openedSockets'].size).to.equal(1);
		server['server'].close();

		appCallbackStub.restore();
	});

	it('#should remove socket on close', async () => {
		const app = express();
		app.get('/', (_, res) => res.sendStatus(StatusCode.OK));
		const appCallbackStub = sinon.stub(server['app'], 'callback');
		appCallbackStub.returns(app);

		server['setupServer']();
		await supertest(server['server'])
			.get('/')
			.then();
		server['server'].close();

		await promisifiedTimeout(100);

		chai.expect(server['openedSockets'].size).to.equal(0);

		appCallbackStub.restore();
	});
});
