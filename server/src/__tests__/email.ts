// tslint:disable: no-any

import chai from 'chai';
import express from 'express';
import multer from 'multer';
import portfinder from 'portfinder';
import sinon from 'sinon';
import { promisify } from 'util';

import { EMAIL_API, StatusCode, TYPES } from '../constants';
import { Email } from '../email';
import { myContainer } from '../inversify.config';
import secrets from '../secrets.json';

describe('email', () => {
	let app: express.Express;
	let email: Email;

	before(() => {
		app = express();
		email = myContainer.get<Email>(TYPES.Email);
	});

	it('#send should resolve the response', async () => {
		const handler: express.RequestHandler = (req, res) => {
			const receivedKey = req.header(EMAIL_API.headers.key);
			res.setHeader(EMAIL_API.headers.key, receivedKey || '');
			res.setHeader('recipient', req.body.to);
			res.setHeader('payload', req.file ? 'true' : 'false');
			res.sendStatus(StatusCode.OK);
		};
		const upload = multer({ dest: 'uploads/' });
		app.post(`/${EMAIL_API.url.pathname}`, upload.single('payload'), handler);

		const port = await portfinder.getPortPromise();
		const server = app.listen(port, '127.0.0.1');

		const emailApiUrlProtocolStub = sinon.stub(EMAIL_API.url, 'protocol');
		emailApiUrlProtocolStub.value('http');

		const emailApiUrlHostnameStub = sinon.stub(EMAIL_API.url, 'hostname');
		emailApiUrlHostnameStub.value('127.0.0.1');

		EMAIL_API.url.port = port;

		const res2 = await email.send('foo@example.com', {
			filename: 'foo.png',
			mimetype: 'image/png',
			path: 'package.json',
		} as any);

		chai.expect(res2.headers[EMAIL_API.headers.key]).to.equal(secrets.email.key);
		chai.expect(res2.headers.recipient).to.equal('foo@example.com');
		chai.expect(res2.headers.payload).to.equal('true');

		await promisify(server.close.bind(server))();

		emailApiUrlProtocolStub.restore();
		emailApiUrlHostnameStub.restore();
		delete EMAIL_API.url.port;
	});
});
