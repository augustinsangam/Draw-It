import { TestBed } from '@angular/core/testing';

import { SvgService } from './svg.service';

describe('SvgService', () => {
  let service: SvgService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(SvgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#changeBackgroundColor() should change the svg shape', () => {
    service.changeBackgroundColor('rgb(171, 205, 239)');
    expect(service.shape.color).toEqual('rgb(171, 205, 239)');
  });

  it('#clearDom should remove all elements of the DOM', () => {
    service.structure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    service.structure.root.appendChild(service.structure.defsZone);
    service.structure.root.appendChild(service.structure.drawZone);
    service.structure.root.appendChild(service.structure.temporaryZone);
    service.structure.root.appendChild(service.structure.endZone);

    const rec1 = document.createElementNS('http://www.w3.org/2000/svg',
                                            'svg:rect') as SVGElement;
    const rec2 = document.createElementNS('http://www.w3.org/2000/svg',
                                            'svg:rect') as SVGElement;

    service.structure.drawZone.appendChild(rec1);
    service.structure.drawZone.appendChild(rec2);

    service.clearDom();

    expect(service.structure.drawZone.childElementCount).toEqual(0);
  });

});
