import inversify from 'inversify';
import 'reflect-metadata';

import { Application } from './application';
import { TYPES } from './constants';
import { Database } from './database';
import { Router } from './router';
import { Server } from './server';

const myContainer = new inversify.Container();
myContainer.bind<Application>(TYPES.Application).to(Application);
myContainer
	.bind<Database>(TYPES.Database)
	.to(Database)
	.inSingletonScope();
myContainer.bind<Router>(TYPES.Router).to(Router);
myContainer.bind<Server>(TYPES.Server).to(Server);

export { myContainer };
