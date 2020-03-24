import { Renderer2 } from '@angular/core';
import { SvgShape } from '../svg/svg-shape';

export class SvgToCanvas {

  width: string;
  height: string;
  color: string;

  constructor(private svg: SVGSVGElement,
              svgShape: SvgShape,
              private renderer: Renderer2) {
    this.width = svgShape.width.toString();
    this.height = svgShape.height.toString();
    this.color = svgShape.color;
  }

  async getCanvas(): Promise<HTMLCanvasElement> {

    return new Promise<HTMLCanvasElement>((resolve) => {

      const canvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
      this.renderer.setAttribute(canvas, 'height', this.height);
      this.renderer.setAttribute(canvas, 'width', this.width);
      this.renderer.setStyle(canvas, 'background-color', this.color);

      const svgSerialized = this.serialiseSvg();
      const img = new Image();
      this.renderer.setAttribute(img, 'src', `data:image/svg+xml;base64,${btoa(svgSerialized)}`);
      img.onload = () => {
        (canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(img, 0, 0);
        resolve(canvas);
      };

    });

  }

  private serialiseSvg(): string {
    return new XMLSerializer().serializeToString(this.svg);
  }

}
