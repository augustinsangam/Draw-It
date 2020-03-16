import { TestBed } from '@angular/core/testing';

import { PipetteService } from './pipette.service';

describe('PipetteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('#should be created', () => {
    const service: PipetteService = TestBed.get(PipetteService);
    expect(service).toBeTruthy();
  });
});
