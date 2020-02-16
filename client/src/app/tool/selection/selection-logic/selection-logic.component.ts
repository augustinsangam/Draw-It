import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { MultipleSelection } from '../MultipleSelection';
import { Offset } from '../Offset';
import { Point } from '../Point';
import { SingleSelection } from '../SingleSelection';

@Component({
  selector: 'app-selection-logic',
  template: '',
  styleUrls: ['./selection-logic.component.scss']
})
export class SelectionLogicComponent
  extends ToolLogicDirective implements OnDestroy {

  private boudingRect: ElementRef<SVGElement>;
  private allListenners: (() => void)[];
  // private selectedElements: SVGElement[];
  private mouse: MouseTracking;

  constructor(private renderer: Renderer2) {
    super();
    this.boudingRect = new ElementRef(
      this.renderer.createElement('rect', this.svgNS)
    );
    this.allListenners = [];
    // this.selectedElements = [];
  }

  private handlers = {
    click: ($event: MouseEvent) => {
      if ($event.target !== this.svgElRef.nativeElement
        && this.mouse.startPoint.equals(this.mouse.endPoint)) {
        this.createBoudingRectangle($event.target as SVGElement);
      } else {
        this.deleteRectangle();
        if (!this.mouse.startPoint.equals(this.mouse.endPoint)) {
          const [startPoint, endPoint] = this.orderPoint(
            this.mouse.startPoint, this.mouse.endPoint
          );
          this.applyMultipleSelection(startPoint, endPoint);
        }
      }
    },

    mousedown: ($event: MouseEvent) => {
      this.mouse.startPoint = new Point($event.offsetX, $event.offsetY);
      this.mouse.mouseIsDown = true;
    },

    mousemouve: ($event: MouseEvent) => {
      if (this.mouse.mouseIsDown) {
        this.mouse.currentPoint = new Point($event.offsetX, $event.offsetY);
        this.drawRectangle(
          this.mouse.startPoint, this.mouse.currentPoint);
      }
    },

    mouseup: ($event: MouseEvent) => {
      this.mouse.endPoint = new Point($event.offsetX, $event.offsetY);
      this.mouse.mouseIsDown = false;
    }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    const fakePoint = new Point(0, 0);
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
    // this.selectedElements = [element];
    const edgePoints = new SingleSelection(element, this.getSvgOffset())
                                              .getPoints();
    this.drawRectangle(edgePoints[0], edgePoints[1]);
  }

  private applyMultipleSelection(startPoint: Point, endPoint: Point) {
    const allSvgElements = Array.from(
      this.svgElRef.nativeElement.children
    );
    allSvgElements.pop();
    this.renderer.appendChild(this.svgElRef.nativeElement,
      this.boudingRect.nativeElement);
    const multipleSelection = new MultipleSelection(
      allSvgElements as SVGElement[],
      startPoint, endPoint,
      this.getSvgOffset(),
      (this.svgElRef.nativeElement as SVGSVGElement).createSVGPoint());
    const selection = multipleSelection.getSelection();
    // this.selectedElements = selection.selectedElements;
    if (!selection.empty) {
      this.drawRectangle(selection.points[0], selection.points[1]);
    }
  }

  private orderPoint(p1: Point, p2: Point): [Point, Point] {
    return [
      new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
      new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y))
    ];
  }

  private drawRectangle(p1: Point, p2: Point) {
    const rec = this.boudingRect.nativeElement;
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
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

  getSvgOffset(): Offset {
    const svgBoundingRect = this.svgElRef.nativeElement.getBoundingClientRect();
    return {
      top : svgBoundingRect.top,
      left: svgBoundingRect.left
    };
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
