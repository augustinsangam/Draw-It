import { Component, Renderer2, } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { Point } from '../../tool-common classes/Point'
import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { RectangleService } from '../rectangle.service';
import { Rectangle } from './Rectangle';

enum ClickType {
  CLICKGAUCHE = 0,
  CLICKDROIT = 1
};

@Component({
  selector: 'app-rectangle-logic',
  templateUrl: './rectangle-logic.component.html',
  styleUrls: ['./rectangle-logic.component.scss']
})
export class RectangleLogicComponent extends ToolLogicComponent {

  private rectangles: Rectangle[] = [];
  private currentRectangleIndex = -1;
  private onDrag = false;
  private currentPoint: Point;
  private allListeners: (() => void)[] = [];

  constructor(private readonly service: RectangleService,
              private readonly renderer: Renderer2,
              private readonly colorService: ColorService) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    const onMouseDown = this.renderer.listen(this.svgElRef.nativeElement, 'mousedown', (mouseEv: MouseEvent) => {
      this.initRectangle(mouseEv);
    });

    const onMouseMove = this.renderer.listen(this.svgElRef.nativeElement, 'mousemove', (mouseEv: MouseEvent) => {
      if (this.onDrag) {
        this.currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
        this.viewTemporaryForm(mouseEv)
      }
    }
    );

    const onMouseUp = this.renderer.listen('document', 'mouseup', (mouseEv: MouseEvent) => {
      if (mouseEv.button === ClickType.CLICKGAUCHE && this.onDrag) {
        this.onDrag = false;
        this.viewTemporaryForm(mouseEv)
        this.getRectangle().setOpacity('1.0')
      }
    }
    );

    const onKeyDown = this.renderer.listen('document', 'keydown', (keyEv: KeyboardEvent) => {
      if (this.onDrag) {
        if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
          this.getRectangle().drawTemporarySquare(this.currentPoint)
        }
      }
    });

    const onKeyUp = this.renderer.listen('document', 'keyup', (keyEv: KeyboardEvent) => {
      if (this.onDrag) {
        if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
          this.getRectangle().drawTemporaryRectangle(this.currentPoint)
        }
      }
    });
    this.allListeners = [onMouseDown, onKeyDown, onKeyUp, onMouseMove, onMouseUp]
  }

  getRectangle(): Rectangle {
    return this.rectangles[this.currentRectangleIndex];
  }
  initRectangle(mouseEv: MouseEvent) {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      this.currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
      const rectangle = this.renderer.createElement('rect', this.svgNS);
      this.renderer.appendChild(this.svgElRef.nativeElement, rectangle);
      this.rectangles[++this.currentRectangleIndex] = new Rectangle(this.currentPoint, this.renderer, rectangle);
      this.getRectangle().setParameters({
        borderWidth: (this.service.borderOption) ? this.service.thickness.toString() : '0',
        borderColor: this.colorService.secondaryColor,
        fillColor: this.colorService.primaryColor,
        filled: this.service.fillOption,
      });
      this.onDrag = true;
    }
  }
  viewTemporaryForm(mouseEv: MouseEvent) {
    if (mouseEv.shiftKey) {
      this.getRectangle().drawTemporarySquare(this.currentPoint)
    } else {
      this.getRectangle().drawTemporaryRectangle(this.currentPoint);
    }
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.allListeners.forEach(listenner => {
      listenner();
    });
  }

}
