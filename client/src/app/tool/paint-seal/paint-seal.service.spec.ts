import { TestBed } from '@angular/core/testing';

import { PaintSealService } from './paint-seal.service';

describe('PaintSealService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaintSealService = TestBed.get(PaintSealService);
    expect(service).toBeTruthy();
  });
});
