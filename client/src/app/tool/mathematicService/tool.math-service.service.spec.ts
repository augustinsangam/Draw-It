import { TestBed } from '@angular/core/testing';

import { MathService } from './tool.math-service.service';

describe('MathService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MathService = TestBed.get(MathService);
    expect(service).toBeTruthy();
  });
});
