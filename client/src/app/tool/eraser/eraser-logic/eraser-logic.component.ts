import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { Offset } from '../../selection/Offset';
import { Point } from '../../selection/Point';
import { MouseTracking } from '../../selection/selection-logic/MouseTracking';
import {
  MouseEventCallBack
} from '../../selection/selection-logic/SelectionLogicBase';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { EraserService } from '../eraser.service';

@Component({
  selector: 'app-eraser-logic',
  templateUrl: './eraser-logic.component.html',
  styleUrls: ['./eraser-logic.component.scss']
})
export class EraserLogicComponent
  extends ToolLogicDirective implements OnDestroy {

  private mouse: MouseTracking;
  private eraser: SVGRectElement;
  private allListeners: (() => void)[];
  private markedElements: Map<SVGElement, string>;

  constructor(private renderer: Renderer2,
              private service: EraserService,
              private colorService: ColorService) {
    super();
    this.eraser = this.renderer.createElement('rect', this.svgNS);
    this.allListeners = [];
    const fakePoint = new Point(0, 0);
    this.mouse = {
        startPoint: fakePoint, currentPoint: fakePoint, endPoint: fakePoint,
        mouseIsDown: false, selectedElement: ElementSelectedType.NOTHING,
        onDrag: false
    };
    this.markedElements = new Map();
  }

  private handlers = new Map<string, MouseEventCallBack>([
    ['mousedown', ($event: MouseEvent) => {
      if ($event.button === 0) {
        this.mouse.startPoint = new Point($event.offsetX, $event.offsetY);
        this.mouse.mouseIsDown = true;
      }
    }],
    ['mousemove', ($event: MouseEvent) => {
      this.deleteEraser();
      this.restoreMarkedElements();
      const selectedElements = this.markElementsInZone($event.x, $event.y);
      this.mouse.currentPoint = new Point($event.offsetX, $event.offsetY);
      if (this.mouse.mouseIsDown) {
        this.deleteAll(selectedElements);
      }
      this.drawEraser();

    }],
    ['mouseup', ($event: MouseEvent) => {
      if ($event.button === 0) {
        this.mouse.mouseIsDown = false;
        this.mouse.endPoint = new Point($event.offsetX, $event.offsetY);
      }
    }],
    ['click', ($event: MouseEvent) => {
      if ($event.button === 0) {
        // On s'assure d'avoir un vrai click
        if (this.mouse.startPoint.equals(this.mouse.endPoint)) {
          this.deleteEraser();
          this.deleteAll(this.markElementsInZone($event.x, $event.y));
          this.drawEraser();
        }
      }
    }],
    ['mouseleave', () => {
      this.deleteEraser();
    }]

  ]);

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    ['mousedown', 'mousemove', 'mouseup', 'click', 'mouseleave']
    .forEach((event: string) => {
      this.allListeners.push(
        this.renderer.listen(this.svgElRef.nativeElement, event,
          this.handlers.get(event) as MouseEventCallBack)
      );
    });
    this.renderer.setStyle(this.svgElRef.nativeElement, 'cursor', 'none');
  }

  protected elementSelectedType(element: SVGElement): ElementSelectedType {
    return (element === this.svgElRef.nativeElement) ?
      ElementSelectedType.NOTHING : ElementSelectedType.DRAW_ELEMENT;
  }

  private drawEraser(): void {
    const rec = this.eraser;
    const [p1, p2] = this.getCorners();
    rec.setAttribute('x', p1.x.toString());
    rec.setAttribute('y', p1.y.toString());
    rec.setAttribute('width', (p2.x - p1.x).toString());
    rec.setAttribute('height', (p2.y - p1.y).toString());
    rec.setAttribute('fill', 'white');
    rec.setAttribute('stroke', 'rgba(255, 0, 0, 0.7)');
    rec.setAttribute('stroke-width', '2');
    this.renderer.appendChild(this.svgElRef.nativeElement, rec);
  }

  private deleteEraser(): void {
    this.eraser.setAttribute('x', '0');
    this.eraser.setAttribute('y', '0');
    this.renderer.removeChild(this.svgElRef.nativeElement, this.eraser);
  }

  private markElementsInZone(x: number, y: number): Set<SVGElement> {
    const selectedElements = new Set<SVGElement>();
    const halfSize = this.service.size / 2;
    for (let i = x - halfSize; i <= x + halfSize; i += 5) {
      for (let j = y - halfSize; j <= y + halfSize; j += 5) {
        const element = document.elementFromPoint(i, j);
        if (element !== this.svgElRef.nativeElement) {
          selectedElements.add(element as SVGElement);
        }
      }
    }

    this.markedElements.clear();
    selectedElements.forEach((element: SVGElement) => {
      if (!!element) {
        const stroke = element.getAttribute('stroke');
        let strokeModified = 'rgba(255, 0, 0, 1)';
        if (stroke !== null && stroke !== 'none') {
          const rgb = this.colorService.rgbFormRgba(stroke);
          // Si on a beaucoup de rouge mais pas trop les autres couleurs
          if (rgb.r > 150 && rgb.g < 100 && rgb.b < 100 ) {
            rgb.r = rgb.r - 50;
            strokeModified = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
          }
        }
        this.markedElements.set(element, stroke as string);
        element.setAttribute('stroke', strokeModified);
      }
    });
    return selectedElements;
  }

  private deleteAll(elements: Set<SVGElement>) {
    elements.forEach((element) => {
      this.renderer.removeChild(this.svgElRef.nativeElement, element);
    })
  }

  private restoreMarkedElements(): void {
    for (const entry of  this.markedElements) {
      entry[0].setAttribute('stroke', entry[1]);
    }
  }

  getSvgOffset(): Offset {
    const svgBoundingRect = this.svgElRef.nativeElement.getBoundingClientRect();
    return { top: svgBoundingRect.top, left: svgBoundingRect.left };
  }

  private getCorners(): [Point, Point] {
    const halfSize = this.service.size / 2;
    const startPoint = new Point(
      this.mouse.currentPoint.x - halfSize,
      this.mouse.currentPoint.y - halfSize,
    );
    const endPoint = new Point(
      this.mouse.currentPoint.x + halfSize,
      this.mouse.currentPoint.y + halfSize,
    );
    return [startPoint, endPoint];
  }

  ngOnDestroy() {
    this.allListeners.forEach(end => end());
    this.renderer.removeChild(this.svgElRef.nativeElement, this.eraser);
    this.renderer.setStyle(this.svgElRef.nativeElement, 'cursor', 'default');
  }

}

enum ElementSelectedType {
  DRAW_ELEMENT,
  NOTHING
}
