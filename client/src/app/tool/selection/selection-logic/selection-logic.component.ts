import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { Offset } from '../Offset';
import { Point } from '../Point';
import { ZoneSelection } from '../ZoneSelection';

@Component({
  selector: 'app-selection-logic',
  templateUrl: './selection-logic.component.html',
  styleUrls: ['./selection-logic.component.scss']
})
export class SelectionLogicComponent
  extends ToolLogicDirective implements OnDestroy {

  private boudingRect: ElementRef<SVGElement>;
  private allListenners: (() => void)[];
  private svgOffset: Offset;

  private mouse: MouseTracking;

  constructor(private renderer: Renderer2) {
    super();
    this.boudingRect = new ElementRef(
      this.renderer.createElement('rect', this.svgNS)
    );
    this.allListenners = [];
  }

  private handlers = {
    click: ($event: MouseEvent) => {
      if ($event.target !== this.svgElRef.nativeElement
        && this.mouse.startPoint.equals(this.mouse.endPoint)) {
        this.createBoudingRectangle($event.target as SVGElement);
      } else if (!this.mouse.startPoint.equals(this.mouse.endPoint)) {
        this.drawSelectionRectangle(this.mouse.startPoint, this.mouse.currentPoint);
      } else {
        this.deleteRectangle();
        console.log('On supprime tout');
      }
    },

    mousedown: ($event: MouseEvent) => {
      this.mouse.startPoint = new Point($event.offsetX, $event.offsetY);
      this.mouse.mouseIsDown = true;
    },

    mousemouve: ($event: MouseEvent) => {
      if (this.mouse.mouseIsDown) {
        this.mouse.currentPoint = new Point($event.offsetX, $event.offsetY);
        this.drawSelectionRectangle(this.mouse.startPoint, this.mouse.currentPoint);
      }
    },

    mouseup: ($event: MouseEvent) => {
      this.mouse.endPoint = new Point($event.offsetX, $event.offsetY);
      this.mouse.mouseIsDown = false;
      this.deleteRectangle();
    }

  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    const fakePoint = undefined as unknown as Point;
    this.mouse = {
      startPoint: fakePoint, currentPoint: fakePoint,
      endPoint: fakePoint, mouseIsDown: false
    };

    this.renderer.setStyle(this.svgElRef.nativeElement, 'cursor', 'default');

    this.allListenners.push(
      this.renderer.listen(this.svgElRef.nativeElement,
        'click', this.handlers.click)
    );
    this.allListenners.push(
      this.renderer.listen(this.svgElRef.nativeElement,
        'mousedown', this.handlers.mousedown)
    );
    this.allListenners.push(
      this.renderer.listen(this.svgElRef.nativeElement,
        'mousemove', this.handlers.mousemouve)
    );
    this.allListenners.push(
      this.renderer.listen(this.svgElRef.nativeElement,
        'mouseup', this.handlers.mouseup)
    );
    this.renderer.appendChild(this.svgElRef.nativeElement,
      this.boudingRect.nativeElement);
  }

  private createBoudingRectangle(element: SVGElement): void {
    this.updateSvgOffset();
    const selectionZone = new ZoneSelection(this.svgOffset);
    selectionZone.addElement(element);
    const edgePoints = selectionZone.getPoints();
    this.drawRectangle(edgePoints[0], edgePoints[1]);
  }

  private drawRectangle(p1: Point, p2: Point) {
    const rec = this.boudingRect.nativeElement;
    // const startPoint = new Point(
    //   Math.min(p1.x - this.svgOffset.left, p2.x - this.svgOffset.left),
    //   Math.min(p1.y - this.svgOffset.top, p2.y - this.svgOffset.top)
    // );
    // const endPoint = new Point(
    //   Math.max(p1.x - this.svgOffset.left, p2.x - this.svgOffset.left),
    //   Math.max(p1.y - this.svgOffset.top, p2.y - this.svgOffset.top)
    // );
    const startPoint = new Point(
      Math.min(p1.x, p2.x),
      Math.min(p1.y, p2.y)
    );
    const endPoint = new Point(
      Math.max(p1.x, p2.x),
      Math.max(p1.y, p2.y)
    );
    rec.setAttribute('x', startPoint.x.toString());
    rec.setAttribute('y', startPoint.y.toString());
    rec.setAttribute('width', (endPoint.x - startPoint.x).toString());
    rec.setAttribute('height', (endPoint.y - startPoint.y).toString());
    rec.setAttribute('fill', 'none');
    rec.setAttribute('stroke', 'rgba(128, 128, 128, 0.7)');
    rec.setAttribute('stroke-width', '5');
    rec.setAttribute('stroke-dasharray', '10 5');
  }

  private drawSelectionRectangle(p1: Point, p2: Point) {
    const rec = this.boudingRect.nativeElement;
    const startPoint = new Point(
      Math.min(p1.x - this.svgOffset.left, p2.x - this.svgOffset.left),
      Math.min(p1.y - this.svgOffset.top, p2.y - this.svgOffset.top)
    );
    const endPoint = new Point(
      Math.max(p1.x - this.svgOffset.left, p2.x - this.svgOffset.left),
      Math.max(p1.y - this.svgOffset.top, p2.y - this.svgOffset.top)
    );
    rec.setAttribute('x', startPoint.x.toString());
    rec.setAttribute('y', startPoint.y.toString());
    rec.setAttribute('width', (endPoint.x - startPoint.x).toString());
    rec.setAttribute('height', (endPoint.y - startPoint.y).toString());
    rec.setAttribute('fill', 'none');
    rec.setAttribute('stroke', 'rgba(128, 128, 128, 0.7)');
    rec.setAttribute('stroke-width', '5');
    rec.setAttribute('stroke-dasharray', '10 5');
  }

  private deleteRectangle(): void {
    this.boudingRect.nativeElement.setAttribute('width', '0');
    this.boudingRect.nativeElement.setAttribute('height', '0');
  }

  updateSvgOffset() {
    const svgBoundingRect = this.svgElRef.nativeElement.getBoundingClientRect();
    this.svgOffset = {
      top : svgBoundingRect.top,
      left: svgBoundingRect.left
    }
  }

  ngOnDestroy() {
    this.allListenners.forEach(end => {
      end();
    });
    this.renderer.removeChild(this.svgElRef.nativeElement,
      this.boudingRect.nativeElement);
  }

}

interface MouseTracking {
  startPoint: Point,
  currentPoint: Point,
  endPoint: Point,
  mouseIsDown: boolean
}
