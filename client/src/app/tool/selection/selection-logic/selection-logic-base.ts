import { OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { PointSet } from '../../bucket/bucket-logic/point-set';
import { GridService } from '../../grid/grid.service';
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
import { Arrow } from './arrow';
import { BasicSelectionType, ElementSelectedType } from './element-selected-type';
import * as Util from './selection-logic-util';
import { Transform } from './transform';

const NOT_FOUND = -1;

export abstract class SelectionLogicBase extends ToolLogicDirective
  implements OnInit, OnDestroy {

  protected circles: SVGElement[];
  protected allListenners: (() => void)[];
  protected selectedElementsFreezed: Set<SVGElement>;
  protected keyManager: Util.KeyManager;
  rectangles: Util.SelectionRectangles;
  mouse: Util.Mouse;

  constructor(readonly   renderer: Renderer2,
              readonly   undoRedoService: UndoRedoService,
              readonly   service: SelectionService,
              protected  gridService: GridService) {
    super();
    this.allListenners = [];
    const action: PostAction = {
      functionDefined: true,
      function: () => { this.deleteVisualisation(); }
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
    this.applyInversion(inversion.selectedElements);
  }

  applyMultipleSelection(startPoint?: Point, endPoint?: Point, elements?: Set<SVGElement>): void {
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
      elements = new Set(this.svgStructure.drawZone.children as unknown as Iterable<SVGElement>);
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

  drawVisualisation(p1: Point, p2: Point): void {
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
      strokeWidth: Util.RECTANGLE_STROKE, strokeColor: color,
      fillColor: 'none', opacity: '0'
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

  deleteVisualisation(): void {
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

  protected resetRectangle(element: SVGElement): void {
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
    return (this.rectangles.visualisation as SVGGeometryElement).isPointInFill(point);
  }

  protected translateAll(x: number, y: number): void {
    Transform.translateAll(this.service.selectedElements, x, y, this.renderer);
    Transform.translateAll(this.circles, x, y, this.renderer);
    new Transform(this.rectangles.visualisation, this.renderer).translate(x, y);
  }

  protected rotateAll(angle: number): void {
    const point = Util.SelectionLogicUtil.findElementCenter(this.rectangles.visualisation, this.getSvgOffset());
    Transform.rotateAll(this.service.selectedElements, point, angle, this.renderer);
    Transform.rotateAll(this.circles, point, angle, this.renderer);
    new Transform(this.rectangles.visualisation, this.renderer).rotate(point, angle);
    this.applyMultipleSelection(undefined, undefined, new Set(this.service.selectedElements));
  }

  protected allSelfRotate(angle: number): void {
    this.service.selectedElements.forEach((element) => {
      const point = Util.SelectionLogicUtil.findElementCenter(element, this.getSvgOffset());
      new Transform(element, this.renderer).rotate(point, angle);
    });
    this.applyMultipleSelection(undefined, undefined, new Set(this.service.selectedElements));
  }

  getSvgOffset(): Offset {
    const svgBoundingRect = this.svgStructure.root.getBoundingClientRect();
    return { y: svgBoundingRect.top, x: svgBoundingRect.left };
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
      if (!this.service.magnetActive) {
        this.translateAll(dx, dy);
        return ;
      }
      const comparePoint = this.getComparePoint(this.service.selectedElements);
      const pointInDirection = this.pointInDirection(comparePoint, dx, dy);
      let [translateX, translateY] = [pointInDirection.x - comparePoint.x, pointInDirection.y - comparePoint.y];
      const intersection = this.nearestIntersection(comparePoint);
      translateX += intersection.x - comparePoint.x;
      translateY += intersection.y - comparePoint.y;

      if (translateX > this.gridService.squareSize) {
        translateX -= this.gridService.squareSize;
      } else if (translateX < -this.gridService.squareSize) {
        translateX += this.gridService.squareSize;
      }
      if (translateY > this.gridService.squareSize) {
        translateY -= this.gridService.squareSize;
      } else if (translateY < -this.gridService.squareSize) {
        translateY += this.gridService.squareSize;
      }

      this.translateAll(translateX, translateY);
    }
  }

  protected nearestIntersection(point: Point): Point {
    const candidates = new PointSet();
    const s = this.gridService.squareSize;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const pointToAdd = new Point(point.x - point.x % s + i * s, point.y - point.y % s + j * s);
        if (this.isValidPoint(pointToAdd)) {
          candidates.add(pointToAdd);
        }
      }
    }
    return candidates.nearestPoint(point)[0] as Point;
  }

  private isValidPoint(point: Point): boolean {
    const [x, y] = [point.x, point.y];
    return 0 <= x && x < this.svgShape.width
      && 0 <= y && y < this.svgShape.height;
  }

  private pointInDirection(currentPoint: Point, ux: number, uy: number): Point {
    const dx = ux === 0 ? 0 : ux / Math.abs(ux) * this.gridService.squareSize;
    const dy = uy === 0 ? 0 : uy / Math.abs(uy) * this.gridService.squareSize;
    const result = new Point (currentPoint.x + dx, currentPoint.y + dy);
    return this.isValidPoint(result) ? result : currentPoint;
  }

  protected getComparePoint(elements: Set<SVGElement>): Point {
    const selection = new MultipleSelection(elements, this.getSvgOffset()).getSelection().points;
    const MAX_POINTS_PER_DIMENSION = 3;
    const x = (this.service.magnetPoint as number) % MAX_POINTS_PER_DIMENSION;
    const y = Math.floor((this.service.magnetPoint as number) / MAX_POINTS_PER_DIMENSION);
    return new Point(
      (2 - x) / 2 * selection[0].x + x / 2 * selection[1].x,
      (2 - y) / 2 * selection[0].y + y / 2 * selection[1].y,
    );
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
