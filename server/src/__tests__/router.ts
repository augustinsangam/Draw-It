// tslint:disable: no-any no-string-literal no-unused-expression
// TSLint reports “expect(…).to.be.null;” (or true or false) as
// wrong, even if the syntax is correct.
// See https://www.chaijs.com/api/bdd/#method_ok

import chai from 'chai';
import express from 'express';
import flatbuffers from 'flatbuffers';
import log from 'loglevel';
import mongodb from 'mongodb';
import sinon from 'sinon';
import supertest from 'supertest';

import { Application } from '../application';
import { ANSWER_TO_LIFE, ContentType, StatusCode, TYPES } from '../constants';
import { Draw, Draws } from '../data_generated';
import { Database, Entry } from '../database';
import { myContainer } from '../inversify.config';
import { Router } from '../router';

describe('router', () => {
	let app: express.Express;
	let db: Database;
	let router: Router;

	before(() => {
		app = express();
		app.use(express.raw());
		db = myContainer.get<Database>(TYPES.Database);
		router = myContainer.get<Router>(TYPES.Router);
		app.use(router.router);
		log.setLevel('silent');
	});

	it('#methodGet should fail on db.all error', async () => {
		const errMsg = 'foobar';

		const dbAllStub = sinon.stub(db, 'all');
		dbAllStub.rejects(errMsg);

		app.use(Application['err']);
		const res = await supertest(app)
			.get('/draw')
			.expect(StatusCode.INTERNAL_SERVER_ERROR)
			.then();

		dbAllStub.restore();
	});

	it('#methodGet should returns all entries', async () => {
		const dbAllStub = sinon.stub(db, 'all');
		const name = 'correct name';
		const tag = 'correct tag';

		const fbBuilder = new flatbuffers.flatbuffers.Builder();
		const nameOffset = fbBuilder.createString(name);
		const tagOffset = fbBuilder.createString(tag);
		const tagsOffset = Draw.createTagsVector(fbBuilder, [tagOffset]);
		Draw.start(fbBuilder);
		Draw.addName(fbBuilder, nameOffset);
		Draw.addTags(fbBuilder, tagsOffset);
		fbBuilder.finish(Draw.end(fbBuilder));

		const entries: Entry[] = [
			{
				_id: ANSWER_TO_LIFE,
				data: new mongodb.Binary(Buffer.from(fbBuilder.asUint8Array())),
			},
		];
		dbAllStub.resolves(entries);

		const res = await supertest(app)
			.get('/draw')
			.expect(StatusCode.OK)
			.expect('Content-Type', ContentType.OCTET_STREAM)
			.then();
		const fbByteBuffer1 = new flatbuffers.flatbuffers.ByteBuffer(res.body);

		const draws = Draws.getRoot(fbByteBuffer1);
		chai.expect(draws.drawBuffersLength()).to.equal(1);

		const drawBuffer = draws.drawBuffers(0);
		chai.expect(drawBuffer).to.not.be.null;
		chai.expect(drawBuffer?.id()).to.equal(ANSWER_TO_LIFE);

		const bytes = drawBuffer?.bufArray();
		chai.expect(bytes).to.not.be.null;
		if (bytes == null) {
			return;
		}
		const fbByteBuffer2 = new flatbuffers.flatbuffers.ByteBuffer(bytes);

		const draw = Draw.getRoot(fbByteBuffer2);
		chai.expect(draw.name()).to.equal(name);
		chai.expect(draw.tagsLength()).to.equal(1);
		chai.expect(draw.tags(0)).to.equal(tag);

		dbAllStub.restore();
	});

	it('#methodPost should reject non-binary request', async () =>
		supertest(app)
			.post('/draw')
			.expect(StatusCode.BAD_REQUEST)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then(({ text }) => chai.expect(text).to.equal('Requète incorrecte')));

	it('#methodPost should reject wrong request', async () => {
		const errMsg = 'foobar';

		const verifyBufferStub = sinon.stub(router as any, 'verifyBuffer');
		verifyBufferStub.returns(errMsg);

		const res = await supertest(app)
			.post('/draw')
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.NOT_ACCEPTABLE)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then();

		chai.expect(res.text).to.equal(errMsg);

		verifyBufferStub.restore();
	});

	it('#methodPost should fail on nextID error', async () => {
		const verifyBufferStub = sinon.stub(router as any, 'verifyBuffer');
		verifyBufferStub.returns(null);

		const dbNextStub = sinon.stub(db, 'nextID');
		dbNextStub.rejects('foobar');

		app.use(Application['err']);
		await supertest(app)
			.post('/draw')
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.INTERNAL_SERVER_ERROR)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then();

		chai.expect(dbNextStub.calledOnce).to.be.true;

		verifyBufferStub.restore();
		dbNextStub.restore();
	});

	it('#methodPost should insert', async () => {
		const verifyBufferStub = sinon.stub(router as any, 'verifyBuffer');
		verifyBufferStub.returns(null);

		const dbNextStub = sinon.stub(db, 'nextID');
		dbNextStub.resolves(ANSWER_TO_LIFE);

		let entry: Entry | undefined;
		const dbInsertStub = sinon.stub(db, 'insert');
		dbInsertStub.callsFake(async (localEntry) => {
			entry = localEntry;
			return Promise.resolve({} as any);
		});

		const res = await supertest(app)
			.post('/draw')
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.CREATED)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then();

		chai.expect(res.text).to.equal(ANSWER_TO_LIFE.toString());
		chai.expect(entry?._id).to.equal(ANSWER_TO_LIFE);

		chai.expect(verifyBufferStub.calledOnce).to.be.true;
		chai.expect(dbNextStub.calledOnce).to.be.true;
		chai.expect(dbInsertStub.calledOnce).to.be.true;

		verifyBufferStub.restore();
		dbNextStub.restore();
		dbInsertStub.restore();
	});

	it('#methodPut should reject non-binary request', async () =>
		supertest(app)
			.put(`/draw/${ANSWER_TO_LIFE}`)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then(({ text }) => chai.expect(text).to.equal('Requète incorrecte')));

	it('#methodPut should reject id zero', async () => {
		const verifyBufferStub = sinon.stub(router as any, 'verifyBuffer');
		verifyBufferStub.returns(null);

		return supertest(app)
			.put('/draw/0')
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.BAD_REQUEST)
			.then(() => verifyBufferStub.restore());
	});

	it('#methodPut should reject negative id', async () => {
		const verifyBufferStub = sinon.stub(router as any, 'verifyBuffer');
		verifyBufferStub.returns(null);

		return supertest(app)
			.put(`/draw/-${ANSWER_TO_LIFE}`)
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.BAD_REQUEST)
			.then(() => verifyBufferStub.restore());
	});

	it('#methodPut should reject wrong request', async () => {
		const errMsg = 'foobar';

		const verifyBufferStub = sinon.stub(router as any, 'verifyBuffer');
		verifyBufferStub.returns(errMsg);

		const res = await supertest(app)
			.put(`/draw/${ANSWER_TO_LIFE}`)
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.NOT_ACCEPTABLE)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then();

		chai.expect(res.text).to.equal(errMsg);

		verifyBufferStub.restore();
	});

	it('#methodPut should fail on replace error', async () => {
		const verifyBufferStub = sinon.stub(router as any, 'verifyBuffer');
		verifyBufferStub.returns(null);

		const dbReplaceStub = sinon.stub(db, 'replace');
		dbReplaceStub.rejects('foobar');

		app.use(Application['err']);
		await supertest(app)
			.put(`/draw/${ANSWER_TO_LIFE}`)
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.INTERNAL_SERVER_ERROR)
			.then();

		verifyBufferStub.restore();
		dbReplaceStub.restore();
	});

	it('#methodPut should replace', async () => {
		const verifyBufferStub = sinon.stub(router as any, 'verifyBuffer');
		verifyBufferStub.returns(null);

		const dbReplaceStub = sinon.stub(db, 'replace');

		await supertest(app)
			.put(`/draw/${ANSWER_TO_LIFE}`)
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.ACCEPTED)
			.then();

		chai.expect(verifyBufferStub.calledOnce).to.be.true;
		chai.expect(dbReplaceStub.calledOnce).to.be.true;

		const entry = dbReplaceStub.args[0][0];
		chai.expect(entry._id).to.equal(ANSWER_TO_LIFE);

		verifyBufferStub.restore();
		dbReplaceStub.restore();
	});

	it('#methodDelete should fail on wrong id', async () => {
		const verifyIDStub = sinon.stub(router as any, 'verifyID');
		verifyIDStub.returns({
			id: 0,
			err: new Error('foobar'),
		});

		app.use(Application['err']);
		return supertest(app)
			.delete(`/draw/${ANSWER_TO_LIFE}`)
			.expect(StatusCode.BAD_REQUEST)
			.then(() => verifyIDStub.restore());
	});

	it('#methodDelete should fail on delete error', async () => {
		const dbDeleteStub = sinon.stub(db, 'delete');
		dbDeleteStub.rejects('foobar');

		app.use(Application['err']);
		await supertest(app)
			.delete(`/draw/${ANSWER_TO_LIFE}`)
			.expect(StatusCode.INTERNAL_SERVER_ERROR)
			.then();

		chai.expect(dbDeleteStub.calledOnce).to.be.true;
		chai.expect(dbDeleteStub.args[0][0]._id).to.equal(ANSWER_TO_LIFE);

		dbDeleteStub.restore();
	});

	it('#methodDelete should delete', async () => {
		const dbDeleteStub = sinon.stub(db, 'delete');

		await supertest(app)
			.delete(`/draw/${ANSWER_TO_LIFE}`)
			.expect(StatusCode.ACCEPTED)
			.then();

		chai.expect(dbDeleteStub.calledOnce).to.be.true;
		chai.expect(dbDeleteStub.args[0][0]._id).to.equal(ANSWER_TO_LIFE);

		dbDeleteStub.restore();
	});
});
