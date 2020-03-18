import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SvgToCanvasService } from 'src/app/svg-to-canvas/svg-to-canvas.service';
import { ColorService } from '../../color/color.service';
import { RGBAColor } from '../../color/rgba-color';
import { Point } from '../../shape/common/point';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
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
  private visited: Set<string>;

  constructor(private readonly svgToCanvas: SvgToCanvasService,
              private renderer: Renderer2,
              private colorService: ColorService,
  ) {
    super();
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
    const oldColor = this.getColor($event.offsetX, $event.offsetY);
    this.fill($event.offsetX, $event.offsetY, oldColor);
    this.canvasContext.putImageData(this.imageData, 0, 0);
    this.renderer.appendChild(this.svgStructure.root.parentNode, this.canvas);
  }

  // tslint:disable-next-line: cyclomatic-complexity
  private fill(startingX: number, startingY: number, oldColor: RGBAColor): void {

    const isOldColor: (x: number, y: number) => boolean = (x: number, y: number) => {
      if (!this.isValidCoordinates(x, y)) {
        return false;
      }
      return this.colorService.rgbaEqual(oldColor, this.getColor(x, y));
    };

    const newColor = this.colorService.rgbaFromString(
      this.colorService.primaryColor
    );

    this.stack.push(new Point(startingX, startingY));

    while (this.stack.length !== 0) {
      const newPoint = this.stack.pop() as Point;
      const [x, y] = [newPoint.x, newPoint.y];
      this.replaceColor(x, y, newColor);
      this.markVisited(x, y);

      const possiblePoints = [
        new Point(x, y + 1),
        new Point(x, y - 1),
        new Point(x + 1, y),
        new Point(x - 1, y)
      ];

      possiblePoints.forEach((point) => {
        if (!this.isAlreadyVisited(point.x, point.y) && isOldColor(point.x, point.y)) {
          this.stack.p;
        }
      })
    }

  }

  private replaceColor(x: number, y: number, newColor: RGBAColor): void {
    let position = ( y * this.svgShape.width + x ) * 4 ;
    this.imageData.data[position++] = newColor.r;
    this.imageData.data[position++] = newColor.g;
    this.imageData.data[position++] = newColor.b;
    this.imageData.data[position++] = newColor.a * MAX_RGBA;
  }

  private isValidCoordinates(x: number, y: number): boolean {
    return 0 <= x && x <= this.svgShape.width
      && 0 <= y && y <= this.svgShape.height;
  }

  private getColor(x: number, y: number): RGBAColor {
    const pixel = this.canvasContext.getImageData(x, y, 1, 1).data;
    return {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      // tslint:disable-next-line:no-magic-numbers
      a: pixel[3] / MAX_RGBA,
    };
  }

  private markVisited(x: number, y: number): void {
    this.visited.add(`${x} ${y}`);
  }

  private isAlreadyVisited(x: number, y: number): boolean {
    return this.visited.has(`${x} ${y}`);
  }

}
