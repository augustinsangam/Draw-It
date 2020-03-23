import { OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';
import { MathService } from '../../mathematics/tool.math-service.service';
import { BackGroundProperties, StrokeProperties } from '../../shape/common/abstract-shape';
import { Circle } from '../../shape/common/circle';
import { Point } from '../../shape/common/point';
import { Rectangle } from '../../shape/common/rectangle';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { PostAction, UndoRedoService } from '../../undo-redo/undo-redo.service';
import { MultipleSelection } from '../multiple-selection';
import { Offset } from '../offset';
import { SelectionReturn } from '../selection-return';
import { SelectionService } from '../selection.service';
import { SingleSelection } from '../single-selection';
import { BasicSelectionType, ElementSelectedType } from './element-selected-type';
import * as Util from './selection-logic-util';
import { Transform } from './transform';

enum Arrow {
  Up = 'ArrowUp',
  Down = 'ArrowDown',
  Left = 'ArrowLeft',
  Right = 'ArrowRight'
}

const NOT_FOUND = -1;

export abstract class SelectionLogicBase extends ToolLogicDirective
  implements OnInit, OnDestroy {

  protected circles: SVGElement[];
  protected allListenners: (() => void)[];
  protected selectedElementsFreezed: Set<SVGElement>;
  protected mouse: Util.Mouse;
  protected rectangles: Util.SelectionRectangles;
  protected keyManager: Util.KeyManager;

  constructor(protected renderer: Renderer2, protected svgService: SvgService,
              protected undoRedoService: UndoRedoService,
              protected service: SelectionService) {
    super();
    this.allListenners = [];
    const action: PostAction = {
      functionDefined: true,
      function: () => {
        this.deleteVisualisation();
      }
    };
    this.undoRedoService.setPostUndoAction(action);
    this.undoRedoService.setPostRedoAction(action);
  }

  ngOnInit(): void {
    this.mouse = Util.SelectionLogicUtil.initialiseMouse();
    this.rectangles = Util.SelectionLogicUtil.initialiseRectangles(
      this.renderer, this.svgStructure.temporaryZone, this.svgNS);
    this.circles = Util.SelectionLogicUtil.initialiseCircles(
      this.renderer, this.svgStructure.temporaryZone, this.svgNS
    );
    const subscription = this.service.selectAllElements.subscribe(() => {
      this.applyMultipleSelection();
    });
    this.allListenners.push(() => subscription.unsubscribe());
    this.initialiseKeyManager();
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'default');
  }

  protected applySingleSelection(element: SVGElement): void {
    this.deleteVisualisation();
    this.service.selectedElements = new Set([element]);
    const points = new SingleSelection(element, this.getSvgOffset()).points();
    this.drawVisualisation(points[0], points[1]);
  }

  protected applySingleInversion(element: SVGElement): void {
    this.applyInversion(new Set([element]));
  }

  protected applyMultipleInversion(startPoint: Point, endPoint: Point): void {
    const inversion = this.getMultipleSelection(startPoint, endPoint);
    if (!inversion.empty) {
      this.applyInversion(inversion.selectedElements);
    }
  }

  protected applyMultipleSelection(startPoint?: Point, endPoint?: Point,
                                   elements?: Set<SVGElement>): void {
    this.deleteVisualisation();
    const selection = this.getMultipleSelection(startPoint, endPoint, elements);
    this.service.selectedElements = selection.selectedElements;
    if (!selection.empty) {
      this.drawVisualisation(selection.points[0], selection.points[1]);
    }
  }

  private getMultipleSelection(startPoint?: Point, endPoint?: Point,
                               elements?: Set<SVGElement>)
    : SelectionReturn {
    this.service.selectedElements = new Set();
    if (elements === undefined) {
      const allElements = Array.from(
        this.svgStructure.drawZone.children
      ) as SVGElement[];
      elements = new Set(allElements);
    }
    const multipleSelection = new MultipleSelection(
      elements, this.getSvgOffset(), startPoint, endPoint
    );
    return multipleSelection.getSelection();
  }

  private applyInversion(elements: Set<SVGElement>,
                         startPoint?: Point, endPoint?: Point): void {
    const elementsToInvert = new Set(this.selectedElementsFreezed);
    elements.forEach((element: SVGElement) => {
      if (this.selectedElementsFreezed.has(element)) {
        elementsToInvert.delete(element);
      } else {
        elementsToInvert.add(element);
      }
    });
    this.applyMultipleSelection(startPoint, endPoint, elementsToInvert);
  }

  protected drawSelection(p1: Point, p2: Point): void {
    this.drawARectangle(this.rectangles.selection, p1, p2, Util.COLORS.BLUE);
  }

  private drawVisualisation(p1: Point, p2: Point): void {
    this.drawARectangle(this.rectangles.visualisation, p1, p2, Util.COLORS.GREEN, true);
    this.drawCircles(p1, p2);
  }

  protected drawInversion(p1: Point, p2: Point): void {
    this.drawARectangle(this.rectangles.inversion, p1, p2,
      Util.COLORS.RED, true);
  }

  private drawARectangle(element: SVGElement, p1: Point, p2: Point,
                         color: string, dasharray: boolean = false): void {
    const [startPoint, endPoint] = Util.SelectionLogicUtil.orderPoint(p1, p2);
    const rectangleObject =
      new Rectangle(this.renderer, element, new MathService());
    rectangleObject.setParameters(BackGroundProperties.None, StrokeProperties.Filled);
    rectangleObject.dragRectangle(startPoint, endPoint);
    rectangleObject.setCss({
      strokeWidth: Util.RECTANGLE_STROKE,
      strokeColor: color,
      fillColor: 'none',
      opacity: '0'
    });
    if (dasharray) {
      this.renderer.setAttribute(element, 'stroke-dasharray', Util.DASH_ARRAY);
    }
  }

  protected drawCircles(p1: Point, p2: Point): void {
    const [startPoint, endPoint] = Util.SelectionLogicUtil.orderPoint(p1, p2);
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
    Circle.set(center, this.renderer, circle, radius, Util.COLORS.GRAY);
  }

  protected deleteVisualisation(): void {
    this.resetRectangle(this.rectangles.visualisation);
    this.resetTranslate(this.rectangles.visualisation);
    this.deleteCircles();
    this.service.selectedElements.clear();
  }

  private deleteCircles(): void {
    this.circles.forEach((element) => {
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
    this.renderer.setAttribute(element, 'width', '0');
    this.renderer.setAttribute(element, 'height', '0');
  }

  private resetTranslate(element: SVGElement): void {
    this.renderer.setAttribute(element, 'transform', 'translate(0,0)');
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
    if (indexOfCircle !== NOT_FOUND) {
      return indexOfCircle as Util.CircleType;
    }
    return BasicSelectionType.NOTHING;
  }

  protected isInTheVisualisationZone(x: number, y: number): boolean {
    const point = this.svgStructure.root.createSVGPoint();
    const [dx, dy] = new Transform(this.rectangles.visualisation, this.renderer).getTransformTranslate();
    [point.x, point.y] = [x - dx, y - dy];
    return (this.rectangles.visualisation as SVGGeometryElement).isPointInFill(point);
  }

  protected isOnControlCircle(x: number, y: number): number {
    let retValue = 0;
    let index = 0;
    for (const circle of this.circles) {
      const centerX = circle.getAttribute('cx');
      const centerY = circle.getAttribute('cy');
      // console.log('center: ' + centerX + ' ' + centerY);
      // console.log('pos: ' + x + ' ' + y)
      if (!!centerX && !!centerY) {
        const distance = Math.sqrt(Math.pow(+centerX - x, 2) +  Math.pow(+centerY - y, 2));
        retValue = distance < +Util.CIRCLE_RADIUS ? index : NOT_FOUND;
      }
      if (retValue !== NOT_FOUND) {
        break;
      }
      index++;
    }

    return retValue;
  }

  protected translateAll(x: number, y: number): void {
    Transform.translateAll(this.service.selectedElements, x, y, this.renderer);
    Transform.translateAll(this.circles, x, y, this.renderer);
    new Transform(this.rectangles.visualisation, this.renderer).translate(x, y);
  }

  protected resizeAll(factorX: number, factorY: number): void {
    Transform.scaleAll(this.service.selectedElements, factorX, factorY, this.renderer);
  }

  private getSvgOffset(): Offset {
    const svgBoundingRect = this.svgStructure.root.getBoundingClientRect();
    return { top: svgBoundingRect.top, left: svgBoundingRect.left };
  }

  private initialiseKeyManager(): void {
    const allArrows = new Set<string>([Arrow.Up, Arrow.Down, Arrow.Left, Arrow.Right]);
    this.keyManager = {
      keyPressed: new Set(),
      lastTimeCheck: new Date().getTime(),
      handlers: {
        keydown: ($event: KeyboardEvent) => {
          if (!allArrows.has($event.key)) {
            return ;
          }
          $event.preventDefault();
          this.keyManager.keyPressed.add($event.key);
          const actualTime = new Date().getTime();
          if (actualTime - this.keyManager.lastTimeCheck >= Util.TIME_INTERVAL) {
            this.keyManager.lastTimeCheck = actualTime;
            this.handleKey(Arrow.Up, 0, -Util.OFFSET_TRANSLATE);
            this.handleKey(Arrow.Down, 0, Util.OFFSET_TRANSLATE);
            this.handleKey(Arrow.Left, -Util.OFFSET_TRANSLATE, 0);
            this.handleKey(Arrow.Right, Util.OFFSET_TRANSLATE, 0);
          }
        },
        keyup: ($event: KeyboardEvent) => {
          this.keyManager.keyPressed.delete($event.key);
          if (this.keyManager.keyPressed.size === 0 && allArrows.has($event.key)) {
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
    this.allListenners.forEach((end) => end());
    [this.rectangles.selection, this.rectangles.inversion,
    this.rectangles.visualisation].forEach((element: SVGElement) => {
      this.renderer.removeChild(this.svgStructure.temporaryZone, element);
    });
    this.circles.forEach((circle) => this.renderer.removeChild(
      this.svgStructure.temporaryZone, circle)
    );
  }

}
