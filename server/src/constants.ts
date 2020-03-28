const ANSWER_TO_LIFE = 42;

const COLORS = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',
	fg: {
		black: '\x1b[30m',
		white: '\x1b[37m',

		red: '\x1b[31m',
		green: '\x1b[32m',
		blue: '\x1b[34m',

		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		yellow: '\x1b[33m',
	},
	bg: {
		black: '\x1b[40m',
		white: '\x1b[47m',

		red: '\x1b[41m',
		green: '\x1b[42m',
		blue: '\x1b[44m',

		magenta: '\x1b[45m',
		cyan: '\x1b[46m',
		yellow: '\x1b[43m',
	},
};

enum ContentType {
	OCTET_STREAM = 'application/octet-stream',
	PLAIN_UTF8 = 'text/plain; charset=utf-8',
}

const ERRORS = {
	nullCollection: new Error('collection is null or undefined'),
	nullDb: new Error('database is null or undefined'),
};

const promisifiedTimeout = async (timeout: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, timeout));

enum StatusCode {
	OK = 200,
	CREATED,
	ACCEPTED,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	NOT_ACCEPTABLE = 406,
	GONE = 410,
	IM_A_TEAPOT = 418,
	INTERNAL_SERVER_ERROR = 500,
}

enum TextLen {
	MIN = 3,
	MAX = 21,
}

const TIMEOUT = 1500;

const TYPES = {
	Application: Symbol.for('Application'),
	Database: Symbol.for('Database'),
	Email: Symbol.for('Email'),
	Router: Symbol.for('Router'),
	Server: Symbol.for('Server'),
};

export {
	ANSWER_TO_LIFE,
	COLORS,
	ContentType,
	ERRORS,
	promisifiedTimeout,
	StatusCode,
	TextLen,
	TIMEOUT,
	TYPES,
};
