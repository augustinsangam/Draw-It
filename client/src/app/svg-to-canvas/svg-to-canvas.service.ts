import { Injectable, Renderer2 } from '@angular/core';
import { SvgService } from '../svg/svg.service';

@Injectable({
  providedIn: 'root'
})
export class SvgToCanvasService {

  constructor(private svgService: SvgService) { }

  getCanvas(renderer: Renderer2): HTMLCanvasElement {
    const canvas = renderer.createElement('canvas') as HTMLCanvasElement;
    renderer.setAttribute(
      canvas,
      'height',
      this.svgService.shape.height.toString()
    );
    renderer.setAttribute(
      canvas,
      'width',
      this.svgService.shape.width.toString()
    );
    renderer.setStyle(
      canvas,
      'background-color',
      this.svgService.shape.color
    );
    const canvasContext = canvas.getContext('2d');
    const svgBlob = this.convertToBlob(renderer);
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => (canvasContext as CanvasRenderingContext2D).drawImage(img, 0, 0);
    img.src = url;
    return canvas;
  }

  private convertToBlob(renderer: Renderer2): Blob {
    renderer.setAttribute(
      this.svgService.structure.root,
      'xmlns',
      this.svgService.structure.root.namespaceURI as string
    );
    return new Blob(
      [new XMLSerializer().serializeToString(this.svgService.structure.root)],
      {
        type: 'image/svg+xml;charset=utf-8'
      }
    );
  }

}
