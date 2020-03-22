import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SvgToCanvas } from 'src/app/svg-to-canvas/svg-to-canvas';
import { ColorService } from '../../color/color.service';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { PipetteService } from '../pipette.service';

@Component({
  selector: 'app-pipette-logic',
  template: ''
})

export class PipetteLogicComponent extends ToolLogicDirective
  implements OnInit, OnDestroy {

  private allListeners: (() => void)[] = [];
  private image: CanvasRenderingContext2D;
  private backgroundColorOnInit: string;

  constructor(
    private readonly service: PipetteService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
    private readonly undoRedoService: UndoRedoService,
  ) {
    super();

    this.undoRedoService.resetActions();
    this.undoRedoService.setPostUndoAction({
      functionDefined: true,
      function: () => this.initialiseImage()
    });
    this.undoRedoService.setPostRedoAction({
      functionDefined: true,
      function: () => this.initialiseImage()
    });
  }

  ngOnInit(): void {
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'wait');

    this.initialiseImage();

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

  private initialiseImage(): void {
    const svg = this.renderer.createElement('svg', this.svgNS);
    this.renderer.setAttribute(svg, 'height', this.svgShape.height.toString());
    this.renderer.setAttribute(svg, 'width', this.svgShape.width.toString());
    this.renderer.setStyle(svg, 'background-color', this.svgShape.color);
    this.renderer.appendChild(svg, this.svgStructure.defsZone.cloneNode(true));
    this.renderer.appendChild(svg, this.svgStructure.drawZone.cloneNode(true));

    new SvgToCanvas(svg, this.svgShape, this.renderer).getCanvas()
    .then((canvas) => {
      this.image = canvas.getContext('2d') as CanvasRenderingContext2D;
    });
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
      this.initialiseImage();
    }

    const pixel = this.image.getImageData(
      mouseEv.offsetX,
      mouseEv.offsetY,
      1,
      1
    ).data;
    // simplement pour accéder à la 4è valeur du pixel[3] qui correspond au alpha
    // tslint:disable-next-line:no-magic-numbers
    this.service.currentColor = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3] / 255})`;
  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
    this.undoRedoService.resetActions();
  }

}
