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
    this.test();
  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
  }

  private onMouseClick($event: MouseEvent): void {
    this.svgToCanvas.getCanvas(this.renderer).then((canvas) => {
      this.canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
      const startingPoint = new Point($event.offsetX, $event.offsetY);
      const startingTime = new Date().getTime();
      this.fill(startingPoint);
      console.log(`Time : ${new Date().getTime() - startingTime}`);
      this.drawSvg();
      this.undoRedo.saveState();
    });
  }

  private fill(startingPoint: Point): void {

    this.fillQueue = [];
    this.borders = new PointSet();
    this.fillVisited = new PointSet();
    this.fillQueue.push(new Point(startingPoint.x, startingPoint.y));
    const oldColor = this.getColor(startingPoint);

    while (this.fillQueue.length !== 0) {

      const currentPoint = this.fillQueue.pop() as Point;

      const [x, y] = [currentPoint.x, currentPoint.y];

      const connectedPoints = [
        new Point(x - 1, y),
        new Point(x + 1, y),
        new Point(x, y - 1),
        new Point(x, y + 1),
      ];

      for (const connectedPoint of connectedPoints) {
        if (this.fillVisited.has(connectedPoint)) {
          continue ;
        }
        if (!this.isValidPoint(connectedPoint)) {
          this.borders.add(currentPoint);
          continue ;
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
      // tslint:disable-next-line:no-magic-numbers
      a: pixel[3],
    };
  }

  private isSameColor(point: Point, color: RGBAColor): boolean {
    const diffferenceNormalized = this.difference(color, this.getColor(point)) / MAX_DIFFERENCE;
    return (diffferenceNormalized * MAX_TOLERANCE) <= this.service.tolerance;
  }

  private drawSvg(): void {
    // let pathDAttribute = '';
    // this.fillVisited.forEach((point) => {
    //   pathDAttribute += `M ${point.x - 1}, ${point.y} a 1, 1 0 1, 0 2,0 a 1, 1 0 1, 0 -2,0 `;
    // });
    // const path = this.renderer.createElement('path', this.svgNS);
    // this.renderer.setAttribute(path, 'stroke', this.colorService.primaryColor);
    // this.renderer.setAttribute(path, 'stroke-width', '1');
    // this.renderer.setAttribute(path, 'd', pathDAttribute);
    // this.renderer.appendChild(this.svgStructure.drawZone, path);
  }

  private difference(color1: RGBAColor, color2: RGBAColor): number {
    return  (color1.r - color2.r) * (color1.r - color2.r)
          + (color1.g - color2.g) * (color1.g - color2.g)
          + (color1.b - color2.b) * (color1.b - color2.b)
          + (color1.a - color2.a) * (color1.a - color2.a);
  }

  // tslint:disable no-magic-numbers
  private test(): void {
    let pathDAttribute = '' ;
    let pathString = '';
    this.createSquare(new Point(100, 100), 500).forEach((point) => {
      if (pathString === '') {
        pathString += `M${point.x}, ${point.y} `;
      } else {
        pathString += `L${point.x}, ${point.y} `;
      }
    });
    pathString += 'z ';
    pathDAttribute += pathString;

    pathString = '';
    this.createSquare(new Point(200, 200), 50).forEach((point) => {
      if (pathString === '') {
        pathString += `M${point.x}, ${point.y} `;
      } else {
        pathString += `L${point.x}, ${point.y} `;
      }
    });
    pathString += 'z ';
    pathDAttribute += pathString;
    pathString = '';

    pathString = '';
    this.createSquare(new Point(300, 300), 50).forEach((point) => {
      if (pathString === '') {
        pathString += `M${point.x}, ${point.y} `;
      } else {
        pathString += `L${point.x}, ${point.y} `;
      }
    });
    pathString += 'z ';
    pathDAttribute += pathString;
    pathString = '';

    pathString = '';
    this.createSquare(new Point(220, 220), 10).forEach((point) => {
      if (pathString === '') {
        pathString += `M${point.x}, ${point.y} `;
      } else {
        pathString += `L${point.x}, ${point.y} `;
      }
    });
    pathString += 'z ';
    pathDAttribute += pathString;
    pathString = '';

    const path = this.renderer.createElement('path', this.svgNS);
    this.renderer.setAttribute(path, 'stroke', this.colorService.secondaryColor);
    this.renderer.setAttribute(path, 'fill-rule', 'evenodd');
    this.renderer.setAttribute(path, 'fill', this.colorService.primaryColor);
    this.renderer.setAttribute(path, 'stroke-width', '1');
    this.renderer.setAttribute(path, 'd', pathDAttribute);
    this.renderer.appendChild(this.svgStructure.drawZone, path);
  }

  private createSquare(depart: Point, cote: number): Point[] {
    const points: Point[] = [];
    const [x, y] = [depart.x, depart.y];
    for (let i = x; i < x + cote; i++) {
      points.push(new Point(i, y));
    }
    for (let i = y; i < y + cote; i++) {
      points.push(new Point(x + cote, i));
    }
    for (let i = x + cote; i > x; i--) {
      points.push(new Point(i, y + cote));
    }
    for (let i = y + cote; i > y; i--) {
      points.push(new Point(x, i));
    }
    return points;
  }

}
