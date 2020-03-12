// tslint:disable: no-any no-string-literal no-unused-expression
// https://www.chaijs.com/api/bdd/#method_true

import chai from 'chai';
import express from 'express';
import flatbuffers from 'flatbuffers';
import log from 'loglevel';
import mongodb from 'mongodb';
import sinon from 'sinon';
import supertest from 'supertest';

import { Application } from '../application';
import { ANSWER_TO_LIFE, StatusCode, TYPES } from '../constants';
import { Draw, Draws } from '../data_generated';
import { Database, Entry } from '../database';
import { myContainer } from '../inversify.config';
import { Router } from '../router';

class ResMock {
	code?: number;
	body?: string;
	status(code: number): ResMock {
		this.code = code;
		return this;
	}
	send(body: string): void {
		this.body = body;
	}
}

describe('all', () => {
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

	it('should invalidate short name', () => {
		const fbb = new flatbuffers.flatbuffers.Builder();
		const nameOffset = fbb.createString('yo');
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.equal('nom “yo” invalide');
	});

	it('should invalidate long name', () => {
		const fbb = new flatbuffers.flatbuffers.Builder();
		const name = 'this is more than 21 characters';
		const nameOffset = fbb.createString(name);
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.equal(`nom “${name}” invalide`);
	});

	it('should invalidate short tag', () => {
		const fbb = new flatbuffers.flatbuffers.Builder();
		const nameOffset = fbb.createString('correct name');
		const tag1 = fbb.createString('correct tag');
		const tag2 = fbb.createString('yo');
		const tags = Draw.createTagsVector(fbb, [tag1, tag2]);
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		Draw.addTags(fbb, tags);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.equal('étiquette “yo” invalide');
	});

	it('should invalidate long tag', () => {
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
		chai.expect(errMsg).to.be.equal(`étiquette “${tag}” invalide`);
	});

	it('should validate', () => {
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

	it('should fail with 500 on methodGet', () => {
		const stub = sinon.stub(db, 'all');
		const errMsg = 'oops something went wrong';
		stub.throwsException(errMsg);
		const reqHandler = router['methodGet']();
		const cb = sinon.spy();
		reqHandler({} as any, {} as any, cb);
		chai.expect(cb.args[0][0].name).to.equal(errMsg);
		chai.expect(cb.calledOnce);
		stub.restore();
	});

	it('should returns entries inside methodGet', async () => {
		const stubDbAll = sinon.stub(db, 'all');
		const fbb1 = new flatbuffers.flatbuffers.Builder();
		const nameOffset = fbb1.createString('correct name');
		const tag = 'correct tag';
		const tagOffset = fbb1.createString(tag);
		const tagsOffset = Draw.createTagsVector(fbb1, [tagOffset]);
		Draw.start(fbb1);
		Draw.addName(fbb1, nameOffset);
		Draw.addTags(fbb1, tagsOffset);
		fbb1.finish(Draw.end(fbb1));
		const entries: Entry[] = [
			{
				_id: 42,
				data: new mongodb.Binary(Buffer.from(fbb1.asUint8Array())),
			},
		];
		stubDbAll.returns(new Promise(r => r(entries)));
		const reqHandler = router['methodGet']();
		const cb = sinon.spy();
		const res = {
			send: (_bufArr: Uint8Array): void => {
				return;
			},
		};
		const stubRes = sinon.stub(res, 'send');
		let bufArr: Uint8Array | undefined;
		stubRes.callsFake((bufArr_: Uint8Array) => (bufArr = bufArr_));
		await reqHandler({} as any, res as any, cb);
		if (bufArr == null) {
			chai.expect(false);
			return;
		}
		const bufObj = Buffer.from(bufArr);
		const fbb2 = new flatbuffers.flatbuffers.ByteBuffer(bufObj);
		const draws = Draws.getRoot(fbb2);
		chai.expect(draws.drawBuffersLength()).to.equal(1);
		const drawBuffer = draws.drawBuffers(0);
		chai.expect(drawBuffer).to.not.be.null;
		chai.expect(drawBuffer?.id()).to.equal(ANSWER_TO_LIFE);
		stubDbAll.restore();
		stubRes.restore();
	});

	it('should fail with 406 on methodPost', () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		const errMsg = 'fail';
		stubVerify.returns(errMsg);
		const reqHandler = router['methodPost']();
		const cb = sinon.spy();
		const res = new ResMock();
		reqHandler({} as any, res as any, cb);
		chai.expect(cb.called).to.be.false;
		chai.expect(res.code).to.equal(StatusCode.NOT_ACCEPTABLE);
		chai.expect(res.body).to.equal(errMsg);
		stubVerify.restore();
	});

	it('methodPost should reject empty request', async () => {
		return supertest(app)
			.post('/draw')
			.expect(StatusCode.NOT_ACCEPTABLE)
			.then();
	});

	it('methodPost should fail on nextID error', async () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		stubVerify.returns(null);

		const stubDbNext = sinon.stub(db, 'nextID');
		stubDbNext.rejects('foobar');

		app.use(Application['err']);
		await supertest(app)
			.post('/draw')
			.expect(StatusCode.INTERNAL_SERVER_ERROR)
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

		await supertest(app)
			.post('/draw')
			.set('Content-Type', 'application/octet-stream')
			.then();

		chai.expect(entry?._id).to.equal(ANSWER_TO_LIFE);

		chai.expect(stubVerify.calledOnce).to.be.true;
		chai.expect(stubDbNext.calledOnce).to.be.true;
		chai.expect(stubDbInsert.calledOnce).to.be.true;

		stubVerify.restore();
		stubDbNext.restore();
		stubDbInsert.restore();
	});

	it('methodPut should reject empty request', async () =>
		supertest(app)
			.put(`/draw/${ANSWER_TO_LIFE}`)
			.expect(StatusCode.NOT_ACCEPTABLE)
			.then());

	it('methodPut should reject id zero', async () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		stubVerify.returns(null);

		return supertest(app)
			.put('/draw/0')
			.expect(StatusCode.NOT_ACCEPTABLE)
			.then(() => stubVerify.restore());
	});

	it('methodPut should reject negative id', async () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		stubVerify.returns(null);

		return supertest(app)
			.put(`/draw/-${ANSWER_TO_LIFE}`)
			.expect(StatusCode.NOT_ACCEPTABLE)
			.then(() => stubVerify.restore());
	});

	it('methodPut should fail on replace error', async () => {
		const stubVerify = sinon.stub(router as any, 'verify');
		stubVerify.returns(null);

		const stubDbReplace = sinon.stub(db, 'replace');
		stubDbReplace.rejects('foobar');

		app.use(Application['err']);
		await supertest(app)
			.put(`/draw/${ANSWER_TO_LIFE}`)
			.set('Content-Type', 'application/octet-stream')
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
			.set('Content-Type', 'application/octet-stream')
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

		await supertest(app)
			.delete(`/draw/${ANSWER_TO_LIFE}`)
			.expect(StatusCode.INTERNAL_SERVER_ERROR)
			.then();

		chai.expect(stubDbDelete.calledOnce).to.be.true;
		chai.expect(stubDbDelete.args[0][0]).to.equal(ANSWER_TO_LIFE);

		stubDbDelete.restore();
	});

	it('methodDelete should delete', async () => {
		const stubDbDelete = sinon.stub(db, 'delete');

		await supertest(app)
			.delete(`/draw/${ANSWER_TO_LIFE}`)
			.expect(StatusCode.ACCEPTED)
			.then();

		chai.expect(stubDbDelete.calledOnce).to.be.true;
		chai.expect(stubDbDelete.args[0][0]).to.equal(ANSWER_TO_LIFE);

		stubDbDelete.restore();
	});
});
