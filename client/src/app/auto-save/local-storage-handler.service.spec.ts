import { TestBed } from '@angular/core/testing';

import { LocalStorageHandlerService } from './local-storage-handler.service';
import { SvgShape } from '../svg/svg-shape';

describe('LocalStorageHandlerService', () => {
  
  let service: LocalStorageHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));


  beforeEach(() => {
    service =TestBed.get(LocalStorageHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#saveShape should add a key named shape into the localstorage', () => {
    const shape: SvgShape = { width: 500, height: 500, color: 'red'};
    service.saveShape(shape);
    const shapeSaved: SvgShape = JSON.parse(localStorage.getItem('shape') as string)
    expect(shapeSaved).toEqual(shape);
  });

  it('#saveState should add a the svgElement', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg','g');
    element.setAttribute('id', 'test');
    service.saveState(element);
    const savedElement = localStorage.getItem('draw') as string;
    const drawingDocument = new DOMParser().parseFromString(savedElement, "image/svg+xml");
    const drawingSaved = drawingDocument.firstElementChild as SVGSVGElement;
    expect(drawingSaved.getAttribute('id')).toEqual('test');
  });

  it('#verifyAvailability should should return true when there is a draw saved', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg','g');
    element.setAttribute('id', 'test');
    service.saveState(element);
    const drawExist = service.verifyAvailability();
    expect(drawExist).toBeTruthy();
  });

  it('#verifyAvailability should should return false when there isnt a draw saved', () => {
    localStorage.clear();
    const drawExist = service.verifyAvailability();
    expect(drawExist).toEqual(false);
  });

  it('#getDrawing should return the element saved and the shape', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg','g');
    element.setAttribute('id', 'test');
    const shape: SvgShape = { width: 500, height: 500, color: 'red'};
    service.saveShape(shape);
    service.saveState(element);
    const [savedElement, shapeSaved] = service.getDrawing();
    expect(savedElement.getAttribute('id')).toEqual('test');
    expect(shapeSaved).toEqual(shape);
  });
});
