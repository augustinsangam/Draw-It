import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';

describe('BrushService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrushService = TestBed.get(BrushService);
    expect(service).toBeTruthy();
  });
});
