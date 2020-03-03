import { TestBed } from '@angular/core/testing';

import { ShortcutHandlerManagerService } from './shortcut-handler-manager.service';

describe('ShortcutHandlerManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShortcutHandlerManagerService = TestBed.get(ShortcutHandlerManagerService);
    expect(service).toBeTruthy();
  });

});
