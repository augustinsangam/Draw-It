import { Injectable } from '@angular/core';
import { SvgShape } from '../svg/svg-shape';

const AUTOS_SAVE_KEY_DRAW = 'draw';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageHandlerService {
  
  constructor() {
  }

  saveShape(shape: SvgShape){
    localStorage.setItem('shape', JSON.stringify(shape));
  }

  saveState(draw: SVGGElement ){
    const svgDrawString = new XMLSerializer().serializeToString(draw);
    // localStorage.setItem('color', shape.color);
    // localStorage.setItem('height', shape.height.toString());
    // localStorage.setItem('width', shape.width.toString());
    localStorage.setItem(AUTOS_SAVE_KEY_DRAW, svgDrawString);
  }

  verifyAvailability(): boolean {
    return localStorage.getItem(AUTOS_SAVE_KEY_DRAW) !== null ? true : false; 
  }

  getDrawing(): [SVGGElement, SvgShape]{
    const savedElement = localStorage.getItem(AUTOS_SAVE_KEY_DRAW) as string;
    const drawingDocument = new DOMParser().parseFromString(savedElement, "image/svg+xml");
    const drawingElement = drawingDocument.firstElementChild as SVGSVGElement;
    // const shape = {
    //   color: localStorage.getItem('color') as string,
    //   height: +(localStorage.getItem('height') as string),
    //   width: +(localStorage.getItem('width') as string),
    // }
    const shape: SvgShape = JSON.parse(localStorage.getItem('shape') as string);
    return [ drawingElement, shape];

    // svgElement a enleve apres car inutile
    // const svgElement: SVGStructure = {
    //   root: drawingElement, 
    //   defsZone: drawingElement.children[1] as SVGGElement,
    //   drawZone: drawingElement.children[2] as SVGGElement,
    //   temporaryZone: drawingElement.children[3] as SVGGElement,
    //   endZone: drawingElement.children[4] as SVGGElement
    // }
    // console.log('root' + ' ' + svgStructure.root.innerHTML);
    // console.log('def' + ' ' + svgStructure.defsZone.innerHTML);
    // console.log('draw' + ' ' + svgStructure.drawZone.innerHTML);
    // console.log('temp' + ' ' + svgStructure.temporaryZone.innerHTML);
    // console.log('end' + ' ' + svgStructure.endZone.innerHTML);
    // const nbenf = drawingElement.childElementCount;
  }
}
