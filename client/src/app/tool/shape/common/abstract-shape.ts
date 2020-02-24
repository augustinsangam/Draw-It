import { ElementRef, Renderer2 } from '@angular/core';

export abstract class AbstractShape {

    protected backgoundProperties: BackgroundProperties;
    protected strokeProperties: StrokeProperties;
    constructor(
        protected renderer: Renderer2,
        public element: ElementRef,
    ) {
        this.backgoundProperties = BackgroundProperties.Filled;
        this.strokeProperties = StrokeProperties.Filled;
        }

    setParameters(background: BackgroundProperties, stroke: StrokeProperties):
      void {
      if (stroke === StrokeProperties.None) {
          this.renderer.setAttribute(this.element, 'stroke', 'none');
      } else if (stroke === StrokeProperties.Dashed) {
          this.renderer.setAttribute(this.element, 'stroke-dasharray', '5,5');
          this.renderer.setAttribute(this.element, 'stroke', 'black');
      }
      if (background === BackgroundProperties.None) {
          this.renderer.setAttribute(this.element, 'fill', 'none');
      }
      this.backgoundProperties = background;
      this.strokeProperties = stroke;
    }

    setCss(style: Style): void {
        if (this.backgoundProperties === BackgroundProperties.Filled) {
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
export interface Style {
  fillColor: string;
  opacity: string; // from 0 to one
  strokeColor: string;
  strokeWidth: string;
}
export enum BackgroundProperties {
    Filled,
    None
}
export enum StrokeProperties {
    Filled,
    Dashed,
    None
}
