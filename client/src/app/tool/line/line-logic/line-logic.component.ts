import { Component, ElementRef, Renderer2 } from '@angular/core';

import { ColorService } from '../../color/color.service';
import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { LineService } from '../line.service';

@Component({
  selector: 'app-line-logic',
  templateUrl: './line-logic.component.html',
  styleUrls: ['./line-logic.component.scss']
})
export class LineLogicComponent extends ToolLogicComponent {
  private paths: Path[] = [];
  private currentPathIndex = -1;
  private newPath = true;
  private lastPoint: Point;
  constructor(private readonly service: LineService,
              private readonly renderer: Renderer2,
              private readonly serviceColor: ColorService) {
    super();
  }
  private listeners: (() => void)[] = [];

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    const onMouseDown = this.renderer.listen(this.svgElRef.nativeElement, 'click', (mouseEv: MouseEvent) => {
      let currentPoint = new Point( mouseEv.offsetX , mouseEv.offsetY );
      const path = this.renderer.createElement('path', this.svgNS);
      if (this.newPath) {
        this.createNewPath(currentPoint, path)
        this.newPath = false;
      } else if (mouseEv.shiftKey) {
        currentPoint = this.getPath().getAlignedPoint(currentPoint);
      }
      if (this.getPath().withJonctions) {
        this.createJonction(currentPoint);
      }
      this.getPath().addLine(currentPoint);
    });

    const onMouseMove = this.renderer.listen(this.svgElRef.nativeElement, 'mousemove', (mouseEv: MouseEvent) => {
      if (!this.newPath) {
        this.lastPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
        let point = new Point(mouseEv.offsetX, mouseEv.offsetY);
        if (mouseEv.shiftKey) {
          point = this.getPath().getAlignedPoint(point)
        }
        this.getPath().addTemporaryLine(point);
      }
    });
    const onMouseUp = this.renderer.listen(this.svgElRef.nativeElement, 'dblclick', (mouseEv: MouseEvent) => {
        if (!this.newPath)  {
          let currentPoint  = new Point( mouseEv.offsetX , mouseEv.offsetY);
          this.getPath().removeLastLine();
          this.getPath().removeLastLine();
          if (this.distanceIsLessThan3Pixel( currentPoint  , this.getPath().points[0]) ) {
            this.getPath().closePath();
          } else {
            if ( mouseEv.shiftKey ) {
              currentPoint  =  this.getPath().getAlignedPoint(currentPoint )
            }
            this.getPath().addLine(currentPoint );
            if (this.getPath().withJonctions) {
              this.createJonction(currentPoint );
            }
          }
          this.newPath = true;
          }
      });
    const onKeyDown = this.renderer.listen('document', 'keydown', (keyEv: KeyboardEvent) => {
          if (keyEv.code === 'Escape' && !this.newPath) {
            this.getPath().removePath();
            this.newPath = true;
          }
          if (keyEv.code === 'Backspace' && this.getPath().points.length >= 2) {
            this.getPath().removeLastLine();
            this.getPath().addTemporaryLine(this.getPath().lastPoint);
          }
          if ((keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') && !this.newPath) {
            const currentPoint  =  this.getPath().getAlignedPoint(this.getPath().lastPoint )
            this.getPath().addTemporaryLine(currentPoint);
          }
      });
    const onKeyUp = this.renderer.listen('document', 'keyup', (keyEv: KeyboardEvent) => {
       if ((keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') && !this.newPath) {
              this.getPath().addTemporaryLine(this.lastPoint);
        }
      });
    this.listeners = [onMouseDown, onMouseMove, onMouseUp, onKeyUp, onKeyDown];
    }
    createNewPath(point: Point, path: ElementRef) {
      this.renderer.appendChild( this.svgElRef.nativeElement , path);
      this.paths[++this.currentPathIndex] = new Path ( point, this.renderer, path, this.service.withJonction)
      this.getPath().setParameters(this.service.thickness.toString(), this.serviceColor.primaryColor);
    }
    createJonction(center: Point) {
      const circle = this.renderer.createElement('circle', this.svgNS);
      this.renderer.appendChild( this.svgElRef.nativeElement , circle);
      this.renderer.setAttribute(circle, 'fill', this.serviceColor.primaryColor);
      this.getPath().addJonction (circle, center, this.service.radius.toString());
    }
    distanceIsLessThan3Pixel( point1: Point , point2: Point ): boolean {
      return ((Math.abs(point1.x - point2.x) <= 3) && (Math.abs(point1.y - point2.y) <= 3));
    }
    getPath(): Path {
      return this.paths[this.currentPathIndex];
    }
    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy() {
      this.listeners.forEach(listenner => {
        listenner();
      })}
}
export class Path {
  svgNS = ' http://www.w3.org/2000/svg ';
  points: Point[] = [];
  jonctions: Circle[] = [];
  instructions: string[] = [];
  private pathString = '';
  lastPoint: Point;
  withJonctions: boolean;
  constructor( initialPoint: Point, private renderer: Renderer2, private element: ElementRef, withJonction: boolean ) {
    this.points.push(initialPoint);
    const instruction = 'M ' + initialPoint.x.toString() + ' ' + initialPoint.y.toString() + ' ';
    this.instructions.push(instruction);
    this.pathString += instruction;
    this.renderer.setAttribute(this.element, 'd', this.pathString);
    this.renderer.setAttribute(this.element, 'fill', 'none')
    this.withJonctions = withJonction;
  }
  addLine(point: Point) {
    this.points.push(point);
    const instruction = 'L ' + point.x.toString() + ' ' + point.y.toString() + ' ';
    this.instructions.push(instruction);
    this.pathString += instruction;
    this.renderer.setAttribute(this.element, 'd', this.pathString);
  }
  addJonction(element: ElementRef, point: Point, jonctionRadius: string) {
    this.jonctions.push(new Circle(point, this.renderer, element, jonctionRadius));
  }
  addTemporaryLine(point: Point) {
    const temp = this.pathString + 'L ' + point.x.toString() + ' ' + point.y.toString() + ' ';
    this.lastPoint = point;
    this.renderer.setAttribute(this.element, 'd', temp);
  }
  removeLastLine() {
    this.points.pop();
    this.pathString = this.pathString.substr(0, this.pathString.length - String(this.instructions.pop()).length );
    this.renderer.setAttribute(this.element, 'd', this.pathString );
    if (this.withJonctions && this.jonctions.length > 1) {
      this.removeLastJonction();
    }
  }
  removePath() {
    this.pathString = '';
    this.points = [];
    this.instructions = [];
    this.renderer.setAttribute(this.element, 'd', this.pathString);
    while (this.jonctions.length) {
      this.removeLastJonction()
    }
  }
  removeLastJonction() {
    const lastCircle = this.jonctions.pop();
    if (lastCircle !== undefined) {
      const lastJonction = lastCircle.element;
      this.renderer.removeChild(this.renderer.parentNode(lastJonction), lastJonction);
    }
  }
  closePath() {
    this.points.push(this.points[0]);
    const instruction = 'Z';
    this.instructions.push(instruction)
    this.pathString += instruction;
    this.renderer.setAttribute(this.element, 'd', this.pathString);
  }
  getAlignedPoint(point: Point): Point {
    const deltaX = point.x - this.points[this.points.length - 1].x
    const deltaY = point.y - this.points[this.points.length - 1].y
    const angle = Math.atan(deltaY / deltaX)
    if (Math.abs(angle) < Math.PI / 8) {
      return new Point(point.x, this.points[this.points.length - 1].y)
    }
    if (Math.abs(angle) > Math.PI * 3 / 8) {
      return new Point(this.points[this.points.length - 1].x, point.y)
    } else {
      if (deltaY * deltaX > 0) {
        return new Point(point.x, this.points[this.points.length - 1].y + deltaX)
      } else {
        return new Point(point.x, this.points[this.points.length - 1].y - deltaX)
      }
    }
  }
  setParameters(strokewidth: string, strokeColor: string) {
    this.renderer.setAttribute(this.element, 'stroke-width', strokewidth);
    this.renderer.setAttribute(this.element, 'stroke', strokeColor);
  }
}
export class Circle {
  svgNS = ' http://www.w3.org/2000/svg ';
  strokeColor = 'black';
  circleRadius = '0';
  constructor(center: Point, private renderer: Renderer2, public element: ElementRef, circleRadius: string) {
    this.renderer.setAttribute(this.element, 'cx', center.x.toString());
    this.renderer.setAttribute(this.element, 'cy', center.y.toString());
    this.renderer.setAttribute(this.element, 'r', circleRadius);
  }
}

export class Point {
  x = 0;
  y = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
