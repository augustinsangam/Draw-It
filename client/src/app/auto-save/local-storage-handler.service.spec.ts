import { TestBed } from '@angular/core/testing';

import { SvgShape } from '../svg/svg-shape';
import { LocalStorageHandlerService, LocalStorageReturn } from './local-storage-handler.service';

describe('LocalStorageHandlerService', () => {

  let service: LocalStorageHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(LocalStorageHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#saveShape should add a key named shape into the localstorage', () => {
    const shape: SvgShape = { width: 500, height: 500, color: 'red'};
    service.saveShape(shape);
    const shapeSaved: SvgShape = JSON.parse(localStorage.getItem('shape') as string);
    expect(shapeSaved).toEqual(shape);
  });

  it('#saveState should add a the svgElement', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    element.setAttribute('id', 'test');
    service.saveState(element);
    const savedElement = localStorage.getItem('draw') as string;
    const drawingDocument = new DOMParser().parseFromString(savedElement, 'image/svg+xml');
    const drawingSaved = drawingDocument.firstElementChild as SVGSVGElement;
    expect(drawingSaved.getAttribute('id')).toEqual('test');
  });

  it('#getDrawing should return null if draw is absent', () => {
    localStorage.clear();
    expect(service.getDrawing()).toBeNull();
  });

  it('#getDrawing should return null if shape is absent', () => {
    localStorage.clear();
    expect(service.getDrawing()).toBeNull();
  });

  it('#clearDrawings should the draw item from the local storage', () => {
    localStorage.setItem('draw', '');
    service.clearDrawings();
    expect(localStorage.getItem('draw')).toBeNull();
  });

  it('#getDrawing should return null if draw has no child', () => {
    localStorage.clear();
    service.saveShape({
      color: 'rgba(1, 1, 1, 1)',
      height: 42,
      width: 42,
    });
    service.saveState(
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg:g'
      ) as SVGGElement);
    expect(service.getDrawing()).toBeNull();
  });

  it('#getDrawing should return the element saved and the shape', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    element.appendChild(
      document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    );
    element.setAttribute('id', 'test');
    const shape: SvgShape = { width: 500, height: 500, color: 'red'};
    service.saveShape(shape);
    service.saveState(element);
    const state = service.getDrawing() as LocalStorageReturn;
    expect(state.draw.getAttribute('id')).toEqual('test');
    expect(state.shape).toEqual(shape);
  });
});
