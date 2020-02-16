import 'reflect-metadata';
import inversify from 'inversify';

import { Application } from './application';
import { Database } from './database';
import { Router } from './router';
import { Server } from './server';
import { TYPES } from './types';

const myContainer = new inversify.Container();
myContainer.bind<Application>(TYPES.Application).to(Application);
myContainer.bind<Database>(TYPES.Database).to(Database);
myContainer.bind<Router>(TYPES.Router).to(Router);
myContainer.bind<Server>(TYPES.Server).to(Server);

export { myContainer };
