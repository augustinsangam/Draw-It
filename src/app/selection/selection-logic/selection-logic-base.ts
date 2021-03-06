import { OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NOT_FOUND } from 'src/app/not-found';
import { GridService } from '../../tool/grid/grid.service';
import { MathService } from '../../tool/mathematics/tool.math-service.service';
import { BackGroundProperties, StrokeProperties } from '../../tool/shape/common/abstract-shape';
import { Circle } from '../../tool/shape/common/circle';
import { Point } from '../../tool/shape/common/point';
import { Rectangle } from '../../tool/shape/common/rectangle';
import { ToolLogicDirective } from '../../tool/tool-logic/tool-logic.directive';
import { PostAction, UndoRedoService } from '../../undo-redo/undo-redo.service';
import { MultipleSelection } from '../multiple-selection';
import { Offset } from '../offset';
import { SelectionReturn } from '../selection-return';
import { SelectionService } from '../selection.service';
import { SingleSelection } from '../single-selection';
import { CircleType } from './circle-type';
import { BasicSelectionType, ElementSelectedType } from './element-selected-type';
import { Mouse } from './mouse';
import * as Util from './selection-logic-util';
import { Transform } from './transform';

export abstract class SelectionLogicBase extends ToolLogicDirective
  implements OnInit, OnDestroy {

  circles: SVGElement[];
  allListenners: (() => void)[];
  protected selectedElementsFreezed: Set<SVGElement>;
  rectangles: Util.SelectionRectangles;
  mouse: Mouse;

  constructor(readonly renderer: Renderer2,
              readonly undoRedoService: UndoRedoService,
              readonly service: SelectionService,
              readonly gridService: GridService) {
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
        return;
      }
      elementsToInvert.add(element);
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
    rectangleObject.setParameters(BackGroundProperties.NONE, StrokeProperties.FILLED);
    rectangleObject.dragRectangle(startPoint, endPoint);
    rectangleObject.setCss({
      strokeWidth: Util.SelectionLogicUtil.RECTANGLE_STROKE, strokeColor: color,
      fillColor: 'none', opacity: '0'
    });
    this.renderer.setAttribute(element, 'stroke-dasharray', Util.SelectionLogicUtil.DASH_ARRAY);
  }

  protected drawCircles(p1: Point, p2: Point): void {
    const [startPoint, endPoint] = Util.SelectionLogicUtil.orderPoint(p1, p2);
    const centerPoint = new Point(
      (startPoint.x + endPoint.x) / 2,
      (startPoint.y + endPoint.y) / 2);
    this.setCircle(new Point(startPoint.x, centerPoint.y),
      CircleType.LEFT_CIRCLE, Util.SelectionLogicUtil.CIRCLE_RADIUS);
    this.setCircle(new Point(centerPoint.x, startPoint.y),
      CircleType.TOP_CIRCLE, Util.SelectionLogicUtil.CIRCLE_RADIUS);
    this.setCircle(new Point(endPoint.x, centerPoint.y),
      CircleType.RIGHT_CIRCLE, Util.SelectionLogicUtil.CIRCLE_RADIUS);
    this.setCircle(new Point(centerPoint.x, endPoint.y),
      CircleType.BOTTOM_CIRCLE, Util.SelectionLogicUtil.CIRCLE_RADIUS);
  }

  private setCircle(center: Point, circle: CircleType, radius: string): void {
    if (this.mouse.left.selectedElement === circle) {
      Circle.set(center, this.renderer, this.circles[circle], radius, Util.COLORS.DRAK_RED);
      return;
    }
    Circle.set(center, this.renderer, this.circles[circle], radius, Util.COLORS.GRAY);
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
      return indexOfCircle as CircleType;
    }
    return BasicSelectionType.NOTHING;
  }

  protected isInTheVisualisationZone(x: number, y: number): boolean {
    const point = this.svgStructure.root.createSVGPoint();
    const [dx, dy] = new Transform(this.rectangles.visualisation, this.renderer).getTransformTranslate();
    [point.x, point.y] = [x - dx, y - dy];
    return (this.rectangles.visualisation as SVGGeometryElement).isPointInFill(point);
  }

  translateAll(x: number, y: number): void {
    Transform.translateAll(this.service.selectedElements, x, y, this.renderer);
    Transform.translateAll(this.circles, x, y, this.renderer);
    new Transform(this.rectangles.visualisation, this.renderer).translate(x, y);
  }

  getSvgOffset(): Offset {
    const svgBoundingRect = this.svgStructure.root.getBoundingClientRect();
    return { y: svgBoundingRect.top, x: svgBoundingRect.left };
  }

  protected applyMouseStyle($event: MouseEvent): void {
    let mouseStyle = 'default';
    if (this.mouse.left.onResize) {
      mouseStyle = (this.mouse.left.selectedElement as number)
        % (Util.SelectionLogicUtil.CIRCLES.length - 1) === 0 ? 'col-resize' : 'ns-resize';
    } else if (this.isInTheVisualisationZone($event.offsetX, $event.offsetY) && !this.mouse.left.mouseIsDown) {
      // ElementFromPoint n'est utilisé que pour avoir une interaction belle avec l'utilisateur
      // lors de la sélection. Il n'influence pas la logique.
      // (Pour le livrable 4 UX)
      const elementFromCursor = document.elementFromPoint($event.x, $event.y) as SVGGElement;
      const isDrawElement = this.elementSelectedType(elementFromCursor) === BasicSelectionType.DRAW_ELEMENT;
      mouseStyle = isDrawElement ? 'pointer' : 'grab';
    } else if (this.mouse.left.onDrag) {
      mouseStyle = 'grabbing';
    }
    this.renderer.setStyle(this.svgStructure.root, 'cursor', mouseStyle);
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
