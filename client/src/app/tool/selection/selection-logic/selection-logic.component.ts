import { Component, OnInit, Renderer2 } from '@angular/core';
import { Point } from '../../shape/common/point';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { SelectionService } from '../selection.service';
import { BasicSelectionType } from './element-selected-type';
import { SelectionLogicBase } from './selection-logic-base';
import * as Util from './selection-logic-util';
import { Transform } from './transform';
import { MultipleSelection } from '../multiple-selection';
import { Zone } from '../zone';

const NOT_FOUND = -1;
const MINIMUM_SCALE = 5;

@Component({
  selector: 'app-selection-logic',
  template: ''
})
export class SelectionLogicComponent
  extends SelectionLogicBase implements OnInit {

  private mouseHandlers: Map<string, Map<string, Util.MouseEventCallBack>>;
  private baseVisualisationRectangleDimension: {
    width: number,
    height: number
  } = { width: 0, height: 0 };
  private scaledRectangleDimension: { width: number, height: number } = { width: 0, height: 0 };

  constructor(protected renderer: Renderer2,
              protected undoRedoService: UndoRedoService,
              protected service: SelectionService
  ) {
    super(renderer, undoRedoService, service);
    this.initialiseHandlers();
  }

  private initialiseHandlers(): void {
    this.mouseHandlers = new Map<string, Map<string, Util.MouseEventCallBack>>([
      ['leftButton', new Map<string, Util.MouseEventCallBack>([
        ['mousedown', ($event: MouseEvent) => {
          if ($event.button !== 0) {
            return;
          }
          this.mouse.left.startPoint =
            new Point($event.offsetX, $event.offsetY);
          this.mouse.left.currentPoint =
            new Point($event.offsetX, $event.offsetY);
          this.mouse.left.mouseIsDown = true;
          const target = Util.SelectionLogicUtil.getRealTarget($event);
          this.mouse.left.selectedElement = this.elementSelectedType(
            target as SVGElement
          );
          this.mouse.left.onDrag = this.isInTheVisualisationZone(
            $event.offsetX,
            $event.offsetY
          );
          this.mouse.left.onResize = Util.CIRCLES.indexOf(
            this.mouse.left.selectedElement as Util.CircleType
          ) !== NOT_FOUND;
          if (this.svgStructure.drawZone.contains(target as SVGElement)
            && !this.service.selectedElements.has(target as SVGElement)) {
            this.applySingleSelection(target as SVGElement);
          }
        }],
        // tslint:disable-next-line: cyclomatic-complexity
        ['mousemove', ($event: MouseEvent) => {
          $event.preventDefault();
          if (this.mouse.left.mouseIsDown) {
            const previousCurrentPoint = new Point(this.mouse.left.currentPoint.x, this.mouse.left.currentPoint.y);
            this.mouse.left.currentPoint = new Point($event.offsetX,
              $event.offsetY);
            const selectionWidth = this.rectangles.visualisation.getAttribute('width');
            const selectionHeight = this.rectangles.visualisation.getAttribute('height');
            if (!!selectionHeight && !!selectionWidth) {
              const [width, height] = [+selectionWidth, +selectionHeight];
              this.baseVisualisationRectangleDimension = { width: Math.round(width), height: Math.round(height) };
              this.scaledRectangleDimension = { width: Math.round(width), height: Math.round(height) };
              // this.baseVisualisationRectangleDimension = { width, height };
              // this.scaledRectangleDimension = { width, height };
            }
            if (this.mouse.left.onDrag && !this.mouse.left.onResize) {
              const offsetX = $event.offsetX - previousCurrentPoint.x;
              const offsetY = $event.offsetY - previousCurrentPoint.y;
              this.translateAll(offsetX, offsetY);
            } else if (this.mouse.left.onResize) {
              this.baseVisualisationRectangleDimension = {
                width: this.scaledRectangleDimension.width,
                height: this.scaledRectangleDimension.height
              };
              const offsetX = +this.mouse.left.selectedElement % 3 === 0 ? $event.offsetX - previousCurrentPoint.x : 0;
              const offsetY = +this.mouse.left.selectedElement % 3 !== 0 ? $event.offsetY - previousCurrentPoint.y : 0;

              this.scaledRectangleDimension.width += this.mouse.left.selectedElement === 0 ? -offsetX : offsetX;
              this.scaledRectangleDimension.height += this.mouse.left.selectedElement === 1 ? -offsetY : offsetY;

              const mouseOffset: Util.Offset = { x: offsetX, y: offsetY };
              const scaleOffset: Util.Offset = { x: offsetX, y: offsetY };

              console.log(this.baseVisualisationRectangleDimension.width + ' ' + this.scaledRectangleDimension.width);

              let factorX = this.baseVisualisationRectangleDimension.width > MINIMUM_SCALE ?
                this.scaledRectangleDimension.width / this.baseVisualisationRectangleDimension.width : 1;
              let factorY = this.baseVisualisationRectangleDimension.height > MINIMUM_SCALE ?
                this.scaledRectangleDimension.height / this.baseVisualisationRectangleDimension.height : 1;

              if (factorX === 1 && this.scaledRectangleDimension.width > MINIMUM_SCALE &&
                this.baseVisualisationRectangleDimension.width <= MINIMUM_SCALE) {
                factorX = this.scaledRectangleDimension.width / MINIMUM_SCALE;
                scaleOffset.x = this.scaledRectangleDimension.width - MINIMUM_SCALE;
                console.log('Recalcul ' + factorX + ' offsetX : ' + offsetX);
              }
              if (factorY === 1 && this.scaledRectangleDimension.height > MINIMUM_SCALE &&
                this.baseVisualisationRectangleDimension.height <= MINIMUM_SCALE) {
                factorY = this.scaledRectangleDimension.height / MINIMUM_SCALE;
                scaleOffset.y = this.scaledRectangleDimension.height - MINIMUM_SCALE;
              }
              this.resizeAll(factorX, factorY, scaleOffset, mouseOffset);
            } else {
              this.drawSelection(this.mouse.left.startPoint,
                this.mouse.left.currentPoint);
              const [startPoint, currentPoint] = Util.SelectionLogicUtil.orderPoint(
                this.mouse.left.startPoint, this.mouse.left.currentPoint
              );
              this.applyMultipleSelection(startPoint, currentPoint);
            }
          }
        }],
        ['mouseup', ($event: MouseEvent) => {
          if ($event.button !== 0) {
            return;
          }
          if (this.mouse.left.onDrag || this.mouse.left.onResize &&
            !this.mouse.left.startPoint.equals(this.mouse.left.currentPoint)) {
            this.undoRedoService.saveState();
          }
          this.mouse.left.endPoint = new Point($event.offsetX, $event.offsetY);
          this.mouse.left.mouseIsDown = false;
          this.mouse.left.onDrag = false;
          this.deleteSelection();
        }],
        ['click', ($event: MouseEvent) => {
          if ($event.button !== 0) {
            return;
          }
          if (this.mouse.left.startPoint.equals(this.mouse.left.endPoint)) {
            const target = Util.SelectionLogicUtil.getRealTarget($event);
            const elementType = this.elementSelectedType(target as SVGElement);
            if (elementType === BasicSelectionType.DRAW_ELEMENT) {
              this.applySingleSelection(target as SVGElement);
            } else if (elementType === BasicSelectionType.NOTHING) {
              this.deleteVisualisation();
            }
          }
        }]
      ])],
      ['centerButton', new Map<string, Util.WheelEventCallback>([
        ['wheel', ($event: WheelEvent) => {
          $event.preventDefault();
          const angle = this.keyManager.alt ?
            $event.deltaY / Util.MOUSE_WHEEL_DELTA_Y : Util.ANGLE * ($event.deltaY / Util.MOUSE_WHEEL_DELTA_Y);
          if (this.keyManager.shift) {
            this.allSelfRotate(angle);
          } else {
            this.rotateAll(angle);
          }
          if (this.service.selectedElements.size !== 0) {
            this.undoRedoService.saveState();
          }
        }]
      ])],
      ['rightButton', new Map<string, Util.MouseEventCallBack>([
        ['mousedown', ($event: MouseEvent) => {
          if ($event.button === 2) {
            this.mouse.right.startPoint =
              new Point($event.offsetX, $event.offsetY);
            this.mouse.right.currentPoint =
              new Point($event.offsetX, $event.offsetY);
            this.mouse.right.mouseIsDown = true;
            const target = Util.SelectionLogicUtil.getRealTarget($event);
            this.mouse.right.selectedElement = this.elementSelectedType(
              target as SVGElement
            );
            this.selectedElementsFreezed = new Set(this.service.selectedElements);
          }
        }],
        ['mousemove', ($event: MouseEvent) => {
          if (this.mouse.right.mouseIsDown) {
            this.mouse.right.currentPoint =
              new Point($event.offsetX, $event.offsetY);
            this.drawInversion(this.mouse.right.startPoint,
              this.mouse.right.currentPoint);
            const [startPoint, currentPoint] = Util.SelectionLogicUtil.orderPoint(
              this.mouse.right.startPoint,
              this.mouse.right.currentPoint
            );
            this.applyMultipleInversion(startPoint, currentPoint);
          }
        }],
        ['mouseup', ($event: MouseEvent) => {
          if ($event.button === 2) {
            this.mouse.right.endPoint = new Point($event.offsetX, $event.offsetY);
            this.mouse.right.mouseIsDown = false;
            this.deleteInversion();
          }
        }],
        ['contextmenu', ($event: MouseEvent) => {
          $event.preventDefault();
          const target = Util.SelectionLogicUtil.getRealTarget($event);
          const type = this.elementSelectedType(target);
          if (type === BasicSelectionType.DRAW_ELEMENT) {
            this.applySingleInversion(target);
          }
        }]
      ])],
    ]);
  }

  private onCopy(): void {
    if (this.service.selectedElements.size !== 0) {
      this.service.clipboard = [new Set(this.service.selectedElements)];
    }
  }

  private onCut(): void {
    if (this.service.selectedElements.size !== 0) {
      this.service.clipboard = [new Set(this.service.selectedElements)];
      this.service.clipboard.peak().forEach((element) => {
        this.renderer.removeChild(this.svgStructure.drawZone, element);
      });
      this.deleteVisualisation();
    }
  }

  private onPaste(): void {
    if (this.service.clipboard.length !== 0) {
      while (this.service.clipboard.length > 1 && !this.clipboardValid(this.service.clipboard.peak())) {
        console.log(this.service.clipboard);
        this.service.clipboard.pop();
      }
      this.service.clipboard.push(Util.SelectionLogicUtil.clone(this.service.clipboard.peak()));
      Transform.translateAll(
        this.service.clipboard.peak(),
        Util.PASTE_TRANSLATION, Util.PASTE_TRANSLATION, this.renderer);
      const lastValidClipboard = this.service.clipboard.peak();
      lastValidClipboard.forEach((element) => {
        this.renderer.appendChild(this.svgStructure.drawZone, element);
      });
      if (!this.isInside(lastValidClipboard)) {
        const length = this.service.clipboard.length - 1;
        Transform.translateAll(
          lastValidClipboard,
          - Util.PASTE_TRANSLATION * length, -Util.PASTE_TRANSLATION * length, this.renderer);
        this.service.clipboard = [lastValidClipboard];
      }
      this.applyMultipleSelection(undefined, undefined, new Set(lastValidClipboard));
    }
  }

  private clipboardValid(clipboard: Set<SVGElement>): boolean {
    if (clipboard.size === 0) {
      return false;
    }
    for (const element of clipboard) {
      if (!this.svgStructure.drawZone.contains(element)) {
        return false;
      }
    }
    return true;
  }

  private isInside(elements: Set<SVGElement>): boolean {
    const svgZone = new Zone(0, this.svgShape.width, 0, this.svgShape.height);
    const selection = new MultipleSelection(elements, this.getSvgOffset(), undefined, undefined).getSelection();
    const selectionZone = new Zone(selection.points[0].x, selection.points[1].x, selection.points[0].y, selection.points[1].y);
    return svgZone.intersection(selectionZone)[0];
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
    const toDuplicate = Util.SelectionLogicUtil.clone(this.service.selectedElements);
    Transform.translateAll(
      toDuplicate,
      Util.PASTE_TRANSLATION, Util.PASTE_TRANSLATION, this.renderer);
    toDuplicate.forEach((element) => {
      this.renderer.appendChild(this.svgStructure.drawZone, element);
    });
    this.applyMultipleSelection(undefined, undefined, new Set(toDuplicate));
  }

  ngOnInit(): void {
    super.ngOnInit();
    [
      ['leftButton', ['mousedown', 'mousemove', 'mouseup', 'click']],
      ['rightButton', ['mousedown', 'mousemove', 'mouseup', 'contextmenu']],
      ['centerButton', ['wheel']]
    ].forEach((side: [string, string[]]) => {
      side[1].forEach((eventName: string) => {
        this.allListenners.push(
          this.renderer.listen(this.svgStructure.root, eventName,
            (this.mouseHandlers.get(side[0]) as Map<string, Util.MouseEventCallBack>)
              .get(eventName) as Util.MouseEventCallBack)
        );
      });
    });
    this.allListenners.push(
      this.renderer.listen(document, 'keydown',
        this.keyManager.handlers.keydown));
    this.allListenners.push(
      this.renderer.listen(document, 'keyup',
        this.keyManager.handlers.keyup));

    const subscriptionCopy = this.service.copy.asObservable().subscribe(() => this.onCopy());
    const subscriptionCut = this.service.cut.asObservable().subscribe(() => this.onCut());
    const subscriptionPaste = this.service.paste.asObservable().subscribe(() => this.onPaste());
    const subcriptionDelete = this.service.delete.asObservable().subscribe(() => this.onDelete());
    const subcriptionDuplicate = this.service.duplicate.asObservable().subscribe(() => this.onDuplicate());

    this.allListenners.push(() => { subcriptionDelete.unsubscribe(); });
    this.allListenners.push(() => { subscriptionPaste.unsubscribe(); });
    this.allListenners.push(() => { subscriptionCut.unsubscribe(); });
    this.allListenners.push(() => { subscriptionCopy.unsubscribe(); });
    this.allListenners.push(() => { subcriptionDuplicate.unsubscribe(); });

  }

}
