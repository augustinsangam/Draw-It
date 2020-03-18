import { TestBed } from '@angular/core/testing';
import { GridKeys } from './grid-keys';
import { GridService } from './grid.service';

const SVG_TEST_HEIGHT = 1000;
const SVG_TEST_WIDTH = 1000;

// tslint:disable:no-string-literal
describe('GridService', () => {
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

  it('#should be createdd', () => {
    expect(service).toBeTruthy();
  });

  it('#keyEvHandler should invert the "active" attribute when called with g', () => {
    const expected = false;
    service.active = expected;
    service.keyEvHandler(GridKeys.G);
    expect(service.active).not.toEqual(expected);
  });

  it('#keyEvHandler should increase to the next multiple of 5 the value of squareSize if it is not ' +
    'superior or equal to the max squareSize', () => {
    const intialized = 42;
    const expected = 45;
    service.active = true;
    service.squareSize = intialized;
    service.keyEvHandler(GridKeys.plus);
    expect(service.squareSize).toEqual(expected);
  });

  it('#keyEvHandler should not increase the value of squareSize if it is already at' +
    'max square size', () => {
    const expected = service.MAX_SQUARESIZE;
    service.active = true;
    service.squareSize = expected;
    service.keyEvHandler(GridKeys.plus);
    expect(service.squareSize).toEqual(expected);
  });

  it('#keyEvHandler should decrease to the previous multiple of 5 the value of squareSize if it is ' +
    'already a multiple of 5', () => {
    const intialized = 40;
    const expected = 35;
    service.active = true;
    service.squareSize = intialized;
    service.keyEvHandler(GridKeys.minus);
    expect(service.squareSize).toEqual(expected);
  });

  it('#keyEvHandler should not decrease the value of squareSize if it is already at' +
    'min square size', () => {
    const expected = service.MIN_SQUARESIZE;
    service.active = true;
    service.squareSize = expected;
    service.keyEvHandler(GridKeys.minus);
    expect(service.squareSize).toEqual(expected);
  });

  it('#keyEvHandler should not decrease the value of squareSize if it is already at' +
    'not a multiple of 5', () => {
    const intialized = 42;
    const expected = 40;
    service.active = true;
    service.squareSize = intialized;
    service.keyEvHandler(GridKeys.minus);
    expect(service.squareSize).toEqual(expected);
  });

  it('#keyEvHandler should not do anything if a key that is not a ' +
    'gridKey', () => {
    const expActive = true;
    const expSquareSize = 42;
    service.active = expActive;
    service.squareSize = expSquareSize;
    service.keyEvHandler('randomKey');
    expect(service.active).toEqual(expActive);
    expect(service.squareSize).toEqual(expSquareSize);
  });

  it('#handleGrid should remove the grid if it is not undefined, ' +
    'in order to refresh the grid', () => {
    service.grid = service['renderer'].createElement(
      'path',
      service['svg'].structure.root.namespaceURI
    );
    service.grid.setAttribute('id', 'grid');
    service.grid.setAttribute('fill', 'none');
    service.grid.setAttribute('stroke-width', '1');
    const spy = spyOn(service.grid, 'remove');
    service.handleGrid();
    expect(spy).toHaveBeenCalled();
  });

});
