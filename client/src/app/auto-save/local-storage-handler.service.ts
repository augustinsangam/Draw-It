import { Injectable } from '@angular/core';
import { SVGStructure } from '../svg/svg-structure';

const AUTOS_SAVE_KEY = 'draw';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageHandlerService {

  constructor() {}

  saveState(element: SVGElement){
    const svgString = new XMLSerializer().serializeToString(element); 
    localStorage.setItem(AUTOS_SAVE_KEY, svgString);
    this.continueDrawing();
  }

  verifyAvaibility(): boolean {
    return localStorage.getItem(AUTOS_SAVE_KEY) == null ? true : false; 
  }

  //continueDrawing(svgElement: SVGStructure)
  continueDrawing(){
    const savedElement = localStorage.getItem(AUTOS_SAVE_KEY) as string;
    const drawingDocument = new DOMParser().parseFromString(savedElement, "image/svg+xml");
    const drawingElement = drawingDocument.firstElementChild as SVGSVGElement;
    // svgElement a enleve apres car inutile
    const svgElement: SVGStructure = {
      root: drawingElement, 
      defsZone: drawingElement.children[1] as SVGGElement,
      drawZone: drawingElement.children[2] as SVGGElement,
      temporaryZone: drawingElement.children[3] as SVGGElement,
      endZone: drawingElement.children[4] as SVGGElement
    }
    console.log('root' + ' ' + svgElement.root.innerHTML);
    console.log('def' + ' ' + svgElement.defsZone.innerHTML);
    console.log('draw' + ' ' + svgElement.drawZone.innerHTML);
    console.log('temp' + ' ' + svgElement.temporaryZone.innerHTML);
    console.log('end' + ' ' + svgElement.endZone.innerHTML);
    // const nbenf = drawingElement.childElementCount;
  }
}
