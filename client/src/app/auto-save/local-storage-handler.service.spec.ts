import { TestBed } from '@angular/core/testing';

import { LocalStorageHandlerService } from './local-storage-handler.service';

describe('LocalStorageHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalStorageHandlerService = TestBed.get(LocalStorageHandlerService);
    expect(service).toBeTruthy();
  });
});
