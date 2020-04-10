import FormData from 'form-data';
import { createReadStream } from 'fs';
import {
	IncomingMessage,
	OutgoingHttpHeaders,
	request as httpRequest,
	RequestOptions,
} from 'http';
import { request as httpsRequest } from 'https';
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
			} as OutgoingHttpHeaders,
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

		const options = { ...this.options, ...{ headers: form.getHeaders() } };
		Object.assign(options.headers, this.options.headers);

		const url = EMAIL_API.url;
		const secure = url.startsWith('https');
		const req = (secure ? httpsRequest : httpRequest)(url, options);
		form.pipe(req);

		return new Promise((resolve, reject) => {
			req.on('response', resolve);
			req.on('error', reject);
		});
	}
}

// Due to a bug, c8 reports the export line as uncovered even tho
// it’s used outside of the current file
// See the bug submission https://github.com/bcoe/c8/issues/196
/* c8 ignore next */
export { Email };
