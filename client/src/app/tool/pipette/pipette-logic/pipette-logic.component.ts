import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { SvgToCanvasService } from 'src/app/svg-to-canvas/svg-to-canvas.service';
import { ColorService } from '../../color/color.service';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { PipetteService } from '../pipette.service';
import {UndoRedoService} from '../../undo-redo/undo-redo.service';

@Component({
  selector: 'app-pipette-logic',
  template: ''
})

// tslint:disable:use-lifecycle-interface
export class PipetteLogicComponent extends ToolLogicDirective
  implements OnDestroy {

  private allListeners: (() => void)[] = [];
  private image: CanvasRenderingContext2D;
  private backgroundColorOnInit: string;

  constructor(
    private readonly service: PipetteService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
    private readonly svgToCanvas: SvgToCanvasService,
    private readonly undoRedoService: UndoRedoService,
  ) {
    super();

    this.undoRedoService.resetActions();
    this.undoRedoService.setPostUndoAction({
      functionDefined: true,
      function: () => this.ngOnInit()
    });
    this.undoRedoService.setPostRedoAction({
      functionDefined: true,
      function: () => this.ngOnInit()
    });
  }

  ngOnInit(): void {
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'wait');

    this.image = this.svgToCanvas.getCanvas(this.renderer)
                    .getContext('2d') as CanvasRenderingContext2D;

    const onLeftClick = this.renderer.listen(
      this.svgStructure.root,
      'click',
      (mouseEv: MouseEvent) => this.onMouseClick(mouseEv)
    );

    const onRightClick = this.renderer.listen(
      this.svgStructure.root,
      'contextmenu',
      (mouseEv: MouseEvent) => this.onMouseClick(mouseEv)
    );

    const onMouseMove = this.renderer.listen(
      this.svgStructure.root,
      'mousemove',
      (mouseEv: MouseEvent) => this.onMouseMove(mouseEv)
    );

    this.allListeners = [
      onLeftClick,
      onMouseMove,
      onRightClick
    ];

    this.backgroundColorOnInit = this.colorService.backgroundColor;
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'crosshair');

  }

  private onMouseClick(mouseEv: MouseEvent): void {
    if (mouseEv.button === 0) {
      this.colorService.selectPrimaryColor(this.service.currentColor);
    } else if (mouseEv.button === 2) {
      mouseEv.preventDefault();
      this.colorService.selectSecondaryColor(this.service.currentColor);
    }
  }

  private onMouseMove(mouseEv: MouseEvent): void {
    if (this.colorService.backgroundColor !== this.backgroundColorOnInit) {
      this.ngOnInit();
    }

    if (this.image != null) {
      const pixel = this.image.getImageData(
        mouseEv.offsetX,
        mouseEv.offsetY,
        1,
        1
      ).data;
      // simplement pour accéder à la 4è valeur du pixel[3] qui correspond au alpha
      // tslint:disable-next-line:no-magic-numbers
      this.service.currentColor = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3]})`;
    }
  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
    this.undoRedoService.resetActions();
  }

}
