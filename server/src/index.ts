import { Warrior } from './interfaces';
import { myContainer } from './inversify.config';
import { TYPES } from './types';

const ninja = myContainer.get<Warrior>(TYPES.Warrior);

console.log(ninja.fight());
console.log(ninja.sneak());
