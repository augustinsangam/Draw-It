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
  protected mouse: Util.Mouse;
  protected rectangles: Util.SelectionRectangles;
  protected keyManager: Util.KeyManager;
  protected inverted: {x: number, y: number};

  protected debugCircle: SVGElement;

  constructor(protected renderer: Renderer2,
              protected undoRedoService: UndoRedoService,
              protected service: SelectionService) {
    super();
    this.allListenners = [];
    const action: PostAction = {
      functionDefined: true,
      function: () => { this.deleteVisualisation(); }
    };
    this.undoRedoService.setPostUndoAction(action);
    this.undoRedoService.setPostRedoAction(action);
    this.inverted = {x: 1, y: 1};
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

  protected resizeAll(factorX: number, factorY: number, scaleOffset: Util.Offset, baseTransform: Map<SVGElement, number[]>): void {
    const point = this.findElementCenter(this.rectangles.visualisation);
    point.x = point.x - scaleOffset.x / 2;
    point.y = point.y - scaleOffset.y / 2;
    Transform.scaleAll(this.service.selectedElements, point, factorX * this.inverted.x, factorY * this.inverted.y, baseTransform, this.renderer);
    // Circle.set(point, this.renderer, this.debugCircle, Util.CIRCLE_RADIUS, 'red');
    if (factorX !== 1) {
      Transform.translateAll(this.service.selectedElements, scaleOffset.x / 2, 0, this.renderer);
      new Transform(this.debugCircle, this.renderer).translate(scaleOffset.x / 2, 0);
    }
    if (factorY !== 1) {
      Transform.translateAll(this.service.selectedElements, 0, scaleOffset.y / 2, this.renderer);
      new Transform(this.debugCircle, this.renderer).translate(0, scaleOffset.y / 2);
    }
  }

  // tslint:disable-next-line: cyclomatic-complexity
  protected resizeVisualisationRectangle(mouseOffset: Util.Offset): void {

    const x = this.rectangles.visualisation.getAttribute('x');
    const y = this.rectangles.visualisation.getAttribute('y');
    const width = this.rectangles.visualisation.getAttribute('width');
    const height = this.rectangles.visualisation.getAttribute('height');
    let refPoint1 = new Point(0, 0);
    let refPoint2 = new Point(0, 0);
    let splitedOffset: Util.Offset[];
    // const splitedOffset = [mouseOffset];

    if (!!x && !!y && !!width && !!height) {
      refPoint1.x = +x;
      refPoint1.y = +y;
      refPoint2.x = +x + Math.round(+width);
      refPoint2.y = +y + Math.round(+height);

      let switched = false;

      splitedOffset = this.preventResizeOverflow(mouseOffset, [refPoint1, refPoint2]);
      console.log('splited: ' + splitedOffset[0].x + ' ' + splitedOffset[1].x);
      [refPoint1, refPoint2] = this.drawVisualisationResising(splitedOffset[0], [refPoint1, refPoint2]);
      
      if (refPoint2.x - refPoint1.x <= 1 && splitedOffset[0].x !== 0) {
        if (splitedOffset[0].x < 0 && this.mouse.left.selectedElement !== 0) {
          this.mouse.left.selectedElement = Util.CIRCLES[0];
          switched = true;
        } else if (splitedOffset[0].x > 0 && this.mouse.left.selectedElement !== 3) {
          this.mouse.left.selectedElement = Util.CIRCLES[3];
          switched = true;
        }
        if (switched) {
          this.inverted.x = -this.inverted.x;
          // Transform.scaleAll(this.service.selectedElements, point, -1, 1, this.renderer);
          console.log('SWITCH TO ' + this.mouse.left.selectedElement);
        }
      }
      switched = false;
      if (refPoint2.y - refPoint1.y <= 1 && splitedOffset[0].y !== 0) {
        if (splitedOffset[0].y < 0 && this.mouse.left.selectedElement !== 1) {
          this.mouse.left.selectedElement = Util.CIRCLES[1];
          switched = true;
        } else if (splitedOffset[0].y > 0 && this.mouse.left.selectedElement !== 2) {
          this.mouse.left.selectedElement = Util.CIRCLES[2];
          switched = true;
        }
        if (switched) {
          this.inverted.y = -this.inverted.y;
          // Transform.scaleAll(this.service.selectedElements, point, 1, -1, this.renderer);
          console.log('SWITCH TO ' + this.mouse.left.selectedElement);
        }
      }
      this.drawVisualisationResising(splitedOffset[1], [refPoint1, refPoint2]);
      // this.drawVisualisationResising(mouseOffset, [refPoint1, refPoint2]);
    }
    // const p1 = new Point(
    //   refPoint1.x + ((this.mouse.left.selectedElement === Util.CircleType.LEFT_CIRCLE) ? mouseOffset.x : 0),
    //   refPoint1.y + ((this.mouse.left.selectedElement === Util.CircleType.TOP_CIRCLE) ? mouseOffset.y : 0),
    // );
    // const p2 = new Point(
    //   refPoint2.x + ((this.mouse.left.selectedElement === Util.CircleType.RIGHT_CIRCLE) ? mouseOffset.x : 0),
    //   refPoint2.y + ((this.mouse.left.selectedElement === Util.CircleType.BOTTOM_CIRCLE) ? mouseOffset.y : 0),
    // );
    // this.drawVisualisation(p1, p2);
  }

  private drawVisualisationResising(mouseOffset: Util.Offset, refPoint: Point[]): Point[] {
    const p1 = new Point(
      refPoint[0].x + ((this.mouse.left.selectedElement === Util.CircleType.LEFT_CIRCLE) ? mouseOffset.x : 0),
      refPoint[0].y + ((this.mouse.left.selectedElement === Util.CircleType.TOP_CIRCLE) ? mouseOffset.y : 0),
    );
    const p2 = new Point(
      refPoint[1].x + ((this.mouse.left.selectedElement === Util.CircleType.RIGHT_CIRCLE) ? mouseOffset.x : 0),
      refPoint[1].y + ((this.mouse.left.selectedElement === Util.CircleType.BOTTOM_CIRCLE) ? mouseOffset.y : 0),
    );
    this.drawVisualisation(p1, p2);
    return [p1, p2];
  }

  private preventResizeOverflow(mouseOffset: Util.Offset, pointRef: Point[]): Util.Offset[] {
    let offset1: Util.Offset = {
      x: 0,
      y: 0,
    };
    let offset2: Util.Offset = {
      x: 0,
      y: 0,
    };
    switch (this.mouse.left.selectedElement) {
      case Util.CircleType.LEFT_CIRCLE: {
        const splitedOffset = pointRef[0].x + mouseOffset.x > pointRef[1].x ? pointRef[1].x - pointRef[0].x : mouseOffset.x;
        offset1 = {
          x: splitedOffset,
          y: 0,
        };
        offset2 = {
          x: -(mouseOffset.x - splitedOffset),
          y: 0,
        };
        break;
      }
      case Util.CircleType.TOP_CIRCLE: {
        const splitedOffset = pointRef[0].y + mouseOffset.y > pointRef[1].y ? pointRef[1].y - pointRef[0].y : mouseOffset.y;
        offset1 = {
          x: 0,
          y: splitedOffset,
        };
        offset2 = {
          x: 0,
          y: -(mouseOffset.y - splitedOffset),
        };
        break;
      }
      case Util.CircleType.BOTTOM_CIRCLE: {
        const splitedOffset = pointRef[1].y + mouseOffset.y < pointRef[0].y ? pointRef[0].y - pointRef[1].y : mouseOffset.y;
        offset1 = {
          x: 0,
          y: splitedOffset,
        };
        offset2 = {
          x: 0,
          y: -(mouseOffset.y - splitedOffset),
        };
        break;
      }
      case Util.CircleType.RIGHT_CIRCLE: {
        const splitedOffset = pointRef[1].x + mouseOffset.x < pointRef[0].x ? pointRef[0].x - pointRef[1].x : mouseOffset.x;
        offset1 = {
          x: splitedOffset,
          y: 0,
        };
        offset2 = {
          x: -(mouseOffset.x - splitedOffset),
          y: 0,
        };
        break;
      }
      default:
        break;
    }
    return [offset1, offset2];
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
    return new Point(
      (selection[0].x + selection[1].x) / 2,
      (selection[0].y + selection[1].y) / 2
    );
    // const centerPoint = new Point(
    //   (selection[0].x + selection[1].x) / 2,
    //   (selection[0].y + selection[1].y) / 2
    // );
    // Circle.set(centerPoint, this.renderer, this.debugCircle, Util.CIRCLE_RADIUS, 'red');
    // return centerPoint;

  }

  getSvgOffset(): Offset {
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
