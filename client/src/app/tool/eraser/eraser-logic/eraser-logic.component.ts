import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { MathService } from '../../mathematics/tool.math-service.service';
import { BasicSelectionType } from '../../selection/selection-logic/element-selected-type';
import { MouseTracking } from '../../selection/selection-logic/mouse-tracking';
import * as Util from '../../selection/selection-logic/selection-logic-util';
import {
  BackGroundProperties, StrokeProperties
} from '../../shape/common/abstract-shape';
import { Point } from '../../shape/common/point';
import { Rectangle } from '../../shape/common/rectangle';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { PostAction, UndoRedoService } from '../../undo-redo/undo-redo.service';
import { EraserService } from '../eraser.service';

export const CONSTANTS = {
  MAX_RED: 150,
  MIN_GREEN: 100,
  MIN_BLUE: 100,
  FACTOR: 50,
  RED: 'rgba(255, 0, 0, 1)',
  RED_TRANSPARENT: 'rgba(255, 0, 0, 0.7)',
  FILL_COLOR: 'white',
  STROKE_WIDTH: '2',
  PIXEL_INCREMENT: 3
};

@Component({
  selector: 'app-eraser-logic',
  template: ''
})
export class EraserLogicComponent
  extends ToolLogicDirective implements OnInit, OnDestroy {

  private mouse: MouseTracking;
  private eraser: SVGRectElement;
  private allListeners: (() => void)[];
  private markedElements: Map<SVGElement, [boolean, string]>;
  private elementsDeletedInDrag: boolean;
  private lastestMousePosition: Point;
  private handlers: Map<string, Util.MouseEventCallBack>;

  constructor(private renderer: Renderer2,
              private service: EraserService,
              private colorService: ColorService,
              private undoRedoService: UndoRedoService) {
    super();
    this.eraser = this.renderer.createElement('rect', this.svgNS);
    this.allListeners = [];
    const fakePoint = new Point(0, 0);
    this.mouse = {
      startPoint: fakePoint, currentPoint: fakePoint, endPoint: fakePoint,
      mouseIsDown: false, selectedElement: BasicSelectionType.NOTHING,
      onDrag: false
    };
    this.markedElements = new Map();
    this.undoRedoService.resetActions();
    const postAction: PostAction = {
      functionDefined: true,
      function: () => {
        this.markElementsInZone(this.lastestMousePosition.x,
          this.lastestMousePosition.y);
      }
    };
    this.undoRedoService.setPostUndoAction(postAction);
    this.undoRedoService.setPostRedoAction(postAction);
    this.initialiseHandlers();
  }

  private initialiseHandlers(): void {
    this.handlers = new Map<string, Util.MouseEventCallBack>([
      ['mousedown', ($event: MouseEvent) => {
        if ($event.button === 0) {
          this.mouse.startPoint = new Point($event.offsetX, $event.offsetY);
          this.mouse.mouseIsDown = true;
          this.elementsDeletedInDrag = false;
        }
      }],
      ['mousemove', ($event: MouseEvent) => {
        this.restoreMarkedElements();
        const selectedElements = this.markElementsInZone($event.x, $event.y);
        this.mouse.currentPoint = new Point($event.offsetX, $event.offsetY);
        this.lastestMousePosition = new Point($event.x, $event.y);
        if (this.mouse.mouseIsDown) {
          this.deleteAll(selectedElements);
          if (selectedElements.size !== 0) {
            this.elementsDeletedInDrag = true;
          }
        }
        this.drawEraser();
      }],
      ['mouseup', ($event: MouseEvent) => {
        if ($event.button !== 0) {
          return;
        }
        this.mouse.mouseIsDown = false;
        this.mouse.endPoint = new Point($event.offsetX, $event.offsetY);
        if (this.elementsDeletedInDrag) {
          this.restoreMarkedElements();
          this.undoRedoService.saveState();
        }
      }],
      ['click', ($event: MouseEvent) => {
        if ($event.button !== 0) {
          return;
        }
        if (this.mouse.startPoint.equals(this.mouse.endPoint)) {
          this.restoreMarkedElements();
          const marked = this.markElementsInZone($event.x, $event.y);
          if (marked.size !== 0) {
            this.deleteAll(marked);
            this.undoRedoService.saveState();
          }
        }
      }],
      ['mouseleave', () => {
        this.hideEraser();
        this.restoreMarkedElements();
        this.mouse.mouseIsDown = false;
        if (this.elementsDeletedInDrag) {
          this.undoRedoService.saveState();
          this.elementsDeletedInDrag = false;
        }
      }]
    ]);

  }
  ngOnInit(): void {
    ['mousedown', 'mousemove', 'mouseup', 'click', 'mouseleave']
      .forEach((event: string) => {
        this.allListeners.push(
          this.renderer.listen(this.svgStructure.root, event,
            this.handlers.get(event) as Util.MouseEventCallBack)
        );
      });
    this.svgStructure.root.style.cursor = 'none';
    this.renderer.appendChild(this.svgStructure.temporaryZone, this.eraser);
  }

  private drawEraser(): void {
    const [startPoint, endPoint] = this.getCorners();
    const rectangleObject =
      new Rectangle(this.renderer, this.eraser, new MathService());
    rectangleObject.setParameters(BackGroundProperties.Filled,
      StrokeProperties.Filled);
    rectangleObject.dragRectangle(startPoint, endPoint);
    rectangleObject.setCss({
      strokeWidth: CONSTANTS.STROKE_WIDTH,
      strokeColor: CONSTANTS.RED_TRANSPARENT,
      fillColor: CONSTANTS.FILL_COLOR,
      opacity: '1'
    });
  }

  // TODO : RENDERER, separer la logique en deux

  private hideEraser(): void {
    this.eraser.setAttribute('width', '0');
    this.eraser.setAttribute('height', '0');
  }

  private removeFill(): void {
    this.eraser.setAttribute('fill', 'none');
  }

  private addFill(): void {
    this.eraser.setAttribute('fill', CONSTANTS.FILL_COLOR);
  }

  private markElementsInZone(x: number, y: number): Set<SVGElement> {
    const selectedElements = new Set<SVGElement>();
    const halfSize = this.service.size / 2;
    this.removeFill();
    for (let i = x - halfSize; i <= x + halfSize; i += CONSTANTS.PIXEL_INCREMENT) {
      for (let j = y - halfSize; j <= y + halfSize; j += CONSTANTS.PIXEL_INCREMENT) {
        const element = document.elementFromPoint(i, j);
        if (this.svgStructure.drawZone.contains(element)
          && element !== this.eraser) {
          selectedElements.add(element as SVGElement);
        }
      }
    }
    this.addFill();
    this.markedElements.clear();
    selectedElements.forEach((element: SVGElement) => {
      let stroke = element.getAttribute('stroke');
      let strokeModified = CONSTANTS.RED;
      const hasStroke = !(stroke == null || stroke === 'none');
      if (!hasStroke) {
        stroke = element.getAttribute('fill') as string;
      }
      const rgb = this.colorService.rgbFormRgba(stroke as string);
      if (rgb.r > CONSTANTS.MAX_RED && rgb.g < CONSTANTS.MIN_GREEN
        && rgb.b < CONSTANTS.MIN_BLUE) {
        rgb.r = rgb.r - CONSTANTS.FACTOR;
        strokeModified = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
      }
      this.markedElements.set(element, [hasStroke, stroke as string]);
      element.setAttribute(hasStroke ? 'stroke' : 'fill', strokeModified);
    });
    return selectedElements;
  }

  private deleteAll(elements: Set<SVGElement>): void {
    this.restoreMarkedElements();
    elements.forEach((element) => {
      this.renderer.removeChild(this.svgStructure.drawZone, element);
    });
  }

  private restoreMarkedElements(): void {
    for (const entry of this.markedElements) {
      entry[0].setAttribute(entry[1][0] ? 'stroke' : 'fill', entry[1][1]);
    }
    this.markedElements.clear();
  }

  private getCorners(): [Point, Point] {
    const halfSize = this.service.size / 2;
    const startPoint = new Point(
      this.mouse.currentPoint.x - halfSize,
      this.mouse.currentPoint.y - halfSize,
    );
    const endPoint = new Point(
      this.mouse.currentPoint.x + halfSize,
      this.mouse.currentPoint.y + halfSize,
    );
    return [startPoint, endPoint];
  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
    this.renderer.removeChild(this.svgStructure.temporaryZone, this.eraser);
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'default');
    this.undoRedoService.resetActions();
  }
}
