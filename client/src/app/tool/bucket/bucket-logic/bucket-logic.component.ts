import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SvgToCanvas } from 'src/app/svg-to-canvas/svg-to-canvas';
import { ColorService } from '../../color/color.service';
import { RGBAColor } from '../../color/rgba-color';
import { Point } from '../../shape/common/point';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { UndoRedoService } from '../../../undo-redo/undo-redo.service';
import { BucketService } from '../bucket.service';
import { PointSet } from './point-set';

const MAX_RGBA = 255;
const NUMBER_OF_DIMENSIONS = 4;
const MAX_DIFFERENCE = (MAX_RGBA * MAX_RGBA) * NUMBER_OF_DIMENSIONS;
const MAX_TOLERANCE = 100;
const NOT_TO_FAR = 100;

type PointQueue = Point[];

@Component({
  selector: 'app-paint-seal-logic',
  template: ''
})
export class BucketLogicComponent
  extends ToolLogicDirective implements OnInit, OnDestroy {

  private image: ImageData;
  private allListeners: (() => void)[];

  constructor(private renderer: Renderer2,
              private colorService: ColorService,
              private undoRedo: UndoRedoService,
              private service: BucketService
  ) {
    super();
    this.allListeners = [];
  }

  ngOnInit(): void {
    this.allListeners.push(
      this.renderer.listen(
        this.svgStructure.root,
        'click',
        ($event: MouseEvent) => { this.onMouseClick($event); }
      ));
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'crosshair');
  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
  }

  private async onMouseClick($event: MouseEvent): Promise<void> {
    const canvas = await new SvgToCanvas(this.svgStructure.root, this.svgShape, this.renderer)
    .getCanvas();
    this.image = (canvas.getContext('2d') as CanvasRenderingContext2D)
        .getImageData(0, 0, this.svgShape.width, this.svgShape.height);
    const startingPoint = new Point($event.offsetX, $event.offsetY);
    const borders = this.findBorders(startingPoint);
    const shapes = this.separateShapes(borders);
    this.drawSvg(shapes);
    this.undoRedo.saveState();
  }

  private findBorders(startingPoint: Point): PointSet {
    const borders = new PointSet();
    const fillQueue: PointQueue = [];
    const fillVisited = new PointSet();

    fillQueue.push(new Point(startingPoint.x, startingPoint.y));
    const oldColor = this.getColor(startingPoint);

    while (fillQueue.length !== 0) {
      const currentPoint = fillQueue.pop() as Point;
      const connectedPoints = this.fourConnectedPoint(currentPoint);
      for (const connectedPoint of connectedPoints) {
        if (fillVisited.has(connectedPoint)) {
          continue ;
        }
        if (!this.isValidPoint(connectedPoint)) {
          borders.add(currentPoint);
          break ;
        }
        if (this.isSameColor(connectedPoint, oldColor)) {
          fillQueue.push(connectedPoint);
          fillVisited.add(connectedPoint);
        } else {
          borders.add(connectedPoint);
        }
      }
    }

    return borders;
  }

  private separateShapes(borders: PointSet): Point[][] {
    const shapes: (Point[])[] = [];
    let shape: Point[] = [];
    let lastPoint = borders.randomPoint();
    borders.delete(lastPoint as Point);
    while (lastPoint !== null) {
      shape.push(lastPoint);
      const connectedPoints = this.eightConnectedPoints(lastPoint);
      let nextBorder: Point | null = null;
      for (const connectedPoint of connectedPoints) {
        if (borders.has(connectedPoint)) {
          nextBorder = connectedPoint;
          break;
        }
      }
      if (nextBorder == null) {
        let distance: number;
        [nextBorder, distance] = borders.nearestPoint(lastPoint);
        if (distance > NOT_TO_FAR) {
          shapes.push(shape);
          shape = [];
        }
      }
      lastPoint = nextBorder;
      if (lastPoint !== null) {
        borders.delete(lastPoint as Point);
      }
    }
    return shapes;
  }

  private isValidPoint(point: Point): boolean {
    const [x, y] = [point.x, point.y];
    return 0 <= x && x < this.svgShape.width
      && 0 <= y && y < this.svgShape.height;
  }

  private getColor(point: Point): RGBAColor {
    let position = (point.y * this.svgShape.width + point.x) * NUMBER_OF_DIMENSIONS;
    const pixel = this.image.data;
    return {
      r: pixel[position++],
      g: pixel[position++],
      b: pixel[position++],
      a: pixel[position],
    };
  }

  private isSameColor(point: Point, color: RGBAColor): boolean {
    const diffferenceNormalized =
      this.difference(color, this.getColor(point)) / MAX_DIFFERENCE;
    return (diffferenceNormalized * MAX_TOLERANCE) <= this.service.tolerance;
  }

  private drawSvg(shapes: Point[][]): void {

    let pathDAttribute = '';
    shapes.forEach((shape) => {
      let pathString = '';
      shape.forEach((point) => {
        pathString += pathString ? 'L' : 'M';
        pathString += `${point.x}, ${point.y} `;
      });
      pathString += 'z ';
      pathDAttribute += pathString;
    });

    const path = this.renderer.createElement('path', this.svgNS);
    this.renderer.setAttribute(path, 'fill-rule', 'evenodd');
    this.renderer.setAttribute(path, 'fill', this.colorService.primaryColor);
    this.renderer.setAttribute(path, 'stroke', this.colorService.primaryColor);
    this.renderer.setAttribute(path, 'stroke-width', '2');
    this.renderer.setAttribute(path, 'd', pathDAttribute);
    this.renderer.appendChild(this.svgStructure.drawZone, path);
  }

  private fourConnectedPoint({x, y}: Point): Point[] {
    return [
      new Point(x - 1, y    ),
      new Point(x + 1, y    ),
      new Point(x    , y - 1),
      new Point(x    , y + 1),
    ];
  }

  private eightConnectedPoints(point: Point): Point[] {
    const [x, y] = [point.x, point.y];
    return this.fourConnectedPoint(point).concat([
      new Point(x - 1, y - 1),
      new Point(x - 1, y + 1),
      new Point(x + 1, y - 1),
      new Point(x + 1, y + 1),
    ]);
  }

  private difference(color1: RGBAColor, color2: RGBAColor): number {
    return  (color1.r - color2.r) * (color1.r - color2.r)
          + (color1.g - color2.g) * (color1.g - color2.g)
          + (color1.b - color2.b) * (color1.b - color2.b)
          + (color1.a - color2.a) * (color1.a - color2.a);
  }

}
