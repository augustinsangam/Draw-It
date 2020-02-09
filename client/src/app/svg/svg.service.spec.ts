import { TestBed } from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import { SvgService } from './svg.service';

describe('SvgService', () => {
  let service: SvgService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(SvgService);
    service.instance = new ElementRef<SVGElement>(
      document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#changeBackgroundColor() should change svg background color', () => {
    service.changeBackgroundColor('rgb(171, 205, 239)');
    const color = service.instance.nativeElement.style.backgroundColor;
    expect(color).toEqual('rgb(171, 205, 239)');
  });

});