import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SvgToCanvasService } from 'src/app/svg-to-canvas/svg-to-canvas.service';
import { ColorService } from '../../color/color.service';
import { RGBAColor } from '../../color/rgba-color';
import { Point } from '../../shape/common/point';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';

const MAX_RGBA = 255;

@Component({
  selector: 'app-paint-seal-logic',
  template: ''
})
export class BucketLogicComponent
  extends ToolLogicDirective implements OnInit, OnDestroy {

  private canvasContext: CanvasRenderingContext2D;
  private allListeners: (() => void)[] = [];
  private stack: Point[];
  private visited: Set<string>;

  constructor(private readonly svgToCanvas: SvgToCanvasService,
              private renderer: Renderer2,
              private colorService: ColorService,
              private undoRedo: UndoRedoService
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

    }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
  }

  private onMouseClick($event: MouseEvent): void {
    this.svgToCanvas.getCanvas(this.renderer).then((canvas) => {
      this.canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
      const startingPoint = new Point($event.offsetX, $event.offsetY);
      this.fill(startingPoint);
      this.drawSvg();
      this.undoRedo.saveState();
    });
  }

  private fill(startingPoint: Point): void {

    this.stack = [];
    this.visited = new Set();
    this.stack.push(new Point(startingPoint.x, startingPoint.y));
    const oldColor = this.getColor(startingPoint);

    while (this.stack.length !== 0) {

      const point = this.stack.pop() as Point;
      this.markVisited(point);
      const [x, y] = [point.x, point.y];

      const possiblePoints = [
        new Point(x, y + 1),
        new Point(x, y - 1),
        new Point(x + 1, y),
        new Point(x - 1, y)
      ];

      possiblePoints.forEach((newPoint) => {
        if (!this.isAlreadyVisited(newPoint)
            && this.isSameColor(newPoint, oldColor)) {
          this.stack.push(newPoint);
        }
      });
    }
  }

  private isValidCoordinates(point: Point): boolean {
    const [x, y] = [point.x, point.y];
    return 0 <= x && x <= this.svgShape.width
      && 0 <= y && y <= this.svgShape.height;
  }

  private getColor(point: Point): RGBAColor {
    const pixel = this.canvasContext.getImageData(point.x, point.y, 1, 1).data;
    return {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      // tslint:disable-next-line:no-magic-numbers
      a: pixel[3] / MAX_RGBA,
    };
  }

  private isSameColor(point: Point, color: RGBAColor): boolean {
    if (!this.isValidCoordinates(point)) {
      return false;
    }
    return this.colorService.rgbaEqual(color, this.getColor(point));
  }

  private markVisited(point: Point): void {
    this.visited.add(`${point.x} ${point.y}`);
  }

  private isAlreadyVisited(point: Point): boolean {
    return this.visited.has(`${point.x} ${point.y}`);
  }

  private drawSvg(): void {
    let pathDAttribute = '';
    this.visited.forEach((point) => {
      const [x, y] = point.split(' ').map((value) => Number(value));
      pathDAttribute += `M ${x - 1}, ${y} a 1, 1 0 1, 0 2,0 a 1, 1 0 1, 0 -2,0 `;
    });
    const path = this.renderer.createElement('path', this.svgNS);
    this.renderer.setAttribute(path, 'stroke', this.colorService.primaryColor);
    this.renderer.setAttribute(path, 'stroke-width', '1');
    this.renderer.setAttribute(path, 'd', pathDAttribute);
    this.renderer.appendChild(this.svgStructure.drawZone, path);
  }

}
