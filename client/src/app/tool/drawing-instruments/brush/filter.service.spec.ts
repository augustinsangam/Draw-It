import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FilterService } from './filter.service';

describe('FilterService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Renderer2
    ]
  }));

  it('should be created', () => {
    const service: FilterService = TestBed.get(FilterService);
    expect(service).toBeTruthy();
  });
});
