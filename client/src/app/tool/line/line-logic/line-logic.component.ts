import { Component, ElementRef, Renderer2 } from '@angular/core';

import { ColorService } from '../../color/color.service';
import {Point} from '../../tool-common classes/Point'
import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { LineService } from '../line.service';
import {Path} from './Path'

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
