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
    const onMouseDown = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousedown',
      (mouseEv: MouseEvent) => {
        const canvas: HTMLCanvasElement = html2canvas(this.svgElRef);
        canvas.getContext('2b');
      }
  );

    const onMouseMove = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousemove',
      (mouseEv: MouseEvent) => {
        console.log('mousemoved');
      }
    );

    this.allListeners = [
      onMouseDown,
      onMouseMove
    ]
  }

  ngOnDestroy(): void {
  }

}
