import { TestBed } from '@angular/core/testing';

import { EllipseService } from './ellipse.service';

describe('EllipseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    expect(service).toBeTruthy();
  });
});
