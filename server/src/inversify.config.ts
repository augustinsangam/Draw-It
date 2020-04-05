import 'reflect-metadata';

import inversify, { Container } from 'inversify';

import { Application } from './application';
import { TYPES } from './constants';
import { Database } from './database';
import { Email } from './email';
import { Router } from './router';
import { Server } from './server';

const setupContainer = (container: Container): void => {
	container.bind<Application>(TYPES.Application).to(Application);
	container.bind<Database>(TYPES.Database).to(Database).inSingletonScope();
	container.bind<Email>(TYPES.Email).to(Email);
	container.bind<Router>(TYPES.Router).to(Router);
	container.bind<Server>(TYPES.Server).to(Server);
};

const myContainer = new inversify.Container();
setupContainer(myContainer);

export { myContainer };
