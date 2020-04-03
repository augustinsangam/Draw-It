import { OnDestroy, OnInit, Renderer2 } from '@angular/core';
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

  protected debugCircle: SVGElement;

  constructor(protected renderer: Renderer2,
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
    // Debug
    this.debugCircle = this.renderer.createElement('circle', this.svgNS);
    this.renderer.appendChild(this.svgStructure.temporaryZone, this.debugCircle);
    // Debug

    this.mouse = Util.SelectionLogicUtil.initialiseMouse();
    this.rectangles = Util.SelectionLogicUtil.initialiseRectangles(
      this.renderer, this.svgStructure.temporaryZone, this.svgNS);
    this.circles = Util.SelectionLogicUtil.initialiseCircles(
      this.renderer, this.svgStructure.temporaryZone, this.svgNS
    );
    const subscription = this.service.selectAllElements.subscribe(() => {
      this.applyMultipleSelection();
    });
    this.service.copy.subscribe(() => this.onCopy());
    this.service.cut.subscribe(() => this.onCut());
    this.service.paste.subscribe(() => this.onPaste());
    this.service.delete.subscribe(() => this.onDelete());
    this.service.duplicate.subscribe(() => this.onDuplicate());
    this.allListenners.push(() => subscription.unsubscribe());
    this.initialiseKeyManager();
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'default');
  }

  private onCopy(): void {
    if (this.service.selectedElements.size !== 0) {
      this.service.clipboard = this.clone(
        this.service.selectedElements
      );
    }
  }

  private onCut(): void {
    if (this.service.selectedElements.size !== 0) {
      this.service.clipboard = this.clone(
        this.service.selectedElements
      );
      this.service.selectedElements.forEach((element) => {
        this.renderer.removeChild(this.svgStructure.drawZone, element);
      });
      this.deleteVisualisation();
    }
  }

  private onPaste(): void {
    if (this.service.clipboard.size !== 0) {
      Transform.translateAll(this.service.clipboard, 30, 30, this.renderer);
      const clipBoardCloned = this.clone(this.service.clipboard);
      clipBoardCloned.forEach((element) => {
        this.renderer.appendChild(this.svgStructure.drawZone, element);
      });
      this.applyMultipleSelection(undefined, undefined, clipBoardCloned);
    }
  }

  private onDelete(): void {
    if (this.service.selectedElements.size !== 0) {
      this.service.selectedElements.forEach((element) => {
        this.renderer.removeChild(this.svgStructure.drawZone, element);
      });
      this.deleteVisualisation();
    }
  }

  private onDuplicate(): void {
    if (this.service.selectedElements.size !== 0) {
      this.onCopy();
      this.onPaste();
    }
  }

  private clone(elements: Set<SVGElement>): Set<SVGElement> {
    const set = new Set<SVGElement>();
    elements.forEach((element) => {
      set.add(element.cloneNode(true) as SVGElement);
    });
    return set;
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
    this.applyInversion(inversion.selectedElements);
  }

  protected applyMultipleSelection(startPoint?: Point, endPoint?: Point, elements?: Set<SVGElement>): void {
    this.deleteVisualisation();
    const selection = this.getMultipleSelection(startPoint, endPoint, elements);
    this.service.selectedElements = selection.selectedElements;
    if (!selection.empty) {
      this.drawVisualisation(selection.points[0], selection.points[1]);
    }
  }

  private getMultipleSelection(startPoint?: Point, endPoint?: Point, elements?: Set<SVGElement>)
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

  private applyInversion(elements: Set<SVGElement>, startPoint?: Point, endPoint?: Point): void {
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
    this.drawARectangle(this.rectangles.visualisation, p1, p2, Util.COLORS.GREEN);
    this.drawCircles(p1, p2);
  }

  protected drawInversion(p1: Point, p2: Point): void {
    this.drawARectangle(this.rectangles.inversion, p1, p2,
      Util.COLORS.RED);
  }

  private drawARectangle(element: SVGElement, p1: Point, p2: Point, color: string): void {
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
    this.renderer.setAttribute(element, 'stroke-dasharray', Util.DASH_ARRAY);
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
    this.renderer.setAttribute(element, 'transform', 'matrix(1,0,0,1,0,0)');
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
    console.log((this.rectangles.visualisation as SVGGeometryElement).isPointInFill(point));
    return (this.rectangles.visualisation as SVGGeometryElement).isPointInFill(point);
  }

  protected translateAll(x: number, y: number): void {
    Transform.translateAll(this.service.selectedElements, x, y, this.renderer);
    Transform.translateAll(this.circles, x, y, this.renderer);
    new Transform(this.rectangles.visualisation, this.renderer).translate(x, y);
  }

  protected resizeAll(factorX: number, factorY: number, scaleOffset: Util.Offset, mouseOffset: Util.Offset): void {
    const point = this.findElementCenter(this.rectangles.visualisation);
    Transform.scaleAll(this.service.selectedElements, point, factorX, factorY, this.renderer);
    if (factorX !== 1) {
      Transform.translateAll(this.service.selectedElements, scaleOffset.x / 2, 0, this.renderer);
    }
    if (factorY !== 1) {
      Transform.translateAll(this.service.selectedElements, 0, scaleOffset.y / 2, this.renderer);
    }
    this.resizeVisualisationRectangle(point, mouseOffset);
  }

  private resizeVisualisationRectangle(point: Point, mouseOffset: Util.Offset): void {

    const x = this.rectangles.visualisation.getAttribute('x');
    const y = this.rectangles.visualisation.getAttribute('y');
    const width = this.rectangles.visualisation.getAttribute('width');
    const height = this.rectangles.visualisation.getAttribute('height');
    const refPoint1 = new Point(0, 0);
    const refPoint2 = new Point(0, 0);

    if (!!x && !!y && !!width && !!height) {
      refPoint1.x = +x;
      refPoint1.y = +y;
      refPoint2.x = +x + +width;
      refPoint2.y = +y + +height;
      if (+width <= 1 && mouseOffset.x !== 0) {
        this.mouse.left.selectedElement = mouseOffset.x < 0 ? Util.CIRCLES[0] : Util.CIRCLES[3];
        Transform.scaleAll(this.service.selectedElements, point, -1, 1, this.renderer);
        console.log('switch to ' + this.mouse.left.selectedElement);
      }
      if (+height <= 1 && mouseOffset.y !== 0) {
        this.mouse.left.selectedElement = mouseOffset.y < 0 ? Util.CIRCLES[1] : Util.CIRCLES[2];
        Transform.scaleAll(this.service.selectedElements, point, 1, -1, this.renderer);
        console.log('switch to ' + this.mouse.left.selectedElement);
      }
    }
    const xP1 = Math.min(refPoint1.x + ((this.mouse.left.selectedElement < 2) ? mouseOffset.x : 0),
      // refPoint2.x + ((this.mouse.left.selectedElement < 2) ? mouseOffset.x : 0));
      refPoint2.x);
    const xP2 = Math.max(refPoint2.x + ((this.mouse.left.selectedElement > 1) ? mouseOffset.x : 0),
      // refPoint1.x + ((this.mouse.left.selectedElement > 1) ? mouseOffset.x : 0));
      refPoint1.x);
    const p1 = new Point(
      // Math.min(refPoint1.x) + ((this.mouse.left.selectedElement < 2) ? mouseOffset.x : 0),
      xP1,
      refPoint1.y + ((this.mouse.left.selectedElement < 2) ? mouseOffset.y : 0),
    );
    const p2 = new Point(
      // refPoint2.x + ((this.mouse.left.selectedElement > 1) ? mouseOffset.x : 0),
      xP2,
      refPoint2.y + ((this.mouse.left.selectedElement > 1) ? mouseOffset.y : 0),
    );
    this.drawVisualisation(p1, p2);
  }

  protected rotateAll(angle: number): void {
    const point = this.findElementCenter(this.rectangles.visualisation);
    Transform.rotateAll(this.service.selectedElements, point, angle, this.renderer);
    Transform.rotateAll(this.circles, point, angle, this.renderer);
    new Transform(this.rectangles.visualisation, this.renderer).rotate(point, angle);
    this.applyMultipleSelection(undefined, undefined, new Set(this.service.selectedElements));
  }

  protected allSelfRotate(angle: number): void {
    this.service.selectedElements.forEach((element) => {
      const point = this.findElementCenter(element);
      new Transform(element, this.renderer).rotate(point, angle);
    });
    this.applyMultipleSelection(undefined, undefined, new Set(this.service.selectedElements));
  }

  protected findElementCenter(element: SVGElement): Point {
    const selection = new SingleSelection(element, this.getSvgOffset()).points();
    const centerPoint = new Point(
      (selection[0].x + selection[1].x) / 2,
      (selection[0].y + selection[1].y) / 2
    );
    Circle.set(centerPoint, this.renderer, this.debugCircle, Util.CIRCLE_RADIUS, 'red');
    return centerPoint;
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
      shift: false,
      alt: false,
      handlers: {
        keydown: ($event: KeyboardEvent) => {
          this.keyManager.shift = $event.shiftKey;
          this.keyManager.alt = $event.altKey;
          if (!allArrows.has($event.key)) {
            return;
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
          this.keyManager.shift = $event.shiftKey;
          this.keyManager.alt = $event.altKey;
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
