import { TestBed } from '@angular/core/testing';

import { GridService } from './grid.service';

enum gridKeys {
  G = 'g',
  plus = '+',
  minus = '-',
}

// tslint:disable:no-string-literal
fdescribe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.get(GridService);
      const testSVGStructure = {
        root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
        drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
        temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
        endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
      };
      testSVGStructure.root.appendChild(testSVGStructure.defsZone);
      testSVGStructure.root.appendChild(testSVGStructure.drawZone);
      testSVGStructure.root.appendChild(testSVGStructure.temporaryZone);
      testSVGStructure.root.appendChild(testSVGStructure.endZone);

      service['svg'].structure.root.setAttribute('width', '1000');
      service['svg'].structure.root.setAttribute('height', '1000');
    }
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('keyEvHandler should invert the "active" attribute when called with g', () => {
    const expected = false;
    service.active = expected;
    service.keyEvHandler(gridKeys.G);
    expect(service.active).not.toEqual(expected);
  });
});
