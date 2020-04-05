import { Injectable } from '@angular/core';
import { SvgShape } from '../svg/svg-shape';

export const AUTOS_SAVE_KEY_DRAW = 'draw';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageHandlerService {
  
  constructor() {}

  saveShape(shape: SvgShape){
    localStorage.setItem('shape', JSON.stringify(shape));
  }

  saveState(draw: SVGGElement ){
    const svgDrawString = new XMLSerializer().serializeToString(draw);
    localStorage.setItem(AUTOS_SAVE_KEY_DRAW, svgDrawString);
  }

  verifyAvailability(): boolean {
    return localStorage.getItem(AUTOS_SAVE_KEY_DRAW) !== null ? true : false; 
  }

  getDrawing(): [SVGGElement, SvgShape]{
    const savedElement = localStorage.getItem(AUTOS_SAVE_KEY_DRAW) as string;
    const drawingDocument = new DOMParser().parseFromString(savedElement, "image/svg+xml");
    const drawingElement = drawingDocument.firstElementChild as SVGSVGElement;
    const shape: SvgShape = JSON.parse(localStorage.getItem('shape') as string);
    return [ drawingElement, shape];
  }
}
