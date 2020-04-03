import { TestBed } from '@angular/core/testing';

import { FeatherpenService } from './featherpen.service';

describe('FeatherpenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeatherpenService = TestBed.get(FeatherpenService);
    expect(service).toBeTruthy();
  });
});
