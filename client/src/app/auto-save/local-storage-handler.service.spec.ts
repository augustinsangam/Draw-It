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

  it('#saveState shouldnt add the element when its too long', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    element.setAttribute('id', 'test');
    let chaine = 'g xmlns=http://www.w3.org/2000/svg _ngcontent-jib-c3= <path d=M370,420 h0 L370,417 M370,417 L371,415 M371,415 '
    chaine += ' L376,404 M376,404 L381,394 M381,394 L384,388 M384,388 L389,378 M389,378 L397,366 M397,366 L405,355 M405,355 L413,'
    chaine += '345 M413,345 L419,336 M419,336 L427,328 M427,328 L438,320 M438,320 L445,317 M445,317 L450,314 M450,314 L462,310 M462'
    chaine += '310 L467,309 M467,309 L471,309 M471,309 L478,309 M478,309 L485,311 M485,311 L490,316 M490,316 L494,323 M494,323 L496'
    chaine += '327 M496,327 L502,340 M502,340 L503,346 M503,346 L504,353 M504,353 L504,364 M504,364 L504,371 M504,371 L493,387 M493,'
    chaine += '387 L485,396 M485,396 L476,403 M476,403 L467,411 M467,411 L446,426 M446,426 L436,432 M436,432 L432,435 M432,435 L424,'
    chaine += '440 M424,440 stroke=rgba(230, 25, 75, 1) fill=rgba(230, 25, 75, 1) stroke-linecap=round stroke-width=10 /> <path '
    chaine += 'fill=rgba(230, 25, 75, 1) d=M 177.08601789291507, 118.50743279539444 a 1, 1 0 1, 0 2,0 a 1, 1 0 1, 0 -2,0 M 176.0850'
    chaine += '3346221576, 112.1590379650724'
    let longChain = '';
    for(let i = 0; i < 5500; i++){
      longChain += chaine
    }
    element.innerHTML = longChain;
    service.saveState(element);
    const savedElement = localStorage.getItem('draw') as string;
    expect(savedElement).toBeNull();
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
