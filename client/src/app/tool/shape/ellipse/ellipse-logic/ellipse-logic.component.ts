import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ColorService} from '../../../color/color.service';
import {MathService} from '../../../mathematics/tool.math-service.service';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';
import {Ellipse} from '../../common/Ellipse';
import {Point} from '../../common/Point';
import {EllipseService} from '../ellipse.service';

enum ClickType {
  CLICKGAUCHE = 0,
}

@Component({
  selector: 'app-ellipse-logic',
  template: ''
})

export class EllipseLogicComponent extends ToolLogicDirective
  implements OnDestroy {

  private ellipses: Ellipse[] = [];
  private currentEllipseIndex = -1;
  private onDrag = false;
  private currentPoint: Point;
  private allListeners: (() => void)[] = [];

  constructor(
    private readonly service: EllipseService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
    private readonly mathService: MathService
  ) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousedown',
      (mouseEv: MouseEvent) => {
        this.initEllipse(mouseEv);
      }
    );

    const onMouseUp = this.renderer.listen(
      'document',
      'mouseup',
      (mouseEv: MouseEvent) => {
        if (mouseEv.button === ClickType.CLICKGAUCHE && this.onDrag) {
          this.viewTemporaryForm(mouseEv);
          this.getEllipse().setOpacity('1.0');
          this.onDrag = false;
        }
      }
    );

    const onMouseMove = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousemove',
      (mouseEv: MouseEvent) => {
        if (this.onDrag) {
          this.currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
          this.viewTemporaryForm(mouseEv);
        }
      }
    );

    const onKeyDown = this.renderer.listen(
      this.svgElRef.nativeElement,
      'keydown',
      (keyEv: KeyboardEvent) => this.onKeyDown(keyEv)
    );

    const onKeyUp = this.renderer.listen(
      this.svgElRef.nativeElement,
      'keyup',
      (keyEv: KeyboardEvent) => this.onKeyUp(keyEv)
    );

    this.allListeners = [
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onKeyDown,
      onKeyUp
    ];
  }

  ngOnDestroy(): void {
    this.allListeners.forEach(listener => listener());
  }

  private onKeyDown(keyEv: KeyboardEvent): void {
    if (this.onDrag) {
      if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
        this.getEllipse().simulateCircle(this.currentPoint);
      }
    }
  }

  private onKeyUp(keyEv: KeyboardEvent): void {
    if (this.onDrag) {
      if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
        this.getEllipse().simulateEllipse(this.currentPoint);
      }
    }
  }

  private getEllipse(): Ellipse {
    return this.ellipses[this.currentEllipseIndex];
  }

  private initEllipse(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      this.currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
      const ellipse = this.renderer.createElement('ellipse', this.svgNS);
      this.renderer.appendChild(this.svgElRef.nativeElement, ellipse);
      this.ellipses[++this.currentEllipseIndex] = new Ellipse(
        this.currentPoint,
        this.renderer,
        ellipse,
        this.mathService
      );
      this.getEllipse().setParameters({
        borderWidth: this.service.borderOption ?
          this.service.thickness.toString()
          : '0',
        borderColor: this.colorService.secondaryColor,
        fillColor: this.colorService.primaryColor,
        filled: this.service.fillOption
      });
      this.onDrag = true;
    }
  }

  private viewTemporaryForm(mouseEv: MouseEvent): void {
    if (mouseEv.shiftKey) {
      this.getEllipse().simulateCircle(this.currentPoint);
    } else {
      this.getEllipse().simulateEllipse(this.currentPoint);
    }
  }

}
