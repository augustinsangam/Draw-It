import inversify from 'inversify';

import { ThrowableWeapon, Warrior, Weapon } from './interfaces';
import { TYPES } from './types';

@inversify.injectable()
class Katana implements Weapon {
	public hit(): string {
		return 'cut!';
	}
}

@inversify.injectable()
class Shuriken implements ThrowableWeapon {
	public throw(): string {
		return 'hit!';
	}
}

@inversify.injectable()
class Ninja implements Warrior {
	public constructor(
		@inversify.inject(TYPES.Weapon) private katana: Weapon,
		@inversify.inject(TYPES.ThrowableWeapon) private shuriken: ThrowableWeapon,
	) {}

	public fight(): string {
		return this.katana.hit();
	}
	public sneak(): string {
		return this.shuriken.throw();
	}
}

// FIXME: github.com/bcoe/c8/issues/196
/* c8 ignore next */
export { Katana, Ninja, Shuriken };
