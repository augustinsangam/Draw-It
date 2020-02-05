import 'reflect-metadata';
import inversify from 'inversify';

import { Katana, Ninja, Shuriken } from './entities';
import { ThrowableWeapon, Warrior, Weapon } from './interfaces';
import { TYPES } from './types';

const myContainer = new inversify.Container();
myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja);
myContainer.bind<Weapon>(TYPES.Weapon).to(Katana);
myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);

export { myContainer };
