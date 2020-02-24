import { TestBed } from '@angular/core/testing';

import { ShortcutHandlerService } from './shortcut-handler.service';

describe('ShortcutHandlerService', () => {
  let service: ShortcutHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortcutHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
