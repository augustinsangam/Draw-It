import { Component, OnInit, Renderer2 } from '@angular/core';
import { GridService } from '../../tool/grid/grid.service';
import { Point } from '../../tool/shape/common/point';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { SelectionService } from '../selection.service';
import { CircleType } from './circle-type';
import { Clipboard } from './clipboard';
import { Deplacement } from './deplacement';
import { BasicSelectionType } from './element-selected-type';
import { Rotation } from './rotation';
import { Scale } from './scale';
import { SelectionLogicBase } from './selection-logic-base';
import * as Util from './selection-logic-util';

const NOT_FOUND = -1;

@Component({
  selector: 'app-selection-logic',
  template: ''
})
export class SelectionLogicComponent
  extends SelectionLogicBase implements OnInit {

  private mouseHandlers: Map<string, Map<string, Util.MouseEventCallBack>>;
  private scaleUtil: Scale;
  private clipboard: Clipboard;
  deplacement: Deplacement;

  constructor(readonly renderer: Renderer2,
              readonly undoRedoService: UndoRedoService,
              readonly service: SelectionService,
              readonly gridService: GridService
  ) {
    super(renderer, undoRedoService, service, gridService);
    this.initialiseHandlers();
    this.scaleUtil = new Scale(this);
    this.clipboard = new Clipboard(this);
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
            this.mouse.left.selectedElement as CircleType
          ) !== NOT_FOUND;
          if (this.svgStructure.drawZone.contains(target as SVGElement)
            && !this.service.selectedElements.has(target as SVGElement)) {
            this.applySingleSelection(target as SVGElement);
          }
          this.scaleUtil.onMouseDown();
        }],
        ['mousemove', ($event: MouseEvent) => {
          $event.preventDefault();
          if (!this.mouse.left.mouseIsDown) {
            return;
          }
          const previousCurrentPoint = new Point(this.mouse.left.currentPoint.x, this.mouse.left.currentPoint.y);
          this.mouse.left.currentPoint = new Point($event.offsetX,
            $event.offsetY);

          if (this.mouse.left.onDrag && !this.mouse.left.onResize) {

            const offsetX = $event.offsetX - previousCurrentPoint.x;
            const offsetY = $event.offsetY - previousCurrentPoint.y;
            if (this.service.magnetActive) {
              this.deplacement.onCursorMove();
            } else {
              this.translateAll(offsetX, offsetY);
            }

          } else if (this.mouse.left.onResize) {

            this.scaleUtil.onMouseMove(previousCurrentPoint);

          } else {
            this.drawSelection(this.mouse.left.startPoint,
              this.mouse.left.currentPoint);
            const [startPoint, currentPoint] = Util.SelectionLogicUtil.orderPoint(
              this.mouse.left.startPoint, this.mouse.left.currentPoint
            );
            this.applyMultipleSelection(startPoint, currentPoint);
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
          if (!this.mouse.left.startPoint.equals(this.mouse.left.endPoint)) {
            return;
          }
          const target = Util.SelectionLogicUtil.getRealTarget($event);
          const elementType = this.elementSelectedType(target as SVGElement);
          if (elementType === BasicSelectionType.DRAW_ELEMENT) {
            this.applySingleSelection(target as SVGElement);
          } else if (elementType === BasicSelectionType.NOTHING) {
            this.deleteVisualisation();
          }
        }]
      ])],
      ['centerButton', new Map<string, Util.WheelEventCallback>([
        ['wheel', ($event: WheelEvent) => {
          $event.preventDefault();
          new Rotation(this).onRotate($event);
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

    this.deplacement = new Deplacement(this);

    const subscriptionCopy      = this.service.copy.     asObservable()
                                  .subscribe(() => this.clipboard.copy());
    const subscriptionCut       = this.service.cut.      asObservable()
                                  .subscribe(() => this.clipboard.cut());
    const subscriptionPaste     = this.service.paste.    asObservable()
                                  .subscribe(() => this.clipboard.paste());
    const subcriptionDelete     = this.service.delete.   asObservable()
                                  .subscribe(() => this.clipboard.delete());
    const subcriptionDuplicate  = this.service.duplicate.asObservable()
                                  .subscribe(() => this.clipboard.duplicate());

    this.allListenners.push(() => { subcriptionDelete.unsubscribe(); });
    this.allListenners.push(() => { subscriptionPaste.unsubscribe(); });
    this.allListenners.push(() => { subscriptionCut.unsubscribe(); });
    this.allListenners.push(() => { subscriptionCopy.unsubscribe(); });
    this.allListenners.push(() => { subcriptionDuplicate.unsubscribe(); });

  }

}
