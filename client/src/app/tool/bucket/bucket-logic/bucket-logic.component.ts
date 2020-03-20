import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SvgToCanvasService } from 'src/app/svg-to-canvas/svg-to-canvas.service';
import { ColorService } from '../../color/color.service';
import { RGBAColor } from '../../color/rgba-color';
import { Point } from '../../shape/common/point';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { BucketService } from '../bucket.service';
import { PointSet } from './point-set';

const MAX_RGBA = 255;
const MAX_DIFFERENCE = (MAX_RGBA * MAX_RGBA) * 4;
const MAX_TOLERANCE = 100;

@Component({
  selector: 'app-paint-seal-logic',
  template: ''
})
export class BucketLogicComponent
  extends ToolLogicDirective implements OnInit, OnDestroy {

  private canvasContext: CanvasRenderingContext2D;
  private allListeners: (() => void)[] = [];
  private stack: Point[];
  private visited: PointSet;

  constructor(private readonly svgToCanvas: SvgToCanvasService,
              private renderer: Renderer2,
              private colorService: ColorService,
              private undoRedo: UndoRedoService,
              private service: BucketService
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
    this.visited = new PointSet();
    this.stack.push(new Point(startingPoint.x, startingPoint.y));
    const oldColor = this.getColor(startingPoint);

    while (this.stack.length !== 0) {

      const currentPoint = this.stack.pop() as Point;
      this.visited.add(currentPoint);
      const [x, y] = [currentPoint.x, currentPoint.y];

      const connectedPoints = [
        new Point(x, y + 1),
        new Point(x, y - 1),
        new Point(x + 1, y),
        new Point(x - 1, y)
      ];

      connectedPoints.forEach((connectedPoint) => {
        if (!this.visited.has(connectedPoint)
            && this.isSameColor(connectedPoint, oldColor)) {
          this.stack.push(connectedPoint);
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
      a: pixel[3],
    };
  }

  private isSameColor(point: Point, color: RGBAColor): boolean {
    if (!this.isValidCoordinates(point)) {
      return false;
    }
    const diffferenceNormalized = this.difference(color, this.getColor(point)) / MAX_DIFFERENCE;
    return (diffferenceNormalized * MAX_TOLERANCE) <= this.service.tolerance;
  }

  private drawSvg(): void {
    let pathDAttribute = '';
    this.visited.forEach((point) => {
      pathDAttribute += `M ${point.x - 1}, ${point.y} a 1, 1 0 1, 0 2,0 a 1, 1 0 1, 0 -2,0 `;
    });
    const path = this.renderer.createElement('path', this.svgNS);
    this.renderer.setAttribute(path, 'stroke', this.colorService.primaryColor);
    this.renderer.setAttribute(path, 'stroke-width', '1');
    this.renderer.setAttribute(path, 'd', pathDAttribute);
    this.renderer.appendChild(this.svgStructure.drawZone, path);
  }

  private difference(color1: RGBAColor, color2: RGBAColor): number {
    return  (color1.r - color2.r) * (color1.r - color2.r)
          + (color1.g - color2.g) * (color1.g - color2.g)
          + (color1.b - color2.b) * (color1.b - color2.b)
          + (color1.a - color2.a) * (color1.a - color2.a);
  }

}
