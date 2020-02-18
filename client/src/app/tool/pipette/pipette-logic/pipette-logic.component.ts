import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ColorService} from '../../color/color.service';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {PipetteService} from '../pipette.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pipette-logic',
  templateUrl: './pipette-logic.component.html',
  styleUrls: ['./pipette-logic.component.scss']
})

// tslint:disable:use-lifecycle-interface
export class PipetteLogicComponent extends ToolLogicDirective
  implements OnDestroy {

  private allListeners: (() => void)[] = [];

  constructor(
    private readonly service: PipetteService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
  ) {
    super();
  }

  ngOnInit(): void {

    const onMouseClick = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousedown',
      (mouseEv: MouseEvent) => {
        let svgEl: HTMLElement;
        let newColor: string | null = 'rgba(0,0,0,1)';

        // background
        if (mouseEv.target instanceof SVGSVGElement) {
          newColor = mouseEv.target.style.backgroundColor;
        } else {
          svgEl = mouseEv.target as unknown as HTMLElement;
          console.log(svgEl);
          html2canvas(svgEl).then(value => {
            const context = value.getContext('2d');
            if (!!context) {
              const pixel = context.getImageData(
                mouseEv.offsetX,
                mouseEv.offsetY,
                1,
                1
              ).data;
              newColor = 'rgba(' +
                pixel[0].toString() + ',' +
                pixel[1].toString() + ',' +
                pixel[2].toString() + ',' +
                pixel[3].toString() +
              ')';
            }
          });
        }

        if (newColor != null) {
          this.service.currentColor = newColor;
        } else {
          console.log('color was null');
        }
      });

    const onMouseMove = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousemove',
      (mouseEv: MouseEvent) => {
        console.log('mousemoved');
      }
    );

    this.allListeners = [
      onMouseClick,
      onMouseMove
    ]
  }

  ngOnDestroy(): void {
    this.allListeners.forEach(listener => listener());
  }
}
