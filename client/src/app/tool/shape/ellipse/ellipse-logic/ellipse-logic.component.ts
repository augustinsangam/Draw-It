import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ColorService} from '../../../color/color.service';
import {MathService} from '../../../mathematics/tool.math-service.service';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';
import {Ellipse} from '../../common/Ellipse';
import {EllipseService} from '../ellipse.service';
import {Point} from '../../common/Point';

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
  private allListeners: (() => void)[] = [];
  private onDrag = false;
  private currentEllipseIndex = -1;
  private currentPoint: Point;

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
      'mouseDown',
      (mouseEv: MouseEvent) => {
        this.initRectangle(mouseEv);
      }
    );

    const onMouseUp = this.renderer.listen(
      'document',
      'mouseUp',
      (mouseEv: MouseEvent) => {
        if (mouseEv.button === ClickType.CLICKGAUCHE && this.onDrag) {
          this.viewTemporaryForm(mouseEv);
          this.getEllipse().setOpacity(1.0);
          this.onDrag = false;
        }
      }
    );

    const onMouseMove = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mouseMove',
      (mouseEv: MouseEvent) => {
        if (this.onDrag === true) {
          this.currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
          this.viewTemporaryForm(mouseEv);
        }
      }
    );

    const onKeyDown = this.renderer.listen(
      this.svgElRef.nativeElement,
      'keyDown',
      (keyEv: KeyboardEvent) => this.onKeyDown(keyEv)
    );

    const onKeyUp = this.renderer.listen(
      this.svgElRef.nativeElement,
      'keyUp',
      (keyEv: KeyboardEvent) => this.onKeyUp(keyEv)
    );

    this.allListeners = [
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onKeyDown,
      onKeyUp
    ]
  }

  ngOnDestroy(): void {
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

  private initRectangle(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      this.currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
      const ellipse = this.renderer.createElement('ellipse', this.svgNS);
      this.renderer.appendChild(this.svgElRef.nativeElement, ellipse);
      this.ellipses[++this.currentEllipseIndex] = new Ellipse(
        // TODO
      );
      this.getEllipse().setParameters({
        // TODO
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
