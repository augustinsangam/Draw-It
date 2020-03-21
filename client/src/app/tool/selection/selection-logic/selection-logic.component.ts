import { Component, OnInit, Renderer2 } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';
import { Point } from '../../shape/common/point';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { SelectionService } from '../selection.service';
import { BasicSelectionType } from './element-selected-type';
import { SelectionLogicBase } from './selection-logic-base';
import * as Util from './selection-logic-util';

@Component({
  selector: 'app-selection-logic',
  template: ''
})
export class SelectionLogicComponent
  extends SelectionLogicBase implements OnInit {

  private mouseHandlers: Map<string, Map<string, Util.MouseEventCallBack>>;

  constructor(protected renderer: Renderer2,
              protected svgService: SvgService,
              protected undoRedoService: UndoRedoService,
              protected service: SelectionService
  ) {
    super(renderer, svgService, undoRedoService, service);
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
          this.mouse.left.selectedElement = this.elementSelectedType(
            $event.target as SVGElement
          );
          this.mouse.left.onDrag = this.isInTheVisualisationZone(
            $event.offsetX,
            $event.offsetY
          );
          if (this.svgStructure.drawZone.contains($event.target as SVGElement)
            && !this.service.selectedElements.has($event.target as SVGElement)) {
            this.applySingleSelection($event.target as SVGElement);
          }
        }],
        ['mousemove', ($event: MouseEvent) => {
          if (this.mouse.left.mouseIsDown) {
            const previousCurrentPoint = this.mouse.left.currentPoint;
            this.mouse.left.currentPoint = new Point($event.offsetX,
              $event.offsetY);
            if (this.mouse.left.onDrag) {
              const offsetX = $event.offsetX - previousCurrentPoint.x;
              const offsetY = $event.offsetY - previousCurrentPoint.y;
              this.translateAll(offsetX, offsetY);
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
            return ;
          }
          if (this.mouse.left.onDrag &&
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
            return ;
          }
          if (this.mouse.left.startPoint.equals(this.mouse.left.endPoint)) {
            const elementType = this.elementSelectedType($event.target as SVGElement);
            if (elementType === BasicSelectionType.DRAW_ELEMENT) {
              this.applySingleSelection($event.target as SVGElement);
            } else if (elementType === BasicSelectionType.NOTHING) {
              this.deleteVisualisation();
            }
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
            this.mouse.right.selectedElement = this.elementSelectedType(
              $event.target as SVGElement
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
          const type = this.elementSelectedType($event.target as SVGElement);
          if (type === BasicSelectionType.DRAW_ELEMENT) {
            this.applySingleInversion($event.target as SVGElement);
          }
        }]
      ])],
    ]);
  }

  ngOnInit(): void {
    super.ngOnInit();
    [['leftButton', ['mousedown', 'mousemove', 'mouseup', 'click']],
    ['rightButton', ['mousedown', 'mousemove', 'mouseup', 'contextmenu']]]
      .forEach((side: [string, string[]]) => {
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
  }

}
