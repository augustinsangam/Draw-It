// tslint:disable: no-string-literal no-unused-expression

import chai from 'chai';
import flatbuffers from 'flatbuffers';

import { TYPES } from '../constants';
import { Draw } from '../data_generated';
import { myContainer } from '../inversify.config';
import { Router } from '../router';

describe('router: verify', () => {
	let router: Router;

	before(() => {
		router = myContainer.get<Router>(TYPES.Router);
	});

	it('#verify should invalidate short name', () => {
		const fbb = new flatbuffers.flatbuffers.Builder();
		const name = 'yo';
		const nameOffset = fbb.createString(name);
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.equal(`Nom “${name}” invalide`);
	});

	it('#verify should invalidate long name', () => {
		const fbb = new flatbuffers.flatbuffers.Builder();
		const name = 'this is more than 21 characters';
		const nameOffset = fbb.createString(name);
		Draw.start(fbb);
		Draw.addName(fbb, nameOffset);
		fbb.finish(Draw.end(fbb));
		const errMsg = router['verify'](fbb.asUint8Array());
		chai.expect(errMsg).to.be.equal(`Nom “${name}” invalide`);
	});

	it('#verify should invalidate short tag', () => {
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

	it('#verify should invalidate long tag', () => {
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

	it('#verify should return null', () => {
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
});
