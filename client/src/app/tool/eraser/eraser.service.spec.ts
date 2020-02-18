import { TestBed } from '@angular/core/testing';

import { EraserService } from './eraser.service';

describe('EraserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EraserService = TestBed.get(EraserService);
    expect(service).toBeTruthy();
  });
});
