import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { MathService } from '../../mathematics/tool.math-service.service';
import { Offset } from '../../selection/Offset';
import { Point } from '../../selection/Point';
import { MouseTracking } from '../../selection/selection-logic/MouseTracking';
import {
  MouseEventCallBack
} from '../../selection/selection-logic/selection-logic-base';
import {
  BackGroundProperties, StrokeProperties
} from '../../shape/common/AbstractShape';
import { Rectangle } from '../../shape/common/Rectangle';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { EraserService } from '../eraser.service';

const CONSTANTS = {
  MAX_RED: 150,
  MIN_GREEN: 100,
  MIN_BLUE: 100,
  FACTOR: 50
}

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
          this.deleteAll(this.markElementsInZone($event.x, $event.y));
        }
      }
    }],
    ['mouseleave', () => {
      this.hideEraser();
      this.mouse.mouseIsDown = false;
    }]

  ]);

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    ['mousedown', 'mousemove', 'mouseup', 'click', 'mouseleave']
      .forEach((event: string) => {
        this.allListeners.push(
          this.renderer.listen(this.svgStructure.root, event,
            this.handlers.get(event) as MouseEventCallBack)
        );
      });
    this.svgStructure.root.style.cursor = 'none';
    this.renderer.appendChild(this.svgStructure.temporaryZone, this.eraser);
  }

  protected elementSelectedType(element: SVGElement): ElementSelectedType {
    return (this.svgStructure.drawZone.contains(element)) ?
      ElementSelectedType.NOTHING : ElementSelectedType.DRAW_ELEMENT;
  }

  private drawEraser(): void {
    const [startPoint, endPoint] = this.getCorners();
    const rectangleObject =
      new Rectangle(this.renderer, this.eraser, new MathService());
    rectangleObject.setParameters(BackGroundProperties.None,
      StrokeProperties.Filled);
    rectangleObject.dragRectangle(startPoint, endPoint);
    rectangleObject.setCss({
      strokeWidth: '2',
      strokeColor: 'rgba(255, 0, 0, 0.7)',
      fillColor: 'none',
      opacity: '0'
    });
  }

  private hideEraser(): void {
    this.eraser.setAttribute('width', '0');
    this.eraser.setAttribute('height', '0');
  }

  private markElementsInZone(x: number, y: number): Set<SVGElement> {
    const selectedElements = new Set<SVGElement>();
    const halfSize = this.service.size / 2;
    for (let i = x - halfSize; i <= x + halfSize; i += 5) {
      for (let j = y - halfSize; j <= y + halfSize; j += 5) {
        const element = document.elementFromPoint(i, j);
        if (element !== this.svgStructure.root && element !== this.eraser) {
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
          if (rgb.r > CONSTANTS.MAX_RED && rgb.g < CONSTANTS.MIN_GREEN
            && rgb.b < CONSTANTS.MIN_BLUE) {
            rgb.r = rgb.r - CONSTANTS.FACTOR;
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
      if (!!element) {
        this.renderer.removeChild(this.svgStructure.drawZone, element);
      }
    });
  }

  private restoreMarkedElements(): void {
    for (const entry of this.markedElements) {
      entry[0].setAttribute('stroke', entry[1]);
    }
  }

  getSvgOffset(): Offset {
    const svgBoundingRect = this.svgStructure.root.getBoundingClientRect();
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
    this.renderer.removeChild(this.svgStructure.temporaryZone, this.eraser);
    this.svgStructure.root.style.cursor = 'default';
  }

}

enum ElementSelectedType {
  DRAW_ELEMENT,
  NOTHING
}
