import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-selection-logic',
  templateUrl: './selection-logic.component.html',
  styleUrls: ['./selection-logic.component.scss']
})
export class SelectionLogicComponent
  extends ToolLogicDirective implements OnDestroy {

  private boudingRect: ElementRef<SVGElement>;
  private allListenners: (() => void)[];

  private startPoint: Point;
  private currentPoint: Point;
  private endPoint: Point;
  private mouseIsDown: boolean;

  private handlers = {
    click: ($event: MouseEvent) => {
      if ($event.target !== this.svgElRef.nativeElement
        && this.samePoint(this.startPoint, this.endPoint) ) {
        this.createRectangle($event.target as SVGElement);
      } else if (!this.samePoint(this.startPoint, this.endPoint)) {
        this.drawRectangle(this.startPoint, {
          width: this.currentPoint.x - this.startPoint.x,
          height: this.currentPoint.y - this.startPoint.y
        });
      } else {
        this.deleteRectangle();
        console.log('On supprime tout');
      }
    },

    mousedown: ($event: MouseEvent) => {
      this.startPoint = {
        x : $event.x,
        y : $event.y
      };
      this.mouseIsDown = true;
    },

    mousemouve: ($event: MouseEvent) => {
      if (this.mouseIsDown) {
        this.currentPoint = {
          x : $event.x,
          y : $event.y
        };
        this.drawRectangle(this.startPoint, {
          width: this.currentPoint.x - this.startPoint.x,
          height: this.currentPoint.y - this.startPoint.y
        });
      }
    },

    mouseup: ($event: MouseEvent) => {
      this.endPoint = {
        x : $event.x,
        y : $event.y
      };
      this.mouseIsDown = false;
    }

  }

  constructor(private renderer: Renderer2) {
    super();
    this.boudingRect = new ElementRef(
      this.renderer.createElement('rect', this.svgNS)
    );
    this.allListenners = [];
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.mouseIsDown = false;
    this.renderer.setStyle(this.svgElRef.nativeElement, 'cursor', 'default');

    this.allListenners.push(
      this.renderer.listen(this.svgElRef.nativeElement,
      'click', this.handlers.click)
    );

    this.allListenners.push(
      this.renderer.listen(this.svgElRef.nativeElement,
        'mousedown', this.handlers.mousedown)
    );

    this.allListenners.push(
      this.renderer.listen(this.svgElRef.nativeElement,
        'mousemove', this.handlers.mousemouve)
    );

    this.allListenners.push(
      this.renderer.listen(this.svgElRef.nativeElement,
        'mouseup', this.handlers.mouseup)
    );

    this.renderer.appendChild(this.svgElRef.nativeElement,
      this.boudingRect.nativeElement);

  }

  private createRectangle(element: SVGElement): void {
    const offset: Offset = {
      left: this.svgElRef.nativeElement.getBoundingClientRect().left,
      top: this.svgElRef.nativeElement.getBoundingClientRect().top,
    }
    const thikness = this.getThikness(element);
    console.log(thikness);
    const domRec = element.getBoundingClientRect();

    const startingPoint: Point = {
      x : domRec.left - offset.left - thikness / 2,
      y : domRec.top - thikness / 2
    }

    const offsetIncrement = this.getOffsetIncrement(element);

    const dimensions: Dimensions = {
      width: (domRec.width + thikness + offsetIncrement.left),
      height: (domRec.height + thikness + + offsetIncrement.top)
    }

    this.drawRectangle(startingPoint, dimensions);
  }

  private getOffsetIncrement(element: SVGElement): Offset {
    return element.classList.contains('filter1') ? {
        left : this.getThikness(element),
        top : this.getThikness(element)
      } : {
        left : 0,
        top : 0
      }
  }

  private getThikness(element: SVGElement): number {
    const strokeWidthAttribute = element.getAttribute('stroke-width');
    if (!!strokeWidthAttribute) {
      return parseInt(
        strokeWidthAttribute as string, 10
      );
    } else {
      return parseInt(
        element.style.strokeWidth, 10
      );
    }
  }

  private drawRectangle(startingPoint: Point, dimensions: Dimensions) {
    const rec = this.boudingRect.nativeElement;
    rec.setAttribute('x', startingPoint.x.toString());
    rec.setAttribute('y', startingPoint.y.toString());
    rec.setAttribute('width', dimensions.width.toString());
    rec.setAttribute('height', dimensions.height.toString());
    rec.setAttribute('fill', 'none');
    rec.setAttribute('stroke', 'rgba(128, 128, 128, 0.7)');
    rec.setAttribute('stroke-width', '5');
    rec.setAttribute('stroke-dasharray', '10 5');
  }

  private deleteRectangle(): void {
    this.boudingRect.nativeElement.setAttribute('width', '0');
    this.boudingRect.nativeElement.setAttribute('height', '0');
  }

  private samePoint(p1: Point, p2: Point): boolean {
    return p1.x === p2.x && p1.y === p2.y;
  }

  ngOnDestroy() {
    this.allListenners.forEach(end => {
      end();
    });
    this.renderer.removeChild(this.svgElRef.nativeElement,
                              this.boudingRect.nativeElement);
  }

}

interface Offset {
  left: number,
  top: number
}

interface Point {
  x: number,
  y: number,
}

interface Dimensions {
  width: number,
  height: number
}
