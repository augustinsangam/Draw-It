import FormData from 'form-data';
import { createReadStream } from 'fs';
import { IncomingMessage } from 'http';
import { request, RequestOptions } from 'https';
import inversify from 'inversify';

import { EMAIL_API } from './constants.js';
import secrets from './secrets.json';

@inversify.injectable()
class Email {
	private readonly options: RequestOptions;

	constructor() {
		this.options = {
			headers: {
				[EMAIL_API.headers.key]: secrets.email.key,
			},
			method: 'POST',
		};
	}

	async send(
		recipient: string,
		file: Express.Multer.File,
	): Promise<IncomingMessage> {
		const readStream = createReadStream(file.path);

		const form = new FormData();
		form.append('to', recipient);
		form.append('payload', readStream, {
			filename: file.filename,
			contentType: file.mimetype,
		});

		const options = {...this.options, ...{ headers: form.getHeaders() }};
		Object.assign(options.headers, this.options.headers);

		console.log(this.options);
		console.log(options);
		console.log(form);

		const req = request(EMAIL_API.url, options);
		form.pipe(req);
		return new Promise((resolve) => req.on('response', resolve));
	}
}

export { Email };
