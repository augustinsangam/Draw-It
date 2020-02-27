import {Component, OnDestroy, Renderer2} from '@angular/core';
import html2canvas from 'html2canvas';
import {ColorService} from '../../color/color.service';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {PipetteService} from '../pipette.service';

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
    private readonly colorService: ColorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.svgStructure.root.style.cursor = 'wait';

    html2canvas(this.svgStructure.root as unknown as HTMLElement).then(
      (value) => {
        this.image = value.getContext('2d') as CanvasRenderingContext2D;
      }
    );

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

    this.renderer.setStyle(
      this.svgStructure.root,
      'cursor',
      'crosshair'
    );

    this.backgroundColorOnInit = this.colorService.backgroundColor;
    this.svgStructure.root.style.cursor = 'crosshair';

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
      this.ngOnInit()
    }

    if (this.image != null) {
      const pixel = this.image.getImageData(
        mouseEv.offsetX,
        mouseEv.offsetY,
        1,
        1
      ).data;
      this.service.currentColor = 'rgba(' +
        pixel[0].toString() + ',' +
        pixel[1].toString() + ',' +
        pixel[2].toString() + ',' +
        pixel[3].toString() +
      ')';
    }
  }

  ngOnDestroy(): void {
    this.allListeners.forEach(end => end());
  }

}