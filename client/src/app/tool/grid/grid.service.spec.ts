import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SvgService} from '../../svg/svg.service';
import { GridService } from './grid.service';

enum gridKeys {
  G = 'g',
  plus = '+',
  minus = '-',
}

const SVG_TEST_HEIGHT = 1000;
const SVG_TEST_WIDTH = 1000;

// tslint:disable:no-string-literal
fdescribe('GridService', () => {
  let service: GridService;
  let svgService: SvgService;
  let fixture: ComponentFixture<GridService>;

  beforeEach(() => {
      TestBed.configureTestingModule({});
      fixture = TestBed.get(GridService);
      service = fixture.componentInstance;
      svgService = (TestBed.get(SvgService) as SvgService);
      svgService.structure = {
        root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
        drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
        temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
        endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
      };
      svgService.structure.root.appendChild(service['svg'].structure.defsZone);
      svgService.structure.root.appendChild(service['svg'].structure.drawZone);
      svgService.structure.root.appendChild(service['svg'].structure.temporaryZone);
      svgService.structure.root.appendChild(service['svg'].structure.endZone);

      svgService.shape.width = SVG_TEST_WIDTH;
      svgService.shape.height = SVG_TEST_HEIGHT;

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
