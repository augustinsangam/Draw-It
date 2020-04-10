import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { SelectionLogicUtil } from '../../../selection/selection-logic/selection-logic-util';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { UndoRedoService } from '../../../undo-redo/undo-redo.service';

@Component({
  selector: 'app-applicator-logic',
  template: '',
})
export class ApplicatorLogicComponent
  extends ToolLogicDirective implements OnDestroy, OnInit {

  private allListenners: (() => void)[];
  private handlers: {
    left: ($event: MouseEvent) => void,
    right: ($event: MouseEvent) => void,
  };

  constructor(private renderer: Renderer2,
              private colorService: ColorService,
              private readonly undoRedoService: UndoRedoService) {
    super();
    this.allListenners = [];
    this.undoRedoService.resetActions();
    this.initialiseHandlers();
  }

  private initialiseHandlers(): void {

    this.handlers = {
      left: ($event: MouseEvent) => {
        const target = SelectionLogicUtil.getRealTarget($event);
        if (!this.isADrawElement(target)) {
          return ;
        }
        if (this.elementHasProperty(target, 'fill')) {
          target.setAttribute('fill', this.colorService.primaryColor);
        }
        if (target instanceof SVGPathElement && this.elementHasProperty(target, 'stroke')) {
          target.setAttribute('stroke', this.colorService.primaryColor);
        }
        this.undoRedoService.saveState();
      },
      right: ($event: MouseEvent) => {
        $event.preventDefault();
        const target = $event.target as SVGElement;
        if (this.isADrawElement(target)
            && !(target instanceof SVGPathElement)) {
          target.setAttribute('stroke', this.colorService.secondaryColor
          );
          this.undoRedoService.saveState();
        }
      }
    };
  }

  private elementHasProperty(element: SVGElement,
                             property: string
  ): boolean {
    const propertyValue = element.getAttribute(property);
    return (propertyValue !== null && propertyValue !== 'none');
  }

  ngOnInit(): void {

    this.allListenners.push(
      this.renderer.listen(this.svgStructure.root, 'click',
        this.handlers.left)
    );
    this.allListenners.push(
      this.renderer.listen(this.svgStructure.root, 'contextmenu',
        this.handlers.right)
    );

    this.renderer.setStyle(this.svgStructure.root,
                           'cursor', 'crosshair');
  }

  private isADrawElement(element: SVGElement): boolean {
    return this.svgStructure.drawZone.contains(element);
  }

  ngOnDestroy(): void {
    this.allListenners.forEach((end) => end());
    this.undoRedoService.resetActions();
  }

}
