import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import {UndoRedoService} from '../../undo-redo/undo-redo.service';

@Component({
  selector: 'app-applicator-logic',
  templateUrl: './applicator-logic.component.html',
  styleUrls: ['./applicator-logic.component.scss']
})
export class ApplicatorLogicComponent
  extends ToolLogicDirective implements OnDestroy {

  private allListenners: (() => void)[];

  constructor(private renderer: Renderer2,
              private colorService: ColorService,
              private readonly undoRedoService: UndoRedoService) {
    super();
    this.allListenners = [];
    this.undoRedoService.resetActions();
  }

  private handlers = {
    left: ($event: MouseEvent) => {
      if (this.isSvgElement($event.target as SVGElement)) {
        if ($event.target instanceof SVGPathElement) {
            ($event.target as SVGElement)
          .setAttribute('stroke', this.colorService.primaryColor);
            this.undoRedoService.saveState();
        } else {
          const fill = ($event.target as SVGElement).getAttribute('fill');
          const isFilled = (fill !== null && fill !== 'none');
          if (isFilled) {
            ($event.target as SVGElement)
            .setAttribute('fill', this.colorService.primaryColor);
            this.undoRedoService.saveState();
          }
        }
      }
    },
    right: ($event: MouseEvent) => {
      $event.preventDefault();
      if (this.isSvgElement($event.target as SVGElement)
        && !($event.target instanceof SVGPathElement)) {
        ($event.target as SVGElement)
        .setAttribute('stroke', this.colorService.secondaryColor);
        this.undoRedoService.saveState();
      }
    }
  };

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {

    this.allListenners.push(
      this.renderer.listen(this.svgStructure.root, 'click',
        this.handlers.left)
    );
    this.allListenners.push(
      this.renderer.listen(this.svgStructure.root, 'contextmenu',
        this.handlers.right)
    );

    this.svgStructure.root.style.cursor = 'crosshair';
  }

  private isSvgElement(element: SVGElement): boolean {
    return element !== this.svgStructure.root;
  }

  ngOnDestroy() {
    this.allListenners.forEach((end) => {end()});
    this.undoRedoService.resetActions();
  }

}