import { Renderer2 } from '@angular/core';
import { PolygoneService } from '../polygone/polygone.service';
import { RectangleService } from '../rectangle/rectangle.service';
import { EllipseService } from '../ellipse/ellipse.service';

export interface Style {
  strokeWidth: string;
  strokeColor: string;
  fillColor: string;
  opacity: string;
}
export enum BackGroundProperties {
  Filled,
  None
}
export enum StrokeProperties {
  Filled,
  Dashed,
  None
}

export abstract class AbstractShape {

  protected backgoundProperties: BackGroundProperties;
  protected strokeProperties: StrokeProperties;
  constructor(
    protected renderer: Renderer2,
    public element: SVGElement,
    protected thicknessService?: PolygoneService | RectangleService | EllipseService
  ) {
    this.backgoundProperties = BackGroundProperties.Filled;
    this.strokeProperties = StrokeProperties.Filled;
  }

  setParameters(background: BackGroundProperties, stroke: StrokeProperties)
    : void {
    if (stroke === StrokeProperties.None) {
      this.renderer.setAttribute(this.element, 'stroke', 'none');
      if (this.thicknessService !== undefined) {
        this.thicknessService.thickness = 0;
      }
    } else if (stroke === StrokeProperties.Dashed) {
      this.renderer.setAttribute(this.element, 'stroke-dasharray', '5,5');
      this.renderer.setAttribute(this.element, 'stroke', 'black');
    }
    if (background === BackGroundProperties.None) {
      this.renderer.setAttribute(this.element, 'fill', 'none');
    }
    this.backgoundProperties = background;
    this.strokeProperties = stroke;
  }

  setCss(style: Style): void {
    if (this.backgoundProperties === BackGroundProperties.Filled) {
      this.renderer.setAttribute(
        this.element, 'fill-opacity', style.opacity);
      this.renderer.setAttribute(this.element, 'fill', style.fillColor);
    }
    if (this.strokeProperties !== StrokeProperties.None) {
      this.renderer.setAttribute(
        this.element, 'stroke-width', style.strokeWidth);
      this.renderer.setAttribute(
        this.element, 'stroke', style.strokeColor);
    }
  }
}
