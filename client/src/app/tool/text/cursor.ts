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
  initialPoint: Point;
  readonly CURSOR_INTERVAL: number = 500;

  constructor(private readonly renderer: Renderer2,
              private readonly service: TextService,
              private element: SVGElement,
              initialPoint: Point,
  ) {
    this.visible = true;
    this.currentPosition = initialPoint;
    this.initialPoint = initialPoint;
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

  moveRight(newXPos: number): void {
    this.currentPosition.x = newXPos;
    this.updateVisual();
  }

  updateVisual(): void {
    this.renderer.setAttribute(this.element, 'd',
      `M ${this.currentPosition.x} ${this.currentPosition.y} v ${-this.service.fontSize}`
    );
  }

  nextLine(): void {
    this.currentPosition.y += this.service.fontSize + 10;
    this.currentPosition.x = this.initialPoint.x + 10;
    this.updateVisual();
  }

  moveLeft(lines: TextLine[], currentLine: TextLine): void {
    if (currentLine.letters.length !== 0) {
      const oldText = currentLine.tspan.textContent;
      currentLine.letters.pop();
      currentLine.tspan.textContent = currentLine.letters.join('');
      this.currentPosition.x = +currentLine.tspan.getAttribute('x') + this.service.getLineWidth(currentLine);
      currentLine.tspan.textContent = oldText;
    }
    this.updateVisual();
  }
}
