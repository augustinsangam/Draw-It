import { TestBed } from '@angular/core/testing';

import { PencilService } from './pencil.service';

describe('PencilService', () => {
  let service: PencilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PencilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
