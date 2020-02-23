import { OnDestroy, Renderer2 } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';
import { MathService } from '../../mathematics/tool.math-service.service';
import {
  BackGroundProperties,
  StrokeProperties
} from '../../shape/common/AbstractShape';
import { Circle } from '../../shape/common/Circle';
import { Rectangle } from '../../shape/common/Rectangle';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { MultipleSelection } from '../MultipleSelection';
import { Offset } from '../Offset';
import { Point } from '../Point';
import { SelectionReturn } from '../SelectionReturn';
import { SingleSelection } from '../SingleSelection';
import { ElementSelectedType } from './ElementSelectedType';
import { MouseTracking } from './MouseTracking';

const COLORS = {
  RED : 'rgba(255, 0, 0, 0.7)',
  BLUE: 'rgba(0, 0, 255, 0.7)',
  GREEN: 'rgba(0, 255, 0, 0.7)',
  GRAY: 'rgba(128, 128, 255, 1)'
}
const RECTANGLE_STROKE = '2';
const CIRCLE_RADIUS = '8';
const TIME_INTERVAL = 100;
const DASH_ARRAY = '10 5';
const OFFSET_TRANSLATE = 3;

export abstract class SelectionLogicBase
      extends ToolLogicDirective implements OnDestroy {

  protected circles: SVGElement[];
  protected allListenners: (() => void)[];
  protected selectedElements: Set<SVGElement>;
  protected selectedElementsFreezed: Set<SVGElement>;
  protected mouse: Mouse;
  protected rectangles: SelectionRectangles
  protected keyManager: {
    keyPressed: Set<string>,
    lastTimeCheck: number,
    handlers: {
      mousedown: KeyboardPressCallback,
      mouseup: KeyboardPressCallback
    }
  }

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
      this.applyMultipleSelection();
    });
    this.allListenners.push(() => subscription.unsubscribe());
    this.initialiseKeyManager();
    this.svgStructure.root.style.cursor = 'default';
  }

  protected applySingleSelection(element: SVGElement): void {
    this.selectedElements = new Set([element]);
    const points = new SingleSelection(element, this.getSvgOffset()).points();
    this.drawVisualisation(points[0], points[1]);
  }

  protected applySingleInversion(element: SVGElement) {
    this.applyInversion(new Set([element]));
  }

  protected applyMultipleInversion(startPoint: Point, endPoint: Point) {
    const inversion = this.getMultipleSelection(startPoint, endPoint);
    this.applyInversion(inversion.selectedElements);
  }

  protected applyMultipleSelection(startPoint?: Point, endPoint?: Point,
                                   elements?: Set<SVGElement>): void {
    const selection = this.getMultipleSelection(startPoint, endPoint, elements);
    this.selectedElements = selection.selectedElements;
    this.drawVisualisation(selection.points[0], selection.points[1]);
  }

  private getMultipleSelection( startPoint?: Point, endPoint?: Point,
                                elements?: Set<SVGElement>)
  : SelectionReturn {
    if (elements === undefined) {
      const allElements = Array.from(
        this.svgStructure.drawZone.children
      ) as SVGElement[];
      elements = new Set<SVGElement>(allElements);
    }
    const multipleSelection = new MultipleSelection(
      elements, this.getSvgOffset(), this.svgStructure.root.createSVGPoint(),
      startPoint, endPoint
    );
    return multipleSelection.getSelection();
  }

  private applyInversion(elements: Set<SVGElement>,
                         startPoint?: Point, endPoint?: Point): void {
    const elementsToInvert = new Set<SVGElement>(this.selectedElementsFreezed);
    elements.forEach((element: SVGElement) => {
      if (this.selectedElementsFreezed.has(element)) {
        elementsToInvert.delete(element);
      } else {
        elementsToInvert.add(element);
      }
    });
    this.applyMultipleSelection(startPoint, endPoint, elementsToInvert);
  }

  protected orderPoint(p1: Point, p2: Point): [Point, Point] {
    return [
      new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
      new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y))
    ];
  }

  protected drawSelection(p1: Point, p2: Point): void {
    this.drawARectangle(this.rectangles.selection, p1, p2,
      COLORS.BLUE, false);
  }

  private drawVisualisation(p1: Point, p2: Point): void {
    this.drawARectangle(this.rectangles.visualisation, p1, p2,
      COLORS.GREEN, true);
    this.drawCircles(p1, p2);
  }

  protected drawInversion(p1: Point, p2: Point): void {
    this.drawARectangle(this.rectangles.inversion, p1, p2,
      COLORS.RED, true);
  }

  private drawARectangle(element: SVGElement, p1: Point, p2: Point,
                         color: string, dasharray: boolean = false): void {
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    const rectangleObject =
      new Rectangle(this.renderer, element, new MathService());
    rectangleObject.setParameters(BackGroundProperties.None,
      StrokeProperties.Filled);
    rectangleObject.dragRectangle(startPoint, endPoint);
    rectangleObject.setCss({strokeWidth: RECTANGLE_STROKE,
      strokeColor: color,
      fillColor: 'none',
      opacity: '0'
    });
    if (dasharray) {
      element.setAttribute('stroke-dasharray', DASH_ARRAY);
    }
  }

  protected drawCircles(p1: Point, p2: Point): void {
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    const centerPoint = new Point(
      (startPoint.x + endPoint.x) / 2,
      (startPoint.y + endPoint.y) / 2);
    this.setCircle(new Point(startPoint.x, centerPoint.y),
    this.circles[0], CIRCLE_RADIUS);
    this.setCircle(new Point(centerPoint.x, startPoint.y),
    this.circles[1], CIRCLE_RADIUS);
    this.setCircle(new Point(endPoint.x, centerPoint.y),
      this.circles[2], CIRCLE_RADIUS);
    this.setCircle(new Point(centerPoint.x, endPoint.y),
    this.circles[3], CIRCLE_RADIUS);
  }

  private setCircle(center: Point, circle: SVGElement, radius: string): void {
    // A la construction, tout est fait
    // TODO : Remplacer Elref par un SVGElment
    // tslint:disable-next-line: no-unused-expression
    new Circle(center, this.renderer, circle, radius, COLORS.GRAY);
  }

  protected deleteVisualisation(): void {
    this.resetRectangle(this.rectangles.visualisation);
    this.resetTranslate(this.rectangles.visualisation);
    this.deleteCircles();
    this.selectedElements.clear();
  }

  private deleteCircles(): void {
    this.circles.forEach(element => {
      this.renderer.setAttribute(element, 'r', '0');
      this.resetTranslate(element);
    });
  }

  protected deleteSelection(): void {
    this.resetRectangle(this.rectangles.selection);
    this.resetTranslate(this.rectangles.selection);
  }

  protected deleteInversion(): void {
    this.resetRectangle(this.rectangles.inversion);
    this.resetTranslate(this.rectangles.inversion);
  }

  private resetRectangle(element: SVGElement) {
    element.setAttribute('width', '0');
    element.setAttribute('height', '0');
  }

  private resetTranslate(element: SVGElement) {
    element.setAttribute('transform', 'translate(0,0)');
  }

  protected elementSelectedType(element: SVGElement)
    : ElementSelectedType {
    switch (element) {
      case this.circles[0]:
        return ElementSelectedType.LEFT_CIRCLE;
      case this.circles[1]:
        return ElementSelectedType.TOP_CIRCLE;
      case this.circles[2]:
        return ElementSelectedType.RIGHT_CIRCLE;
      case this.circles[3]:
        return ElementSelectedType.BOTTOM_CIRCLE;
      case this.svgStructure.root:
        return ElementSelectedType.NOTHING;
      case this.rectangles.selection:
        return ElementSelectedType.SELECTION_RECTANGLE;
      case this.rectangles.selection:
        return ElementSelectedType.INVERSION_RECTANGLE;
      case this.rectangles.visualisation:
        return ElementSelectedType.VISUALISATION_RECTANGLE;
      default:
        return ElementSelectedType.DRAW_ELEMENT;
    }
  }

  protected isInTheSelectionZone(x: number, y: number)
  : boolean {
    const point = this.svgStructure.root.createSVGPoint();
    const [dx, dy] =
      this.getTransformTranslate(this.rectangles.visualisation);
    [point.x, point.y] = [x - dx, y - dy];
    return (this.rectangles.visualisation as SVGGeometryElement)
          .isPointInFill(point);
  }

  translateAll(x: number, y: number): void {
    this.selectedElements.forEach(element => {
      this.translate(element, x, y);
    });
    this.translate(this.rectangles.visualisation, x, y);
    this.circles.forEach((circle) => this.translate(circle, x, y));
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
    const svgBoundingRect = this.svgStructure.root.getBoundingClientRect();
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

  private initialiseCircles(): void {
    this.circles = [];
    [0, 1, 2, 3].forEach((index) => {
      const circle = this.renderer.createElement('circle', this.svgNS);
      const resizeType = index % 2 === 0 ? 'col-resize' : 'ns-resize';
      this.renderer.setStyle(circle, 'cursor', resizeType);
      this.circles.push(circle);
      this.renderer.appendChild(this.svgStructure.temporaryZone, circle);
    });
  }

  private initialiseMouse(): void {
    const fakePoint = new Point(-50, 50);
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
      selection: this.renderer.createElement('rect', this.svgNS),
      inversion: this.renderer.createElement('rect', this.svgNS),
      visualisation: this.renderer.createElement('rect', this.svgNS)
    };
    [this.rectangles.selection, this.rectangles.inversion,
      this.rectangles.visualisation].forEach((rectangle) => {
        this.renderer.appendChild(this.svgStructure.temporaryZone, rectangle);
    });
  }

  private initialiseKeyManager() {
    this.keyManager = {
      keyPressed : new Set(),
      lastTimeCheck: new Date().getTime(),
      handlers : {
        mousedown: ($event: KeyboardEvent) => {
          if (!this.keyManager.keyPressed.has($event.key)) {
            this.keyManager.keyPressed.add($event.key);
          }
          const actualTime = new Date().getTime();
          if (actualTime - this.keyManager.lastTimeCheck >= TIME_INTERVAL) {
            this.keyManager.lastTimeCheck = actualTime;
            this.handleKey('ArrowUp', 0, -OFFSET_TRANSLATE);
            this.handleKey('ArrowDown', 0, OFFSET_TRANSLATE);
            this.handleKey('ArrowLeft', -OFFSET_TRANSLATE, 0);
            this.handleKey('ArrowRight', OFFSET_TRANSLATE, 0);
          }
        },
        mouseup: ($event: KeyboardEvent) => {
          this.keyManager.keyPressed.delete($event.key);
        }
      }
    }
  }

  private handleKey(key: string, dx: number, dy: number) {
    if (this.keyManager.keyPressed.has(key)) {
      this.translateAll(dx, dy);
    }
  }

  ngOnDestroy() {
    this.allListenners.forEach(end => end());
    [this.rectangles.selection, this.rectangles.inversion,
    this.rectangles.visualisation].forEach((element: SVGElement) => {
      this.renderer.removeChild(this.svgStructure.temporaryZone, element);
    });
    this.circles.forEach((circle) => this.renderer.removeChild(
      this.svgStructure.temporaryZone, circle)
    );
  }

}

export type MouseEventCallBack = ($event: MouseEvent) => void;

type KeyboardPressCallback = ($event: KeyboardEvent) => void;

interface Mouse {
  left: MouseTracking,
  right: MouseTracking
}

interface SelectionRectangles {
  selection: SVGElement,
  inversion: SVGElement,
  visualisation: SVGElement
}
