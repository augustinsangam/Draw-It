import {Renderer2} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {TextService} from './text.service';
import {Point} from '../shape/common/point';

// tslint:disable:use-lifecycle-interface
export class Cursor {

  frequency: Observable<number>;
  blinker: Subscription;
  visible: boolean;
  currentPosition: Point;
  readonly LETTER_OFFSET_X: number = 31;
  readonly CURSOR_INTERVAL: number = 500;

  constructor(private readonly renderer: Renderer2,
              private readonly service: TextService,
              private element: SVGElement,
              initialPoint: Point,
  ) {
    this.visible = true;
    this.currentPosition = initialPoint;
    this.blinker = Subscription.EMPTY;
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

  moveLeft(newXPos: number): void {
    this.currentPosition.x = newXPos;
    this.renderer.setAttribute(this.element, 'd',
      `M ${this.currentPosition.x} ${this.currentPosition.y} v ${-this.service.fontSize}`
    );
  }
}
