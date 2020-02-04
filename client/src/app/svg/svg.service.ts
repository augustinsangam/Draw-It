import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  istance: ElementRef<SVGElement>;

  constructor() { }
}
