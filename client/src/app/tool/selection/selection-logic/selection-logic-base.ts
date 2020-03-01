import { OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';
import { MathService } from '../../mathematics/tool.math-service.service';
import {
  BackGroundProperties, StrokeProperties
} from '../../shape/common/abstract-shape';
import { Circle } from '../../shape/common/circle';
import { Rectangle } from '../../shape/common/rectangle';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { MultipleSelection } from '../multiple-selection';
import { Offset } from '../offset';
import { Point } from '../point';
import { SelectionReturn } from '../selection-return';
import { SingleSelection } from '../single-selection';
import { BasicSelectionType, ElementSelectedType } from './element-selected-type';
import * as Util from './selection-logic-util';

export abstract class SelectionLogicBase extends ToolLogicDirective
  implements OnInit, OnDestroy {

  protected circles: SVGElement[];
  protected allListenners: (() => void)[];
  protected selectedElements: Set<SVGElement>;
  protected selectedElementsFreezed: Set<SVGElement>;
  protected mouse: Util.Mouse;
  protected rectangles: Util.SelectionRectangles;
  protected keyManager: Util.KeyManager;

  constructor(protected renderer: Renderer2, protected svgService: SvgService,
              protected undoRedoService: UndoRedoService) {
    super();
    this.allListenners = [];
    this.selectedElements = new Set();
    this.undoRedoService.setPostUndoAction({
      functionDefined: true,
      function: () => {
        this.deleteVisualisation();
      }
    });
  }

  ngOnInit(): void {
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
    this.deleteVisualisation();
    this.selectedElements = new Set([element]);
    const points = new SingleSelection(element, this.getSvgOffset()).points();
    this.drawVisualisation(points[0], points[1]);
  }

  protected applySingleInversion(element: SVGElement): void {
    this.applyInversion(new Set([element]));
  }

  protected applyMultipleInversion(startPoint: Point, endPoint: Point): void {
    const inversion = this.getMultipleSelection(startPoint, endPoint);
    this.applyInversion(inversion.selectedElements);
  }

  protected applyMultipleSelection(startPoint?: Point, endPoint?: Point,
                                   elements?: Set<SVGElement>): void {
    this.deleteVisualisation();
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
      Util.COLORS.BLUE, false);
  }

  private drawVisualisation(p1: Point, p2: Point): void {
    this.drawARectangle(this.rectangles.visualisation, p1, p2,
      Util.COLORS.GREEN, true);
    this.drawCircles(p1, p2);
  }

  protected drawInversion(p1: Point, p2: Point): void {
    this.drawARectangle(this.rectangles.inversion, p1, p2,
      Util.COLORS.RED, true);
  }

  private drawARectangle(element: SVGElement, p1: Point, p2: Point,
                         color: string, dasharray: boolean = false): void {
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    const rectangleObject =
      new Rectangle(this.renderer, element, new MathService());
    rectangleObject.setParameters(BackGroundProperties.None,
      StrokeProperties.Filled);
    rectangleObject.dragRectangle(startPoint, endPoint);
    rectangleObject.setCss({
      strokeWidth: Util.RECTANGLE_STROKE,
      strokeColor: color,
      fillColor: 'none',
      opacity: '0'
    });
    if (dasharray) {
      element.setAttribute('stroke-dasharray', Util.DASH_ARRAY);
    }
  }

  protected drawCircles(p1: Point, p2: Point): void {
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    const centerPoint = new Point(
      (startPoint.x + endPoint.x) / 2,
      (startPoint.y + endPoint.y) / 2);
    this.setCircle(new Point(startPoint.x, centerPoint.y),
    this.circles[Util.CircleType.LEFT_CIRCLE], Util.CIRCLE_RADIUS);
    this.setCircle(new Point(centerPoint.x, startPoint.y),
    this.circles[Util.CircleType.TOP_CIRCLE], Util.CIRCLE_RADIUS);
    this.setCircle(new Point(endPoint.x, centerPoint.y),
      this.circles[Util.CircleType.RIGHT_CIRCLE], Util.CIRCLE_RADIUS);
    this.setCircle(new Point(centerPoint.x, endPoint.y),
    this.circles[Util.CircleType.BOTTOM_CIRCLE], Util.CIRCLE_RADIUS);
  }

  private setCircle(center: Point, circle: SVGElement, radius: string): void {
    // A la construction, tout est fait
    // TODO : Remplacer Elref par un SVGElment
    // tslint:disable-next-line: no-unused-expression
    new Circle(center, this.renderer, circle, radius, Util.COLORS.GRAY);
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

  private resetRectangle(element: SVGElement): void {
    element.setAttribute('width', '0');
    element.setAttribute('height', '0');
  }

  private resetTranslate(element: SVGElement): void {
    element.setAttribute('transform', 'translate(0,0)');
  }

  protected elementSelectedType(element: SVGElement)
    : ElementSelectedType {
    if (element === this.svgStructure.root) {
      return BasicSelectionType.NOTHING;
    }
    if (this.svgStructure.drawZone.contains(element)) {
      return BasicSelectionType.DRAW_ELEMENT;
    }
    const indexOfCircle = this.circles.indexOf(element);
    if (indexOfCircle !== -1) {
      return indexOfCircle as Util.CircleType;
    }
    return BasicSelectionType.NOTHING;
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
    Util.CIRCLES.forEach((index) => {
      const circle = this.renderer.createElement('circle', this.svgNS);
      const resizeType = index % 2 === 0 ? 'col-resize' : 'ns-resize';
      this.renderer.setStyle(circle, 'cursor', resizeType);
      this.circles.push(circle);
      this.renderer.appendChild(this.svgStructure.temporaryZone, circle);
    });
  }

  private initialiseMouse(): void {
    const fakePoint = new Point(0, 0);
    this.mouse = {
      left : {
        startPoint: fakePoint, currentPoint: fakePoint, endPoint: fakePoint,
        mouseIsDown: false, selectedElement: BasicSelectionType.NOTHING,
        onDrag: false
      },
      right: {
          startPoint: fakePoint, currentPoint: fakePoint, endPoint: fakePoint,
          mouseIsDown: false, selectedElement: BasicSelectionType.NOTHING,
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

  private initialiseKeyManager(): void {
    this.keyManager = {
      keyPressed : new Set(),
      lastTimeCheck: new Date().getTime(),
      handlers : {
        keydown: ($event: KeyboardEvent) => {
          if (!this.keyManager.keyPressed.has($event.key)) {
            this.keyManager.keyPressed.add($event.key);
          }
          const actualTime = new Date().getTime();
          if (actualTime - this.keyManager.lastTimeCheck >= Util.TIME_INTERVAL) {
            this.keyManager.lastTimeCheck = actualTime;
            this.handleKey('ArrowUp', 0, -Util.OFFSET_TRANSLATE);
            this.handleKey('ArrowDown', 0, Util.OFFSET_TRANSLATE);
            this.handleKey('ArrowLeft', -Util.OFFSET_TRANSLATE, 0);
            this.handleKey('ArrowRight', Util.OFFSET_TRANSLATE, 0);
          }
        },
        keyup: ($event: KeyboardEvent) => {
          let count = 0;
          const allArrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
          allArrows.forEach((arrow) => {
            if (this.keyManager.keyPressed.has(arrow)) {
              count++;
            }
          });
          this.keyManager.keyPressed.delete($event.key);
          // TODO : Verifier uniquement les touches qui s'appliquent
          if (count === 1 && allArrows.indexOf($event.key) !== -1) {
            this.undoRedoService.saveState();
          }
        }
      }
    };
  }

  private handleKey(key: string, dx: number, dy: number): void {
    if (this.keyManager.keyPressed.has(key)) {
      this.translateAll(dx, dy);
    }
  }

  ngOnDestroy(): void {
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
