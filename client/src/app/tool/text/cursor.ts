import {Renderer2} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {Point} from '../shape/common/point';
import {TextLine} from './text-line';
import {TextService} from './text.service';

// tslint:disable:use-lifecycle-interface
export class Cursor {

  frequency: Observable<number>;
  blinker: Subscription;
  visible: boolean;
  tmpTextZone: SVGElement;
  currentPosition: Point;
  initialCursorPoint: Point;
  readonly CURSOR_INTERVAL: number = 500;

  constructor(private readonly renderer: Renderer2,
              private readonly service: TextService,
              private element: SVGElement,
              initialPoint: Point,
  ) {
    this.visible = true;
    this.currentPosition = initialPoint;
    this.initialCursorPoint = new Point(initialPoint.x, initialPoint.y);
    this.blinker = Subscription.EMPTY;
    this.tmpTextZone = this.renderer.createElement('text', 'http://www.w3.org/2000/svg');
  }

  initBlink(): void {
    this.frequency = interval(this.CURSOR_INTERVAL);
    this.blinker = this.frequency.subscribe(() => this.blink());
  }

  stopBlink(): void {
    this.blinker.unsubscribe();
  }

  private blink(): void {
    this.renderer.setAttribute(
      this.element,
      'stroke-width',
      this.visible ? '0px' : '1px'
    );
    this.visible = !this.visible;
  }

  removeCursor(): void {
    this.stopBlink();
    this.element.remove();
  }

  updateVisual(): void {
    this.renderer.setAttribute(this.element, 'd',
      `M ${this.currentPosition.x} ${this.currentPosition.y} v ${-this.service.fontSize}`
    );
  }

  move(currentLine: TextLine, lineIndex: number): void {
    // console.log(`lineIndex = ${lineIndex}`);
    this.currentPosition.x = this.initialCursorPoint.x + this.service.getTextAlign(this.service.currentZoneDims.width) / 2 +  this.service.getLineWidth(currentLine);
    this.currentPosition.y = this.initialCursorPoint.y + ((lineIndex) * this.service.fontSize);
    this.updateVisual();
  }
}
