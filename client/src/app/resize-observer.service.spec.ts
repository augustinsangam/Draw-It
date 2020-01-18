import { TestBed } from '@angular/core/testing';

import { ResizeObserverService } from './resize-observer.service';

describe('ResizeObserverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResizeObserverService = TestBed.get(ResizeObserverService);
    expect(service).toBeTruthy();
  });
});
