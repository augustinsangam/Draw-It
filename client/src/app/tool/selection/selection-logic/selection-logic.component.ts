import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { SvgService } from 'src/app/svg/svg.service';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { MultipleSelection } from '../MultipleSelection';
import { Offset } from '../Offset';
import { Point } from '../Point';
import { SingleSelection } from '../SingleSelection';
import { ElementSelectedType } from './ElementSelectedType';
import { MouseTracking } from './MouseTracking';

@Component({
  selector: 'app-selection-logic',
  template: '',
  styleUrls: ['./selection-logic.component.scss']
})
export class SelectionLogicComponent
  extends ToolLogicDirective implements OnDestroy {

  private rectangle: ElementRef<SVGElement>;
  private circles: ElementRef<SVGElement>[];
  private allListenners: (() => void)[];
  private allSubscriptions: Subscription[];
  private selectedElements: Set<SVGElement>;
  private mouse: MouseTracking;

  constructor(private renderer: Renderer2, private svgService: SvgService) {
    super();
    this.rectangle = new ElementRef(
      this.renderer.createElement('rect', this.svgNS)
    );
    this.allListenners = [];
    this.allSubscriptions = [];
    this.selectedElements = new Set();
  }

  private handlers = {
    click: ($event: MouseEvent) => {
      const type = this.elementSelectedType($event.target as SVGElement);
      if (type === ElementSelectedType.DRAW_ELEMENT
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
      this.mouse.selectedElement = this.elementSelectedType(
                                $event.target as SVGElement);
    },

    mousemouve: ($event: MouseEvent) => {
      if (this.mouse.mouseIsDown) {
        this.mouse.currentPoint = new Point($event.offsetX, $event.offsetY);
        this.drawRectangle(this.mouse.startPoint, this.mouse.currentPoint);

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
      endPoint: fakePoint, mouseIsDown: false,
      selectedElement: ElementSelectedType.NOTHING
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
      this.rectangle.nativeElement);

    const subscription = this.svgService.selectAllElements.subscribe(() => {
      const [startPoint, endPoint] = this.orderPoint(
        new Point(0, 0),
        new Point(this.svgService.instance.nativeElement.scrollWidth,
          this.svgService.instance.nativeElement.scrollHeight)
      );
      this.applyMultipleSelection(startPoint, endPoint);
    });
    this.allSubscriptions.push(subscription);
    this.circles = [];
    [0, 1, 2, 3].forEach((index) => {
      const circle = this.renderer.createElement('circle', this.svgNS);
      if (index % 2 === 0) {
        this.renderer.setStyle(circle, 'cursor', 'col-resize');
      } else {
        this.renderer.setStyle(circle, 'cursor', 'ns-resize');
      }
      this.circles.push(new ElementRef(circle));
      this.renderer.appendChild(this.svgElRef.nativeElement, circle);
    });
  }

  private createBoudingRectangle(element: SVGElement): void {
    this.selectedElements.clear();
    this.selectedElements.add(element);
    console.log(this.selectedElements);
    const edgePoints = new SingleSelection(element, this.getSvgOffset())
      .getPoints();
    this.drawRectangle(edgePoints[0], edgePoints[1]);
    this.drawCircles(edgePoints[0], edgePoints[1]);
  }

  private applyMultipleSelection(startPoint: Point, endPoint: Point) {
    let allSvgElements = Array.from(
      this.svgElRef.nativeElement.children
    );
    // On enlève le rectangle et les 4 points
    allSvgElements = allSvgElements.slice(0, -5);
    this.renderer.appendChild(this.svgElRef.nativeElement,
      this.rectangle.nativeElement);
    const multipleSelection = new MultipleSelection(
      allSvgElements as SVGElement[],
      startPoint, endPoint,
      this.getSvgOffset(),
      (this.svgElRef.nativeElement as SVGSVGElement).createSVGPoint());
    const selection = multipleSelection.getSelection();
    this.selectedElements = selection.selectedElements;
    console.log(this.selectedElements);
    if (!selection.empty) {
      this.drawRectangle(selection.points[0], selection.points[1]);
      this.drawCircles(selection.points[0], selection.points[1]);
    }
  }

  private orderPoint(p1: Point, p2: Point): [Point, Point] {
    return [
      new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
      new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y))
    ];
  }

  private drawRectangle(p1: Point, p2: Point) {
    const rec = this.rectangle.nativeElement;
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

  drawCircles(p1: Point, p2: Point): void {
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    const centerPoint = new Point(
      (startPoint.x + endPoint.x) / 2,
      (startPoint.y + endPoint.y) / 2);
    this.setCircle(new Point(startPoint.x, centerPoint.y),
      this.circles[0].nativeElement, '8', 'rgba(128, 128, 255, 1)');
    this.setCircle(new Point(centerPoint.x, startPoint.y),
      this.circles[1].nativeElement, '8', 'rgba(128, 128, 255, 1)');
    this.setCircle(new Point(endPoint.x, centerPoint.y),
      this.circles[2].nativeElement, '8', 'rgba(128, 128, 255, 1)');
    this.setCircle(new Point(centerPoint.x, endPoint.y),
      this.circles[3].nativeElement, '8', 'rgba(128, 128, 255, 1)');
  }

  setCircle(center: Point, circle: SVGElement,
            radius: string, color: string) {
    this.renderer.setAttribute(circle, 'cx'   , center.x.toString());
    this.renderer.setAttribute(circle, 'cy'   , center.y.toString());
    this.renderer.setAttribute(circle, 'r'    , radius);
    this.renderer.setAttribute(circle, 'fill' , color);
  }

  private deleteRectangle(): void {
    this.rectangle.nativeElement.setAttribute('width', '0');
    this.rectangle.nativeElement.setAttribute('height', '0');
    this.circles.forEach(element => {
      this.setCircle(new Point(0, 0),
      element.nativeElement, '0', 'rgba(255, 255, 255, 0.0)');
    });
    this.selectedElements.clear();
  }

  getSvgOffset(): Offset {
    const svgBoundingRect = this.svgElRef.nativeElement.getBoundingClientRect();
    return {
      top: svgBoundingRect.top,
      left: svgBoundingRect.left
    };
  }

  private elementSelectedType(element: SVGElement): ElementSelectedType {
    switch (element) {
      case this.circles[0].nativeElement:
        return ElementSelectedType.LEFT_CIRCLE;
      case this.circles[1].nativeElement:
        return ElementSelectedType.TOP_CIRCLE;
      case this.circles[2].nativeElement:
        return ElementSelectedType.RIGHT_CIRCLE;
      case this.circles[3].nativeElement:
        return ElementSelectedType.BOTTOM_CIRCLE;
      case this.svgElRef.nativeElement:
        return ElementSelectedType.NOTHING;
      case this.rectangle.nativeElement:
        return ElementSelectedType.SELECTION_RECTANGLE;
      default:
        return ElementSelectedType.DRAW_ELEMENT;
    }
  }

  ngOnDestroy() {
    this.allListenners.forEach(end => end());
    this.allSubscriptions.forEach(sub => sub.unsubscribe());
    this.renderer.removeChild(this.svgElRef.nativeElement,
      this.rectangle.nativeElement);
  }

}
