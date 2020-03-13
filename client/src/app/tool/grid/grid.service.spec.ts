import { TestBed } from '@angular/core/testing';
import { GridService } from './grid.service';

const SVG_TEST_HEIGHT = 1000;
const SVG_TEST_WIDTH = 1000;

// tslint:disable:no-string-literal
fdescribe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(GridService);
    service['svg'].structure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    service['svg'].structure.root.appendChild(service['svg'].structure.defsZone);
    service['svg'].structure.root.appendChild(service['svg'].structure.drawZone);
    service['svg'].structure.root.appendChild(service['svg'].structure.temporaryZone);
    service['svg'].structure.root.appendChild(service['svg'].structure.endZone);

    service['svg'].shape.width = SVG_TEST_WIDTH;
    service['svg'].shape.height = SVG_TEST_HEIGHT;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('keyEvHandler should invert the "active" attribute when called with g', () => {
  //   const expected = false;
  //   service.active = expected;
  //   service.keyEvHandler(gridKeys.G);
  //   expect(service.active).not.toEqual(expected);
  // });
});
