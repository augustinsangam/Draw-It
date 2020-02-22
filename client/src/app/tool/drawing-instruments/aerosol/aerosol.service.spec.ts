import { TestBed } from '@angular/core/testing';

import { AerosolService } from './aerosol.service';

describe('AerosolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AerosolService = TestBed.get(AerosolService);
    expect(service).toBeTruthy();
  });
});
