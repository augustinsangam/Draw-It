import { EventEmitter, Injectable } from '@angular/core';
import { SVGStructure } from '../tool/tool-logic/tool-logic.directive';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  structure: SVGStructure;
  selectAllElements: EventEmitter<null>;

  constructor() {
    this.selectAllElements = new EventEmitter();
  }

  changeBackgroundColor(color: string) {
    this.structure.root.style.backgroundColor = color;
  }

  clearDom(): void {
    [this.structure.drawZone, this.structure.temporaryZone,
      this.structure.endZone].forEach((zone: SVGGElement) => {
        Array.from(zone.children).forEach((children: SVGElement) => {
          children.remove();
        });
    });
  }

}
