import FormData from 'form-data';
import { createReadStream } from 'fs';
import { IncomingMessage } from 'http';
import { request, RequestOptions } from 'https';
import inversify from 'inversify';

import { EmailAPIHeaders } from './constants.js';
import secrets from './secrets.json';

@inversify.injectable()
class Email {
	private readonly options: RequestOptions;

	constructor() {
		this.options = {
			host: 'log2990.step.polymtl.ca',
			path: '/email',
			method: 'POST',
		};
	}

	verify(email: string): Error | null {
		return null;
	}

	async send(
		recipient: string,
		file: Express.Multer.File,
	): Promise<IncomingMessage> {
		const readStream = createReadStream(file.path);

		const form = new FormData();
		form.append('to', recipient);
		// form.append('address_validation', 'true');
		form.append('quick_return', 'true');
		form.append('payload', readStream, {
			filename: file.filename,
			contentType: file.mimetype,
		});

		this.options.headers = form.getHeaders();
		this.options.headers[EmailAPIHeaders.KEY] = secrets.email.key;
		console.log(form);

		const req = request(this.options);
		form.pipe(req);
		return new Promise((resolve) => req.on('response', resolve));
	}
}

export { Email };
