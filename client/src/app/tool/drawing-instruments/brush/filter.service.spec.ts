import { TestBed } from '@angular/core/testing';

import { FilterService } from './filter.service';
import { Renderer2 } from '@angular/core';

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

  // it('generateBrushFilters should return a defZone with 5 elements', () => {
  //   const service: FilterService = TestBed.get(FilterService);
  //   // const renderer = {} as unknown as Renderer2;
  //   const renderer: Renderer2 = TestBed.get(Renderer2);
  //   const defZone: SVGDefsElement = service.generateBrushFilters(renderer);
  //   expect(defZone.children.length).toEqual(6);
  // });
});