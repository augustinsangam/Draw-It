import { Injectable } from '@angular/core';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { SvgHeader } from './svg-header';
import { SvgShape } from './svg-shape';
import { SVGStructure } from './svg-structure';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  structure: SVGStructure;
  shape: SvgShape;
  header: SvgHeader;
  drawInProgress: boolean;

  constructor(private readonly undoRedoService: UndoRedoService,
  ) {
    this.drawInProgress = false;
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
  }

}
