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
  private markedElements: Map<SVGElement, string>;
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
        if ($event.button === 0) {
          this.mouse.mouseIsDown = false;
          this.mouse.endPoint = new Point($event.offsetX, $event.offsetY);
          if (this.elementsDeletedInDrag) {
            this.restoreMarkedElements();
            this.undoRedoService.saveState();
          }
        }
      }],
      ['click', ($event: MouseEvent) => {
        if ($event.button === 0) {
          // On s'assure d'avoir un vrai click
          if (this.mouse.startPoint.equals(this.mouse.endPoint)) {
            this.restoreMarkedElements();
            const marked = this.markElementsInZone($event.x, $event.y);
            if (marked.size !== 0) {
              this.deleteAll(marked);
              this.undoRedoService.saveState();
            }
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
      fillColor: '#FFFFFF',
      opacity: '1'
    });
  }

  private hideEraser(): void {
    this.eraser.setAttribute('width', '0');
    this.eraser.setAttribute('height', '0');
  }

  private markElementsInZone(x: number, y: number): Set<SVGElement> {
    const selectedElements = new Set<SVGElement>();
    const halfSize = this.service.size / 2;
    this.hideEraser();
    for (let i = x - halfSize; i <= x + halfSize; i += CONSTANTS.PIXEL_INCREMENT) {
      for (let j = y - halfSize; j <= y + halfSize; j += CONSTANTS.PIXEL_INCREMENT) {
        const element = document.elementFromPoint(i, j);
        if (this.svgStructure.drawZone.contains(element)
          && element !== this.eraser) {
          selectedElements.add(element as SVGElement);
        }
      }
    }
    this.drawEraser();
    this.markedElements.clear();
    selectedElements.forEach((element: SVGElement) => {
      const stroke = element.getAttribute('stroke');
      let strokeModified = CONSTANTS.RED;
      if (stroke !== null && stroke !== 'none') {
        const rgb = this.colorService.rgbFormRgba(stroke);
        // Si on a beaucoup de rouge mais pas trop les autres couleurs
        if (rgb.r > CONSTANTS.MAX_RED && rgb.g < CONSTANTS.MIN_GREEN
          && rgb.b < CONSTANTS.MIN_BLUE) {
          rgb.r = rgb.r - CONSTANTS.FACTOR;
          strokeModified = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
        }
        this.markedElements.set(element, stroke as string);
        element.setAttribute('stroke', strokeModified);
      }
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
      entry[0].setAttribute('stroke', entry[1]);
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
