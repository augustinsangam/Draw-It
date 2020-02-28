import { EventEmitter, Injectable } from '@angular/core';
import { SVGStructure } from '../tool/tool-logic/tool-logic.directive';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  structure: SVGStructure;
  selectAllElements: EventEmitter<null>;
  shape: SvgShape;

  id: number;
  name: string;
  tags: string[];

  constructor() {
    this.id = 0;
    this.name = '';
    this.tags = [];
    this.selectAllElements = new EventEmitter();
    this.shape = {
      width: 0,
      height: 0,
      color: 'none'
    }
  }

  changeBackgroundColor(color: string) {
    this.shape.color = color;
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

export interface SvgShape {
  width: number;
  height: number;
  color: string;
}
