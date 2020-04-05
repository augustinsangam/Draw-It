import FormData from 'form-data';
import { createReadStream } from 'fs';
import { ClientRequest, IncomingMessage, OutgoingHttpHeaders, request as httpRequest, RequestOptions } from 'http';
import { request as httpsRequest } from 'https';
import inversify from 'inversify';
import { format } from 'url';

import { EMAIL_API } from './constants.js';
import secrets from './secrets.json';

interface ProtocolToFn {
	[protocol: string]: (url: string, options: RequestOptions) => ClientRequest;
}

@inversify.injectable()
class Email {
	private readonly protocolToFn: ProtocolToFn = {
		https: httpsRequest,
		http: httpRequest,
	};
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

		const options = {...this.options, ...{ headers: form.getHeaders() }};
		Object.assign(options.headers, this.options.headers);

		const url = format(EMAIL_API.url);
		const reqFn = this.protocolToFn[EMAIL_API.url.protocol as string];
		const req = reqFn(url, options);
		form.pipe(req);
		return new Promise((resolve) => req.on('response', resolve));
	}
}

// Due to a bug, c8 reports the export line as uncovered even tho
// it’s used outside of the current file
// See the bug submission https://github.com/bcoe/c8/issues/196
/* c8 ignore next */
export { Email };
