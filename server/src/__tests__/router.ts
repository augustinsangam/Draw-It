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

	it('verify should invalidate short name', () => {
		const fbb = new flatbuffers.flatbuffers.Builder();
		const name = 'yo';
		const nameOffset = fbb.createString(name);
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.equal(`Nom “${name}” invalide`);
	});

	it('verify should invalidate long name', () => {
		const fbb = new flatbuffers.flatbuffers.Builder();
		const name = 'this is more than 21 characters';
		const nameOffset = fbb.createString(name);
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.equal(`Nom “${name}” invalide`);
	});

	it('verify should invalidate short tag', () => {
		const fbb = new flatbuffers.flatbuffers.Builder();
		const tag = 'yo';
		const nameOffset = fbb.createString('correct name');
		const tagOffset1 = fbb.createString('correct tag');
		const tagOffset2 = fbb.createString(tag);
		const tags = Draw.createTagsVector(fbb, [tagOffset1, tagOffset2]);
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		Draw.addTags(fbb, tags);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.equal(`Étiquette “${tag}” invalide`);
	});

	it('verify should invalidate long tag', () => {
		const fbb = new flatbuffers.flatbuffers.Builder();
		const nameOffset = fbb.createString('correct name');
		const tag = 'this is more than 21 characters';
		const tag1 = fbb.createString('correct tag');
		const tag2 = fbb.createString(tag);
		const tags = Draw.createTagsVector(fbb, [tag1, tag2]);
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		Draw.addTags(fbb, tags);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.equal(`Étiquette “${tag}” invalide`);
	});

	it('verify should return null', () => {
		const fbb = new flatbuffers.flatbuffers.Builder();
		const nameOffset = fbb.createString('correct name');
		const tag1 = fbb.createString('correct tag #1');
		const tag2 = fbb.createString('correct tag #2');
		const tags = Draw.createTagsVector(fbb, [tag1, tag2]);
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		Draw.addTags(fbb, tags);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.null;
	});

	it('methodGet should fail on db.all error', async () => {
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

	it('methodGet should returns all entries', async () => {
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

	it('methodPost should reject non-binary request', async () =>
		supertest(app)
			.post('/draw')
			.expect(StatusCode.BAD_REQUEST)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then(({ text }) => chai.expect(text).to.equal('Requète incorrecte')));

	it('methodPost should reject wrong request', async () => {
		const errMsg = 'foobar';

		const verifyStub = sinon.stub(router as any, 'verify');
		verifyStub.returns(errMsg);

		const res = await supertest(app)
			.post('/draw')
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.NOT_ACCEPTABLE)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then();

		chai.expect(res.text).to.equal(errMsg);

		verifyStub.restore();
	});

	it('methodPost should fail on nextID error', async () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		stubVerify.returns(null);

		const stubDbNext = sinon.stub(db, 'nextID');
		stubDbNext.rejects('foobar');

		app.use(Application['err']);
		await supertest(app)
			.post('/draw')
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.INTERNAL_SERVER_ERROR)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then();

		chai.expect(stubDbNext.calledOnce).to.be.true;

		stubVerify.restore();
		stubDbNext.restore();
	});

	it('methodPost should insert', async () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		stubVerify.returns(null);

		const stubDbNext = sinon.stub(db, 'nextID');
		stubDbNext.resolves(ANSWER_TO_LIFE);

		let entry: Entry | undefined;
		const stubDbInsert = sinon.stub(db, 'insert');
		stubDbInsert.callsFake(async localEntry => {
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

		chai.expect(stubVerify.calledOnce).to.be.true;
		chai.expect(stubDbNext.calledOnce).to.be.true;
		chai.expect(stubDbInsert.calledOnce).to.be.true;

		stubVerify.restore();
		stubDbNext.restore();
		stubDbInsert.restore();
	});

	it('methodPut should reject non-binary request', async () =>
		supertest(app)
			.put(`/draw/${ANSWER_TO_LIFE}`)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then(({ text }) => chai.expect(text).to.equal('Requète incorrecte')));

	it('methodPut should reject id zero', async () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		stubVerify.returns(null);

		return supertest(app)
			.put('/draw/0')
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.BAD_REQUEST)
			.then(() => stubVerify.restore());
	});

	it('methodPut should reject negative id', async () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		stubVerify.returns(null);

		return supertest(app)
			.put(`/draw/-${ANSWER_TO_LIFE}`)
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.BAD_REQUEST)
			.then(() => stubVerify.restore());
	});

	it('methodPut should reject wrong request', async () => {
		const errMsg = 'foobar';

		const verifyStub = sinon.stub(router as any, 'verify');
		verifyStub.returns(errMsg);

		const res = await supertest(app)
			.put(`/draw/${ANSWER_TO_LIFE}`)
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.NOT_ACCEPTABLE)
			.expect('Content-Type', ContentType.PLAIN_UTF8)
			.then();

		chai.expect(res.text).to.equal(errMsg);

		verifyStub.restore();
	});

	it('methodPut should fail on replace error', async () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		stubVerify.returns(null);

		const stubDbReplace = sinon.stub(db, 'replace');
		stubDbReplace.rejects('foobar');

		app.use(Application['err']);
		await supertest(app)
			.put(`/draw/${ANSWER_TO_LIFE}`)
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.INTERNAL_SERVER_ERROR)
			.then();

		stubVerify.restore();
		stubDbReplace.restore();
	});

	it('methodPut should replace', async () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		stubVerify.returns(null);

		const stubDbReplace = sinon.stub(db, 'replace');

		await supertest(app)
			.put(`/draw/${ANSWER_TO_LIFE}`)
			.set('Content-Type', ContentType.OCTET_STREAM)
			.expect(StatusCode.ACCEPTED)
			.then();

		chai.expect(stubVerify.calledOnce).to.be.true;
		chai.expect(stubDbReplace.calledOnce).to.be.true;

		const entry = stubDbReplace.args[0][0];
		chai.expect(entry._id).to.equal(ANSWER_TO_LIFE);

		stubVerify.restore();
		stubDbReplace.restore();
	});

	it('methodDelete should fail on delete error', async () => {
		const stubDbDelete = sinon.stub(db, 'delete');
		stubDbDelete.rejects('foobar');

		app.use(Application['err']);
		await supertest(app)
			.delete(`/draw/${ANSWER_TO_LIFE}`)
			.expect(StatusCode.INTERNAL_SERVER_ERROR)
			.then();

		chai.expect(stubDbDelete.calledOnce).to.be.true;
		chai.expect(stubDbDelete.args[0][0]._id).to.equal(ANSWER_TO_LIFE);

		stubDbDelete.restore();
	});

	it('methodDelete should delete', async () => {
		const stubDbDelete = sinon.stub(db, 'delete');

		await supertest(app)
			.delete(`/draw/${ANSWER_TO_LIFE}`)
			.expect(StatusCode.ACCEPTED)
			.then();

		chai.expect(stubDbDelete.calledOnce).to.be.true;
		chai.expect(stubDbDelete.args[0][0]._id).to.equal(ANSWER_TO_LIFE);

		stubDbDelete.restore();
	});
});
