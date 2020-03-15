// tslint:disable: no-string-literal no-unused-expression

import chai from 'chai';
import express from 'express';
import log from 'loglevel';
import 'reflect-metadata';
import supertest from 'supertest';

import { Application } from '../application';
import { StatusCode, TYPES } from '../constants';
import { myContainer } from '../inversify.config';

const TIMEOUT = 100;

describe('application', () => {
	before(() => log.setLevel('silent'));

	it('callback should return express app', () => {
		const app = myContainer.get<Application>(TYPES.Application);
		chai.expect(app.callback()).to.equal(app['app']);
	});

	it('log should pass to next middleware', async () => {
		const app = express();
		app.use(Application['log']);
		app.get('/', (_, res) => res.sendStatus(StatusCode.OK));

		return supertest(app)
			.get('/')
			.timeout(TIMEOUT)
			.expect(StatusCode.OK)
			.then();
	});

	it('log should set Access-Control-Allow-Headers', async () => {
		const app = express();
		app.use(Application['log']);
		app.get('/', (_, res) => res.sendStatus(StatusCode.OK));

		const httpRes = await supertest(app)
			.get('/')
			.expect(StatusCode.OK)
			.then();

		chai.expect(httpRes.header['access-control-allow-headers']).to.not.be
			.undefined;
	});

	it('log should set Access-Control-Allow-Methods', async () => {
		const app = express();
		app.use(Application['log']);
		app.get('/', (_, res) => res.sendStatus(StatusCode.OK));

		const httpRes = await supertest(app)
			.get('/')
			.expect(StatusCode.OK)
			.then();

		chai.expect(httpRes.header['access-control-allow-methods']).to.not.be
			.undefined;
	});

	it('log should set Access-Control-Allow-Origin', async () => {
		const app = express();
		app.use(Application['log']);
		app.get('/', (_, res) => res.sendStatus(StatusCode.OK));

		const httpRes = await supertest(app)
			.get('/')
			.expect(StatusCode.OK)
			.then();

		chai.expect(httpRes.header['access-control-allow-origin']).to.not.be
			.undefined;
	});

	it(`err should send status ${StatusCode.INTERNAL_SERVER_ERROR}`, async () => {
		const app = express();
		app.get('/', (_, _1, next) => next(new Error('foobar')));
		app.use(Application['err']);
		log.setLevel('silent');

		return supertest(app)
			.get('/')
			.expect(StatusCode.INTERNAL_SERVER_ERROR)
			.then();
	});
});
