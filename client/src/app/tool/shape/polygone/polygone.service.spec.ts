import { TestBed } from '@angular/core/testing';

import { PolygoneService } from './polygone.service';

describe('PolygoneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolygoneService = TestBed.get(PolygoneService);
    expect(service).toBeTruthy();
  });
});
