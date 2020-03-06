import { EventEmitter, Injectable } from '@angular/core';
import { SVGStructure } from '../tool/tool-logic/tool-logic.directive';
import {UndoRedoService} from '../tool/undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  structure: SVGStructure;
  shape: SvgShape;
  header: SvgHeader;
  drawInProgress: boolean;
  selectAllElements: EventEmitter<null>;

  constructor(private readonly undoRedoService: UndoRedoService,
  ) {
    this.drawInProgress = false;
    this.selectAllElements = new EventEmitter();
    this.header = {
      id: 0,
      name: '',
      tags: []
    };
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
    [this.structure.drawZone, this.structure.temporaryZone]
    .forEach((zone: SVGGElement) => {
        Array.from(zone.children).forEach((children: SVGElement) => {
          children.remove();
        });
    });
    this.undoRedoService.clearUndoRedo();
    // TODO setter la variable gridService.active à false sans cyclic imports
  }

}

export interface SvgShape {
  width: number;
  height: number;
  color: string;
}

export interface SvgHeader {
  id: number;
  name: string;
  tags: string[];
}
