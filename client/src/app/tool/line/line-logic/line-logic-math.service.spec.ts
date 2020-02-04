import { TestBed } from '@angular/core/testing';

import { LineLogicMathService } from './line-logic-math.service';

describe('LineLogicMathService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineLogicMathService = TestBed.get(LineLogicMathService);
    expect(service).toBeTruthy();
  });
});
