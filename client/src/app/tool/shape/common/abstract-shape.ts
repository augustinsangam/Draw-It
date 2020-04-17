import { Renderer2 } from '@angular/core';
import { EllipseService } from '../ellipse/ellipse.service';
import { PolygoneService } from '../polygone/polygone.service';
import { RectangleService } from '../rectangle/rectangle.service';

export interface Style {
  strokeWidth: string;
  strokeColor: string;
  fillColor: string;
  opacity: string;
}

export enum BackGroundProperties {
  FILLED,
  NONE
}

export enum StrokeProperties {
  FILLED,
  DASHED,
  NONE
}

export abstract class AbstractShape {

  protected backgoundProperties: BackGroundProperties;
  protected strokeProperties: StrokeProperties;
  constructor(
    protected renderer: Renderer2,
    public element: SVGElement,
    protected thicknessService?: PolygoneService | RectangleService | EllipseService
  ) {
    this.backgoundProperties = BackGroundProperties.FILLED;
    this.strokeProperties = StrokeProperties.FILLED;
  }

  setParameters(background: BackGroundProperties, stroke: StrokeProperties)
    : void {
    if (stroke === StrokeProperties.NONE) {
      this.renderer.setAttribute(this.element, 'stroke', 'none');
      if (this.thicknessService !== undefined) {
        this.thicknessService.thickness = 0;
      }
    } else if (stroke === StrokeProperties.DASHED) {
      this.renderer.setAttribute(this.element, 'stroke-dasharray', '5,5');
      this.renderer.setAttribute(this.element, 'stroke', 'black');
    }
    if (background === BackGroundProperties.NONE) {
      this.renderer.setAttribute(this.element, 'fill', 'none');
    }
    this.backgoundProperties = background;
    this.strokeProperties = stroke;
  }

  setCss(style: Style): void {
    if (this.backgoundProperties === BackGroundProperties.FILLED) {
      this.renderer.setAttribute(
        this.element, 'fill-opacity', style.opacity);
      this.renderer.setAttribute(this.element, 'fill', style.fillColor);
    }
    if (this.strokeProperties !== StrokeProperties.NONE) {
      this.renderer.setAttribute(
        this.element, 'stroke-width', style.strokeWidth);
      this.renderer.setAttribute(
        this.element, 'stroke', style.strokeColor);
    }
  }
}
