import { Injectable } from '@angular/core';

const AUTOS_SAVE_KEY = 'draw';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageHandlerService {

  constructor() {}

  saveState(element: SVGElement){
    const svgString = new XMLSerializer().serializeToString(element); 
    localStorage.setItem(AUTOS_SAVE_KEY, svgString );
  }
}
