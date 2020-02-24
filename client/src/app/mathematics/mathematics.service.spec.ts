import { TestBed } from '@angular/core/testing';

import { MathematicsService } from './mathematics.service';

describe('MathematicsService', () => {
  let service: MathematicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathematicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
