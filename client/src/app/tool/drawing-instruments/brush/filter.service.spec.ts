import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FilterService } from './filter.service';

describe('FilterService', () => {
  // const renderer: Renderer2 = {
  //   setAttribute: ( element: SVGElement, attribute: string, value: string ) => {
  //     element.setAttribute( attribute, value);
  //   },
  //   createElement: (value: string ) => {
  //     document.createElement(value);
  //   }
  // } as unknown as Renderer2;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Renderer2
    ]
  }));

  it('#should be created', () => {
    const service: FilterService = TestBed.get(FilterService);
    expect(service).toBeTruthy();
  });

  // it('#generateBrushFilters should return a defZone with 5 elements', () => {
  //   const service: FilterService = TestBed.get(FilterService);
  //   const defZone: SVGDefsElement = service.generateBrushFilters(renderer);
  //   expect(defZone.children.length).toEqual(6);
  // });
});
