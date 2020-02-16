import { log } from 'util';

import { myContainer } from './inversify.config';
import { Server } from './server';
import { TYPES } from './types';

const s = myContainer.get<Server>(TYPES.Server);

const sigint = new Promise(resolve =>
	process.on('SIGINT', () => {
		log('SIGINT');
		resolve();
	}),
);

s.launch()
	.then(() => console.info('Server launched'))
	.then(() => sigint)
	.then(() => s.close())
	.then(() => console.info('Server closed'))
	.catch(err => {
		console.error('Unable to start server');
		console.error(err);
	});
/*
interface AttrT {
	k: string;
	v: string;
}
interface ElementT {
	name: string;
	attrs: AttrT[];
	children?: ElementT[];
}
const data = {
	name: 'Mother',
	attrs: [
		{
			k: 'damn',
			v: 'wow',
		},
		{
			k: 'trop',
			v: 'fresh',
		},
	],
	children: [
		{
			name: 'Alice',
			attrs: [
				{
					k: 'size',
					v: '1.8m',
				},
				{
					k: 'weight',
					v: '55kg',
				},
				{
					k: 'strength',
					v: 'none',
				},
			],
			children: [
				{
					name: 'Seb',
					attrs: [
						{
							k: 'foo',
							v: 'bar',
						},
					],
				},
				{
					name: 'Kev',
					attrs: [
						{
							k: 'hello',
							v: 'world',
						},
					],
					children: [
						{
							name: 'Khalid',
							attrs: [
								{
									k: 'weight',
									v: '42k',
								},
							],
						},
					],
				},
			],
		},
		{
			name: 'Bob',
			attrs: [
				{
					k: 'smart',
					v: 'yes',
				},
			],
		},
	],
};

const b = new flatbuffers.flatbuffers.Builder();

function encode(el: ElementT): flatbuffers.flatbuffers.Offset {
	const childrenList = new Array<number>();
	if (!!el.children) {
		for (const child of el.children) {
			childrenList.push(encode(child));
		}
	}
	const children = Element.createChildrenVector(b, childrenList);
	const attrsList = new Array<number>();
	for (const attr of el.attrs) {
		const k = b.createString(attr.k);
		const v = b.createString(attr.v);
		attrsList.push(Attr.create(b, k, v));
	}
	const attrs = Element.createAttrsVector(b, attrsList);
	const name = b.createString(el.name);
	return Element.create(b, name, attrs, children);
}

function serialize(fbb: flatbuffers.flatbuffers.ByteBuffer): Uint8Array {
	return fbb.bytes().subarray(fbb.position(), fbb.capacity());
}

function decode(fbb: flatbuffers.flatbuffers.ByteBuffer): Element {
	return Element.getRoot(fbb);
}

function deserialize(data: ArrayBuffer): flatbuffers.flatbuffers.ByteBuffer {
	return new flatbuffers.flatbuffers.ByteBuffer(new Uint8Array(data));
}

function disp(el: Element): void {
	console.log(el.name());
	const attrsLen = el.attrsLength();
	for (let i = 0; i < attrsLen; i++) {
		const attr = el.attrs(i);
		console.log(`- ${attr?.k()}: ${attr?.v()}`);
	}
	const childrenLen = el.childrenLength();
	for (let i = 0; i < childrenLen; i++) {
		const child = el.children(i);
		if (!!child) {
			disp(child);
		}
	}
}

const end = encode(data);
b.finish(end);

const encoded = b.dataBuffer();
const serialized = serialize(encoded);
console.log(serialized.length);
const deserialized = deserialize(serialized);
const decoded = decode(deserialized);

disp(decoded);
*/
