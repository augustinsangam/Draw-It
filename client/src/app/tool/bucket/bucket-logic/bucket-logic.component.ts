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
const NUMBER_OF_DIMENSIONS = 4;
const MAX_DIFFERENCE = (MAX_RGBA * MAX_RGBA) * NUMBER_OF_DIMENSIONS;
const MAX_TOLERANCE = 100;

type PointQueue = Point[];

@Component({
  selector: 'app-paint-seal-logic',
  template: ''
})
export class BucketLogicComponent
  extends ToolLogicDirective implements OnInit, OnDestroy {

  private canvasContext: CanvasRenderingContext2D;
  private allListeners: (() => void)[] = [];
  private fillQueue: PointQueue;
  private fillVisited: PointSet;
  private borders: PointSet;

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
      this.findBorders(startingPoint);
      const shapes = this.separateShapes();
      console.log(shapes);
      console.log(shapes.length);
      this.drawSvg(shapes);
      this.undoRedo.saveState();
    });
  }

  private findBorders(startingPoint: Point): void {

    this.fillQueue = [];
    this.borders = new PointSet();
    this.fillVisited = new PointSet();
    this.fillQueue.push(new Point(startingPoint.x, startingPoint.y));
    const oldColor = this.getColor(startingPoint);

    while (this.fillQueue.length !== 0) {

      const currentPoint = this.fillQueue.pop() as Point;

      if (!this.isSameColor(currentPoint, oldColor)) {
        continue;
      }

      const [x, y] = [currentPoint.x, currentPoint.y];

      const connectedPoints = [
        new Point(x - 1, y    ),
        new Point(x + 1, y    ),
        new Point(x    , y - 1),
        new Point(x    , y + 1),
      ];

      for (const connectedPoint of connectedPoints) {
        if (this.fillVisited.has(connectedPoint)) {
          continue ;
        }
        if (!this.isValidPoint(connectedPoint)) {
          this.borders.add(currentPoint);
          break ;
        }
        if (this.isSameColor(connectedPoint, oldColor)) {
          this.fillQueue.push(connectedPoint);
          this.fillVisited.add(connectedPoint);
        } else {
          this.borders.add(connectedPoint);
        }
      }
    }
  }

  private separateShapes(): Point[][] {
    const shapes: (Point[])[] = [];
    let shape: Point[];
    while (true) {
      const startPoint = this.borders.randomPoint();
      if (startPoint == null) {
        break;
      }
      shape = [];
      shape.push(startPoint);
      while (true) {
        const lastPoint = shape[shape.length - 1];
        const [x, y] = [lastPoint.x, lastPoint.y];
        const connectedPoints = [
          new Point(x - 1, y    ),
          new Point(x + 1, y    ),
          new Point(x    , y - 1),
          new Point(x    , y + 1),
          new Point(x - 1, y - 1),
          new Point(x - 1, y + 1),
          new Point(x + 1, y - 1),
          new Point(x + 1, y + 1),
        ];
        let nearestPoint: Point | null = null;
        for (const connectedPoint of connectedPoints) {
          if (this.borders.has(connectedPoint)) {
            nearestPoint = connectedPoint;
            break;
          }
        }
        if (nearestPoint == null) {
          nearestPoint = this.borders.nearestPoint(lastPoint as Point);
          console.log(lastPoint);
          console.log(nearestPoint);
          console.log(shape);
          if (nearestPoint == null) {
            throw new Error('On ne devrait pas arriver ici une deuxieme fois. Prenez une photo de la forme');
          }
        }
        shape.push(nearestPoint as Point);
        this.borders.delete(nearestPoint as Point);
        if ((nearestPoint as Point).equals(shape[0])) {
          break;
        }
      }
      shapes.push(shape);
    }
    return shapes;
  }

  private isValidPoint(point: Point): boolean {
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
      a: pixel[NUMBER_OF_DIMENSIONS - 1],
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
        if (pathString === '') {
          pathString += `M${point.x}, ${point.y} `;
        } else {
          pathString += `L${point.x}, ${point.y} `;
        }
      });
      pathString += 'z ';
      pathDAttribute += pathString;
    });

    const path = this.renderer.createElement('path', this.svgNS);
    this.renderer.setAttribute(path, 'fill-rule', 'evenodd');
    this.renderer.setAttribute(path, 'fill', this.colorService.primaryColor);
    this.renderer.setAttribute(path, 'stroke-width', '0');
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
