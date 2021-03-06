import { TestBed } from '@angular/core/testing';

import { Shortcut } from './shortcut';
import {
  Handler,
  ShortcutCallBack,
  ShortcutHandlerService
} from './shortcut-handler.service';

// tslint:disable no-string-literal no-any no-magic-numbers
describe('ShortcutHandlerService', () => {
  let service: ShortcutHandlerService;
  let debugVariable = 1;
  const debugFunction1: ShortcutCallBack = (event: KeyboardEvent) => {
    debugVariable += 2;
  };
  const debugFunction2: ShortcutCallBack = (event: KeyboardEvent) => {
    debugVariable += 5;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ShortcutHandlerService);
    debugVariable = 1;
  });

  it('#should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#set add well handler to the manager', () => {
    service.set(Shortcut.C, debugFunction1);
    service.set(Shortcut.L, debugFunction2);

    expect(service['manager'].get(Shortcut.C)).toEqual({
      handlerFunction: debugFunction1,
      isActive: true
    });

    expect(service['manager'].get(Shortcut.L)).toEqual({
      handlerFunction: debugFunction2,
      isActive: true
    });
  });

  it('#activate should set the active property to true', () => {
    service.set(Shortcut.C, debugFunction1);
    service.activate(Shortcut.C);
    expect((service['manager'].get(Shortcut.C) as Handler).isActive).toEqual(
      true
    );
  });

  it('#deactivate should set the active property to true', () => {
    service.set(Shortcut.C, debugFunction1);
    service.deactivate(Shortcut.C);
    expect((service['manager'].get(Shortcut.C) as Handler).isActive).toEqual(
      false
    );
  });

  it('#activateAll should set all active properties to true', () => {
    service.set(Shortcut.C, debugFunction1);
    service.set(Shortcut.L, debugFunction2);
    service.activateAll();
    expect((service['manager'].get(Shortcut.C) as Handler).isActive).toEqual(
      true
    );
    expect((service['manager'].get(Shortcut.L) as Handler).isActive).toEqual(
      true
    );
  });

  it('#deactivateAll should set all active properties to false', () => {
    service.set(Shortcut.C, debugFunction1);
    service.set(Shortcut.L, debugFunction2);
    service.deactivateAll();
    expect((service['manager'].get(Shortcut.C) as Handler).isActive).toEqual(
      false
    );
    expect((service['manager'].get(Shortcut.L) as Handler).isActive).toEqual(
      false
    );
  });

  it('#execute should not call the hander fonction when inactive', () => {
    service.execute(('' as unknown) as KeyboardEvent);
    expect(debugVariable).toEqual(1);
  });

  it('#execute should not call the hander fonction when inactive', () => {
    service.set(Shortcut.C, debugFunction1);
    service.set(Shortcut.L, debugFunction2);
    service.execute(({ key: 'c' } as unknown) as KeyboardEvent);
    expect(debugVariable).toBe(3);
    service.execute(({ key: 'l' } as unknown) as KeyboardEvent);
    expect(debugVariable).toBe(8);
  });

  it('#clone works well', () => {
    service.set(Shortcut.C, debugFunction1);
    service.set(Shortcut.L, debugFunction2);
    const managerSaved = service['manager'];
    expect(service['clone'](service['manager'])).not.toBe(managerSaved);
  });

  it('#push should save the manger in the history', () => {
    service.set(Shortcut.C, debugFunction1);
    service.set(Shortcut.L, debugFunction2);
    const managerSaved = service['manager'];
    service.push();
    expect(service['history'].pop()).toEqual(managerSaved);
  });

  it('#pop should set the manager to its last state', () => {
    service.set(Shortcut.C, debugFunction1);
    service.push();
    service.set(Shortcut.L, debugFunction2);
    service.pop();
    expect(service['manager'].get(Shortcut.L)).toEqual(undefined);
  });

});
