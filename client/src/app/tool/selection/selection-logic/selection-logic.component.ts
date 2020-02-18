import { Component, Renderer2, OnInit } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';
import { Point } from '../Point';
import { ElementSelectedType } from './ElementSelectedType';
import { MouseEventCallBack, SelectionLogicBase } from './SelectionLogicBase';

@Component({
  selector: 'app-selection-logic',
  template: '',
  styleUrls: ['./selection-logic.component.scss']
})
export class SelectionLogicComponent
        extends SelectionLogicBase implements OnInit {

  constructor(protected renderer: Renderer2, protected svgService: SvgService) {
    super(renderer, svgService);
  }

  private handlers = new Map<string, Map<string, MouseEventCallBack>>([
    ['leftButton', new Map<string, MouseEventCallBack>([
      ['mousedown', ($event: MouseEvent) => {
        if ($event.button === 0) {
          this.mouse.left.startPoint =
            new Point($event.offsetX, $event.offsetY);
          this.mouse.left.currentPoint =
            new Point($event.offsetX, $event.offsetY);
          this.mouse.left.mouseIsDown = true;
          this.mouse.left.selectedElement = this.elementSelectedType(
            $event.target as SVGElement
          );
          this.mouse.left.onDrag =
            this.isInTheSelectionZone($event.offsetX, $event.offsetY);
        }
      }],
      ['mousemove', ($event: MouseEvent) => {
        if (this.mouse.left.mouseIsDown) {
          if (this.mouse.left.onDrag) {
            const offsetX = $event.offsetX - this.mouse.left.currentPoint.x;
            const offsetY = $event.offsetY - this.mouse.left.currentPoint.y;
            this.mouse.left.currentPoint = new Point( $event.offsetX,
                                                      $event.offsetY);
            this.translateAll(offsetX, offsetY);
          } else {
            this.mouse.left.currentPoint = new Point( $event.offsetX,
                                                      $event.offsetY);
            this.drawSelection( this.mouse.left.startPoint,
                                this.mouse.left.currentPoint);
            if (!this.mouse.left.startPoint.equals(this.mouse.left.endPoint)) {
              const [startPoint, currentPoint] = this.orderPoint(
                this.mouse.left.startPoint, this.mouse.left.currentPoint
              );
              this.deleteVisualisation();
              this.applyMultipleSelection(startPoint, currentPoint);
            }
          }
        }
      }],
      ['mouseup', ($event: MouseEvent) => {
        if ($event.button === 0) {
          this.mouse.left.endPoint = new Point($event.offsetX, $event.offsetY);
          this.mouse.left.mouseIsDown = false;
          this.deleteSelection();
        }
      }],
      ['click', ($event: MouseEvent) => {
        if ($event.button === 0) {
          const type = this.elementSelectedType($event.target as SVGElement);
          // On s'assure d'avoir un vrai click
          if (this.mouse.left.startPoint.equals(this.mouse.left.endPoint)) {
            if (type === ElementSelectedType.DRAW_ELEMENT) {
              this.applySingleSelection($event.target as SVGElement);
            } else if (type === ElementSelectedType.NOTHING) {
              this.deleteVisualisation();
              this.selectedElements.clear();
            }
          }
        }
      }]
    ])],
    ['rightButton', new Map<string, MouseEventCallBack>([
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
          this.selectedElementsFreezed = new Set(this.selectedElements);
        }
      }],
      ['mousemove', ($event: MouseEvent) => {
        if (this.mouse.right.mouseIsDown) {
          this.mouse.right.currentPoint =
            new Point($event.offsetX, $event.offsetY);
          this.drawInversion(this.mouse.right.startPoint,
            this.mouse.right.currentPoint);
          const [startPoint, currentPoint] = this.orderPoint(
            this.mouse.right.startPoint, this.mouse.right.currentPoint
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
        $event.stopImmediatePropagation();
        // On s'assure d'avoir un vrai click
        if (this.mouse.right.startPoint.equals(this.mouse.right.endPoint)) {
          const type = this.elementSelectedType($event.target as SVGElement);
          if (type === ElementSelectedType.DRAW_ELEMENT) {
            this.applySingleInversion($event.target as SVGElement);
          };
        }
      }]
    ])],
  ]);

  ngOnInit() {
    super.ngOnInit();
    [['leftButton', ['mousedown', 'mousemove', 'mouseup', 'click']],
      ['rightButton', ['mousedown', 'mousemove', 'mouseup', 'contextmenu']]]
    .forEach((side: [string, string[]]) => {
      side[1].forEach((eventName: string) => {
        this.allListenners.push(
          this.renderer.listen(this.svgElRef.nativeElement, eventName,
            (this.handlers.get(side[0]) as Map<string, MouseEventCallBack>)
            .get(eventName) as MouseEventCallBack)
        );
      });
    });
  }

}
