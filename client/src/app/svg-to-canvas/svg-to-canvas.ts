import { Renderer2 } from '@angular/core';
import { SvgShape } from '../svg/svg-shape';
import { SVGStructure } from '../svg/svg-structure';

export class SvgToCanvas {

  width: string;
  height: string;
  color: string;

  constructor(private svgStructure: SVGStructure,
              svgShape: SvgShape,
              private renderer: Renderer2) {
    this.width = svgShape.width.toString();
    this.height = svgShape.height.toString();
    this.color = svgShape.color;
  }

  async getCanvas(renderer: Renderer2): Promise<HTMLCanvasElement> {

    return new Promise<HTMLCanvasElement>((resolve) => {

      const canvas = renderer.createElement('canvas') as HTMLCanvasElement;
      renderer.setAttribute(canvas, 'height', this.height);
      renderer.setAttribute(canvas, 'width', this.width);
      renderer.setStyle(canvas, 'background-color', this.color);

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
    const svg = this.renderer.createElement('svg', 'http://www.w3.org/2000/svg') as SVGSVGElement;
    this.renderer.setAttribute(svg, 'height', this.height);
    this.renderer.setAttribute(svg, 'width', this.width);
    this.renderer.setStyle(svg, 'background-color', this.color);
    this.renderer.appendChild(svg, this.svgStructure.defsZone.cloneNode(true));
    this.renderer.appendChild(svg, this.svgStructure.drawZone.cloneNode(true));
    return new XMLSerializer().serializeToString(svg);
  }

}
