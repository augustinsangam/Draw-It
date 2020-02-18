import { ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { MultipleSelection } from '../MultipleSelection';
import { Offset } from '../Offset';
import { Point } from '../Point';
import { SelectionReturn } from '../SelectionReturn';
import { SingleSelection } from '../SingleSelection';
import { ElementSelectedType } from './ElementSelectedType';
import { MouseTracking } from './MouseTracking';

export abstract class SelectionLogicBase
      extends ToolLogicDirective implements OnDestroy {

  protected circles: ElementRef<SVGElement>[];
  protected allListenners: (() => void)[];
  protected selectedElements: Set<SVGElement>;
  protected selectedElementsFreezed: Set<SVGElement>;
  protected mouse: Mouse;
  protected rectangles: SelectionRectangles

  constructor(protected renderer: Renderer2, protected svgService: SvgService) {
    super();
    this.allListenners = [];
    this.selectedElements = new Set();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.initialiseMouse();
    this.initialiseRectangles();
    this.initialiseCircles();
    const subscription = this.svgService.selectAllElements.subscribe(() => {
      const [startPoint, endPoint] = this.orderPoint(new Point(0, 0),
        new Point(this.svgService.instance.nativeElement.clientWidth,
          this.svgService.instance.nativeElement.clientHeight)
      );
      this.applyMultipleSelection(startPoint, endPoint);
    });
    this.allListenners.push(() => subscription.unsubscribe());
    this.renderer.setStyle(this.svgElRef.nativeElement, 'cursor', 'default');
  }

  protected applySingleSelection(element: SVGElement): void {
    this.selectedElements.clear();
    this.selectedElements.add(element);
    const points = new SingleSelection(element, this.getSvgOffset()).points();
    this.drawVisualisation(points[0], points[1]);
    this.drawCircles(points[0], points[1]);
  }

  protected applySingleInversion(element: SVGElement) {
    this.applyInversion(new Set([element]));
  }

  protected applyMultipleInversion(startPoint: Point, endPoint: Point) {
    const inversion = this.getMultipleSelection(startPoint, endPoint);
    this.applyInversion(inversion.selectedElements);
  }

  protected applyMultipleSelection(startPoint: Point, endPoint: Point,
                                   elements?: Set<SVGElement>) {
    const selection = this.getMultipleSelection(startPoint, endPoint, elements);
    this.selectedElements = selection.selectedElements;
    this.drawVisualisation(selection.points[0], selection.points[1]);
    this.drawCircles(selection.points[0], selection.points[1]);
  }

  private getMultipleSelection( startPoint: Point, endPoint: Point,
                                elements?: Set<SVGElement>)
  : SelectionReturn {
    if (elements === undefined) {
      const allElements = Array.from(
        this.svgElRef.nativeElement.children
      ) as SVGElement[];
      // On enlève les trois rectangles et les les 4 points
      elements = new Set<SVGElement>(allElements.slice(0, -7));
    }
    const multipleSelection = new MultipleSelection(
      elements,
      startPoint, endPoint,
      this.getSvgOffset(),
      (this.svgElRef.nativeElement as SVGSVGElement).createSVGPoint());
    return multipleSelection.getSelection();
  }

  private applyInversion( elements: Set<SVGElement>,
                          startPoint?: Point, endPoint?: Point): void {
    const elementsToInvert = new Set<SVGElement>(this.selectedElementsFreezed);
    elements.forEach((element: SVGElement) => {
      if (this.selectedElementsFreezed.has(element)) {
        elementsToInvert.delete(element);
      } else {
        elementsToInvert.add(element);
      }
    });
    if (startPoint === undefined || endPoint === undefined) {
      [startPoint, endPoint] = this.orderPoint(new Point(0, 0),
          new Point(this.svgService.instance.nativeElement.clientWidth,
            this.svgService.instance.nativeElement.clientHeight)
        );
    }
    this.applyMultipleSelection(startPoint, endPoint, elementsToInvert);
  }

  protected orderPoint(p1: Point, p2: Point): [Point, Point] {
    return [
      new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
      new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y))
    ];
  }

  protected drawSelection(p1: Point, p2: Point) {
    this.deleteSelection();
    const rec = this.rectangles.selection.nativeElement;
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    rec.setAttribute('x', startPoint.x.toString());
    rec.setAttribute('y', startPoint.y.toString());
    rec.setAttribute('width', (endPoint.x - startPoint.x).toString());
    rec.setAttribute('height', (endPoint.y - startPoint.y).toString());
    rec.setAttribute('fill', 'none');
    rec.setAttribute('stroke', 'rgba(0, 0, 255, 0.7)');
    rec.setAttribute('stroke-width', '2');
    rec.setAttribute('stroke-dasharray', '10 5');
  }

  private drawVisualisation(p1: Point, p2: Point) {
    this.deleteVisualisation();
    const rec = this.rectangles.visualisation.nativeElement;
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    rec.setAttribute('x', startPoint.x.toString());
    rec.setAttribute('y', startPoint.y.toString());
    rec.setAttribute('width', (endPoint.x - startPoint.x).toString());
    rec.setAttribute('height', (endPoint.y - startPoint.y).toString());
    rec.setAttribute('fill', 'none');
    rec.setAttribute('stroke', 'rgba(0, 255, 0, 0.7)');
    rec.setAttribute('stroke-width', '2');
    rec.setAttribute('stroke-dasharray', '10 5');
  }

  protected drawInversion(p1: Point, p2: Point) {
    this.deleteInversion();
    const rec = this.rectangles.inversion.nativeElement;
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    rec.setAttribute('x', startPoint.x.toString());
    rec.setAttribute('y', startPoint.y.toString());
    rec.setAttribute('width', (endPoint.x - startPoint.x).toString());
    rec.setAttribute('height', (endPoint.y - startPoint.y).toString());
    rec.setAttribute('fill', 'none');
    rec.setAttribute('stroke', 'rgba(255, 0, 0, 0.7)');
    rec.setAttribute('stroke-width', '2');
    rec.setAttribute('stroke-dasharray', '10 5');
  }

  protected drawCircles(p1: Point, p2: Point): void {
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

  private setCircle(center: Point, circle: SVGElement,
                    radius: string, color: string): void {
    this.renderer.setAttribute(circle, 'cx'   , center.x.toString());
    this.renderer.setAttribute(circle, 'cy'   , center.y.toString());
    this.renderer.setAttribute(circle, 'r'    , radius);
    this.renderer.setAttribute(circle, 'fill' , color);
  }

  protected deleteVisualisation(): void {
    this.rectangles.visualisation.nativeElement.setAttribute('width', '0');
    this.rectangles.visualisation.nativeElement.setAttribute('height', '0');
    this.rectangles.visualisation.nativeElement.setAttribute( 'transform',
                                                          'translate(0,0)');
    this.circles.forEach(element => {
      this.setCircle(new Point(0, 0),
      element.nativeElement, '0', 'rgba(255, 255, 255, 0.0)');
      element.nativeElement.setAttribute('transform', 'translate(0,0)');
    });
  }

  protected deleteSelection(): void {
    this.rectangles.selection.nativeElement.setAttribute('width', '0');
    this.rectangles.selection.nativeElement.setAttribute('height', '0');
    this.rectangles.selection.nativeElement.setAttribute( 'transform',
                                                          'translate(0,0)');
  }

  protected deleteInversion(): void {
    this.rectangles.inversion.nativeElement.setAttribute('width', '0');
    this.rectangles.inversion.nativeElement.setAttribute('height', '0');
    this.rectangles.inversion.nativeElement.setAttribute( 'transform',
                                                          'translate(0,0)');
  }

  protected elementSelectedType(element: SVGElement)
    : ElementSelectedType {
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
      case this.rectangles.selection.nativeElement:
        return ElementSelectedType.SELECTION_RECTANGLE;
      case this.rectangles.selection.nativeElement:
        return ElementSelectedType.INVERSION_RECTANGLE;
      case this.rectangles.visualisation.nativeElement:
        return ElementSelectedType.VISUALISATION_RECTANGLE;
      default:
        return ElementSelectedType.DRAW_ELEMENT;
    }
  }

  protected isInTheSelectionZone(x: number, y: number)
  : boolean {
    const point = this.svgElRef.nativeElement.createSVGPoint();
    const [dx, dy] =
      this.getTransformTranslate(this.rectangles.visualisation.nativeElement);
    [point.x, point.y] = [x - dx, y - dy];
    return (this.rectangles.visualisation.nativeElement as SVGGeometryElement)
          .isPointInFill(point);
  }

  translateAll(x: number, y: number) {
    this.selectedElements.forEach(element => {
      this.translate(element, x, y);
    });
    this.translate(this.rectangles.visualisation.nativeElement, x, y);
    this.circles.forEach(
      (circle) => this.translate(circle.nativeElement, x, y)
    );
  }

  translate(element: SVGElement, x: number, y: number): void {
    let [dx, dy] = this.getTransformTranslate(element);
    [dx, dy] = [x + dx, y + dy];
    element.setAttribute('transform', `translate(${dx},${dy})`);
  }

  private getTransformTranslate(element: SVGElement): [number, number] {
    const transform = element.getAttribute('transform') as string;
    const result  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform);
    return (result !== null) ?
      [parseInt(result[1], 10), parseInt(result[2], 10)] : [0, 0];
  }

  getSvgOffset(): Offset {
    const svgBoundingRect = this.svgElRef.nativeElement.getBoundingClientRect();
    return { top: svgBoundingRect.top, left: svgBoundingRect.left };
  }

  setEquals(set1: Set<SVGElement>, set2: Set<SVGElement>): boolean {
    if (set1.size !== set2.size) {
      return false;
    }
    for (const entry of set1) {
      if (!set2.has(entry)) {
        return false;
      }
    }
    return true;
  }

  private initialiseCircles() {
    this.circles = [];
    [0, 1, 2, 3].forEach((index) => {
      const circle = this.renderer.createElement('circle', this.svgNS);
      const resizeType = index % 2 === 0 ? 'col-resize' : 'ns-resize';
      this.renderer.setStyle(circle, 'cursor', resizeType);
      this.circles.push(new ElementRef(circle));
      this.renderer.appendChild(this.svgElRef.nativeElement, circle);
    });
  }

  private initialiseMouse(): void {
    const fakePoint = new Point(0, 0);
    this.mouse = {
      left : {
        startPoint: fakePoint, currentPoint: fakePoint, endPoint: fakePoint,
        mouseIsDown: false, selectedElement: ElementSelectedType.NOTHING,
        onDrag: false
      },
      right: {
          startPoint: fakePoint, currentPoint: fakePoint, endPoint: fakePoint,
          mouseIsDown: false, selectedElement: ElementSelectedType.NOTHING,
          onDrag: false
      }
    };
  }

  private initialiseRectangles(): void {
    this.rectangles = {
      selection:
        new ElementRef(this.renderer.createElement('rect', this.svgNS)),
      inversion:
        new ElementRef(this.renderer.createElement('rect', this.svgNS)),
      visualisation:
        new ElementRef(this.renderer.createElement('rect', this.svgNS))
    };
    [this.rectangles.selection, this.rectangles.inversion,
      this.rectangles.visualisation].forEach((elRef: ElementRef) => {
        this.renderer.appendChild(this.svgElRef.nativeElement,
          elRef.nativeElement);
      });
  }

  ngOnDestroy() {
    this.allListenners.forEach(end => end());
    this.renderer.removeChild(this.svgElRef.nativeElement,
      this.rectangles.selection.nativeElement);
    this.renderer.removeChild(this.svgElRef.nativeElement,
        this.rectangles.inversion.nativeElement);
    this.renderer.removeChild(this.svgElRef.nativeElement,
        this.rectangles.visualisation.nativeElement);
    this.circles.forEach((circle) => this.renderer.removeChild(
      this.svgElRef.nativeElement, circle.nativeElement)
    );
  }

}

export type MouseEventCallBack = ($event: MouseEvent) => void;

interface Mouse {
  left: MouseTracking,
  right: MouseTracking
}

interface SelectionRectangles {
  selection: ElementRef<SVGElement>,
  inversion: ElementRef<SVGElement>,
  visualisation: ElementRef<SVGElement>
}
