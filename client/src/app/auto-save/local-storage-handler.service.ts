import { Injectable } from '@angular/core';
import { SvgShape } from '../svg/svg-shape';

export enum AutoSaveKey {
  DRAW = 'draw',
  SHAPE = 'shape',
}

export interface LocalStorageReturn {
  shape: SvgShape;
  draw: SVGGElement;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageHandlerService {

  saveShape(shape: SvgShape): void {
    localStorage.setItem(AutoSaveKey.SHAPE, JSON.stringify(shape));
  }

  saveState(draw: SVGGElement): void {
    const svgDrawString = new XMLSerializer().serializeToString(draw);
    localStorage.setItem(AutoSaveKey.DRAW, svgDrawString);
  }

  clearDrawings(): void {
    localStorage.removeItem(AutoSaveKey.DRAW);
  }

  getDrawing(): LocalStorageReturn | null {
    const drawXML = localStorage.getItem(AutoSaveKey.DRAW);
    const shapeJson = localStorage.getItem(AutoSaveKey.SHAPE);

    if (drawXML === null || shapeJson === null) {
      return null;
    }

    const drawingDocument = new DOMParser().parseFromString(drawXML, 'image/svg+xml');
    const draw = drawingDocument.firstElementChild as SVGGElement;
    if (drawingDocument === null || draw.childElementCount === 0) {
      return null;
    }

    return {
      shape: JSON.parse(shapeJson),
      draw
    };
  }

}
