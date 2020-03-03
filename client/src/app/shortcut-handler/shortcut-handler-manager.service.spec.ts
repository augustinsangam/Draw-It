import { TestBed } from '@angular/core/testing';

import { ShortcutHandlerManagerService } from './shortcut-handler-manager.service';

describe('ShortcutHandlerManagerService', () => {

  let service: ShortcutHandlerManagerService;

  beforeEach(() => {
    service.initialiseShortcuts();
    TestBed.configureTestingModule({});
    service = TestBed.get(ShortcutHandlerManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#Others', () => {
  });

});
