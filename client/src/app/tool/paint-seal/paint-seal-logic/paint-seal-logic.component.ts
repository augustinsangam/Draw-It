import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SvgToCanvasService } from 'src/app/svg-to-canvas/svg-to-canvas.service';
import { ColorService } from '../../color/color.service';
import { RGBAColor } from '../../color/rgba-color';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';

interface Point {
  x: number;
  y: number;
}

const MAX_RGBA = 255;
@Component({
  selector: 'app-paint-seal-logic',
  template: ''
})
export class PaintSealLogicComponent
  extends ToolLogicDirective implements OnInit, OnDestroy {

  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private imageData: ImageData;
  private allListeners: (() => void)[] = [];
  private stack: Point[];

  constructor(private readonly svgToCanvas: SvgToCanvasService,
              private renderer: Renderer2,
              private colorService: ColorService,
  ) {
    super();
    this.stack = [];
  }

  ngOnInit(): void {
    this.allListeners.push(
      this.renderer.listen(
        this.svgStructure.root,
        'click',
        ($event: MouseEvent) => this.onMouseClick($event)
      ));

    this.initiliseCanavas();

  }

  private initiliseCanavas(): void {
    this.canvas = this.svgToCanvas.getCanvas(this.renderer);
    this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
  }

  private onMouseClick($event: MouseEvent): void {
    this.imageData = this.canvasContext.getImageData(0, 0, this.svgShape.width, this.svgShape.height);
    const colorToReplace = this.getColor($event.offsetX, $event.offsetY);
    this.fill($event.offsetX, $event.offsetY, colorToReplace);
    this.canvasContext.putImageData(this.imageData, 0, 0);
    this.renderer.appendChild(this.svgStructure.root.parentNode, this.canvas);
    this.stack = [];
  }

  private fill(startingX: number, startingY: number, colorToReplace: RGBAColor): void {

    this.stack.push({
      x: startingX,
      y: startingY
    });

    const replaceColor = this.colorService.rgbaFromString(
      this.colorService.primaryColor
    );

    while (this.stack.length !== 0) {

      if (this.stack.length > 5000) {
        break;
      }

      const pointToVisit = this.stack.shift() as Point;

      const [x, y] = [pointToVisit.x, pointToVisit.y];

      if (this.isValidCoordinates(x, y)
        && this.colorService.rgbaEqual(colorToReplace, this.getColor(x, y))) {
        this.replaceColor(x, y, replaceColor);
        this.stack.push({ x: x + 1, y });
        this.stack.push({ x: x - 1, y });
        this.stack.push({ x, y: y + 1 });
        this.stack.push({ x, y: y - 1 });
      }
    }
  }

  private replaceColor(x: number, y: number, replaceColor: RGBAColor): void {
    let position = ( y * this.svgShape.width + x ) * 4 ;
    this.imageData.data[position++] = replaceColor.r;
    this.imageData.data[position++] = replaceColor.g;
    this.imageData.data[position++] = replaceColor.b;
    this.imageData.data[position++] = MAX_RGBA;
    // this.imageData.data[position++] = replaceColor.a * MAX_RGBA;
  }

  private isValidCoordinates(x: number, y: number): boolean {
    return 0 <= x && x <= this.svgShape.width
      && 0 <= y && y <= this.svgShape.height;
  }

  getColor(x: number, y: number): RGBAColor {
    const pixel = this.canvasContext.getImageData(x, y, 1, 1).data;
    return {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      // tslint:disable-next-line:no-magic-numbers
      a: pixel[3] / MAX_RGBA,
    };
  }

}
