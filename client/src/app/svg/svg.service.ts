import { EventEmitter, Injectable } from '@angular/core';
import { SVGStructure } from '../tool/tool-logic/tool-logic.directive';
import {UndoRedoService} from '../tool/undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  structure: SVGStructure;
  selectAllElements: EventEmitter<null>;
  shape: SvgShape;

  constructor(private readonly undoRedoService: UndoRedoService,
  ) {
    this.selectAllElements = new EventEmitter();
    this.shape = {
      width: 0,
      height: 0,
      color: 'none'
    };
  }

  changeBackgroundColor(color: string): void {
    this.shape.color = color;
  }

  clearDom(): void {
    [this.structure.drawZone, this.structure.temporaryZone,
      this.structure.endZone].forEach((zone: SVGGElement) => {
        Array.from(zone.children).forEach((children: SVGElement) => {
          children.remove();
        });
    });
    this.undoRedoService.clearUndoRedo();
  }

}

export interface SvgShape {
  width: number;
  height: number;
  color: string;
}
