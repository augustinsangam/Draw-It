import chai from 'chai';
import express from 'express';
import flatbuffers from 'flatbuffers';
import mongodb from 'mongodb';
import sinon from 'sinon';

import { Draw, Draws } from '../data_generated';
import { Database, Entry } from '../database';
import { myContainer } from '../inversify.config';
import { Router } from '../router';
import { TYPES } from '../types';

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
	it('should invalidate short name', () => {
		const router = myContainer.get<Router>(TYPES.Router);
		const fbb = new flatbuffers.flatbuffers.Builder();
		const nameOffset = fbb.createString('yo');
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.equal('nom “yo” invalide');
	});

	it('should invalidate long name', () => {
		const router = myContainer.get<Router>(TYPES.Router);
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
		const router = myContainer.get<Router>(TYPES.Router);
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
		const router = myContainer.get<Router>(TYPES.Router);
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
		const router = myContainer.get<Router>(TYPES.Router);
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
		const db = myContainer.get<Database>(TYPES.Database);
		const stub = sinon.stub(db, 'all');
		const errMsg = 'oops something went wrong';
		stub.throwsException(errMsg);
		const router = myContainer.get<Router>(TYPES.Router);
		const reqHandler = router['methodGet']();
		const cb = sinon.spy();
		reqHandler({} as any, {} as any, cb);
		chai.expect(cb.args[0][0].name).to.equal(errMsg);
		chai.expect(cb.calledOnce);
		stub.restore();
	});

	it('should returns entries inside methodGet', async () => {
		const db = myContainer.get<Database>(TYPES.Database);
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
				data: new mongodb.Binary(new Buffer(fbb1.asUint8Array())),
			},
		];
		stubDbAll.returns(new Promise(r => r(entries)));
		const router = myContainer.get<Router>(TYPES.Router);
		const reqHandler = router['methodGet']();
		const cb = sinon.spy();
		const res = {
			send: function(_bufArr: Uint8Array): void {
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
		chai.expect(drawBuffer?.id()).to.equal(42);
		stubDbAll.restore();
		stubRes.restore();
	});

	it('should fail with 406 on methodPost', () => {
		const router = myContainer.get<Router>(TYPES.Router);
		const db = myContainer.get<Database>(TYPES.Database);
		const stubVerify = sinon.stub(router as any, 'verify');
		const errMsg = 'fail';
		stubVerify.returns(errMsg);
		const reqHandler = router['methodPost']();
		const cb = sinon.spy();
		const res = new ResMock();
		reqHandler({} as any, res as any, cb);
		chai.expect(cb.called).to.be.false;
		chai.expect(res.code).to.equal(406);
		chai.expect(res.body).to.equal(errMsg);
		stubVerify.restore();
	});

	it('should fail with 500 on methodPost', () => {
		const router = myContainer.get<Router>(TYPES.Router);
		const db = myContainer.get<Database>(TYPES.Database);
		const stubVerify = sinon.stub(router as any, 'verify');
		const errMsg = 'fail';
		stubVerify.returns(errMsg);
		const reqHandler = router['methodPost']();
		const cb = sinon.spy();
		const res = new ResMock();
		reqHandler({} as any, res as any, cb);
		chai.expect(cb.called).to.be.false;
		chai.expect(res.body).to.equal(errMsg);
		stubVerify.restore();
	});
});
