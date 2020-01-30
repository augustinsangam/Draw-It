import { TestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    expect(service).toBeTruthy();
  });
});
