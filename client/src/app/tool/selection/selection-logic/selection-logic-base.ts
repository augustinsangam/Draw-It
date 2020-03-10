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
import { SingleSelection } from '../single-selection';
import { Deplacement } from './deplacement';
import { BasicSelectionType, ElementSelectedType } from './element-selected-type';
import * as Util from './selection-logic-util';

enum Arrow {
  Up = 'ArrowUp',
  Down = 'ArrowDown',
  Left = 'ArrowLeft',
  Right = 'ArrowRight'
}

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
    const action: PostAction = {
      functionDefined: true,
      function: () => {
        this.deleteVisualisation();
      }
    };
    this.undoRedoService.setPostUndoAction(action);
    this.undoRedoService.setPostRedoAction(action);
  }

  // TODO : Renderer

  ngOnInit(): void {
    this.mouse = Util.SelectionLogicUtil.initialiseMouse();
    this.rectangles = Util.SelectionLogicUtil.initialiseRectangles(
      this.renderer, this.svgStructure.temporaryZone, this.svgNS);
    this.circles = Util.SelectionLogicUtil.initialiseCircles(
      this.renderer, this.svgStructure.temporaryZone, this.svgNS
    );
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

  private getMultipleSelection(startPoint?: Point, endPoint?: Point,
                               elements?: Set<SVGElement>)
    : SelectionReturn {
    this.selectedElements = new Set();
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
      // TODO : Renderer
      element.setAttribute('stroke-dasharray', Util.DASH_ARRAY);
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
    // TODO : Méthode statique
    // A la construction, tout est fait
    // tslint:disable-next-line: no-unused-expression
    new Circle(center, this.renderer, circle, radius, Util.COLORS.GRAY);
  }

  protected deleteVisualisation(): void {
    this.resetRectangle(this.rectangles.visualisation);
    this.resetTranslate(this.rectangles.visualisation);
    this.deleteCircles();
    this.selectedElements = new Set();
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

  protected isInTheVisualisationZone(x: number, y: number): boolean {
    const point = this.svgStructure.root.createSVGPoint();
    const [dx, dy] = Deplacement.getTransformTranslate(this.rectangles.visualisation);
    [point.x, point.y] = [x - dx, y - dy];
    return (this.rectangles.visualisation as SVGGeometryElement).isPointInFill(point);
  }

  protected translateAll(x: number, y: number): void {
    Deplacement.translateAll(this.selectedElements, x, y);
    Deplacement.translateAll(this.circles, x, y);
    Deplacement.translate(this.rectangles.visualisation, x, y);
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
