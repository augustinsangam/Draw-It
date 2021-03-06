import {Renderer2} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {Point} from '../../shape/common/point';
import {TextService} from '../text.service';
import {TextAlignement} from './text-alignement';
import {TextLine} from './text-line';

export class Cursor {

  private static readonly CURSOR_INTERVAL: number = 500;

  private frequency: Observable<number>;
  private blinker: Subscription;
  private visible: boolean;
  currentPosition: Point;
  initialCursorPoint: Point;

  constructor(private readonly renderer: Renderer2,
              private readonly service: TextService,
              private element: SVGElement,
              initialPoint: Point,
  ) {
    this.visible = true;
    this.initialCursorPoint = new Point(initialPoint.x, initialPoint.y);
    this.currentPosition = new Point(initialPoint.x, initialPoint.y);
    this.blinker = Subscription.EMPTY;
    this.renderer.setAttribute(element, 'stroke', 'rgba(1,1,1,1)');
    this.updateVisual();
  }

  initBlink(): void {
    this.frequency = interval(Cursor.CURSOR_INTERVAL);
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

  private updateVisual(): void {
    this.renderer.setAttribute(this.element, 'd',
      `M ${this.currentPosition.x} ${this.currentPosition.y} v ${-this.service.fontSize}`
    );
  }

  setYPos(lineIndex: number): void {
    this.currentPosition.y = this.initialCursorPoint.y + (lineIndex * this.service.fontSize);
  }

  move(currentLine: TextLine, lineIndex: number): void {
    switch (this.service.textAlignement) {
      case TextAlignement.LEFT:
        this.currentPosition.x = this.initialCursorPoint.x + this.service.getTextAlign() + this.service.getLineWidth(currentLine);
        break;

      case TextAlignement.CENTER:
        const textStart = this.initialCursorPoint.x - this.service.getFullTextWidth(currentLine) / 2;

        this.currentPosition.x = textStart + this.service.getLineWidth(currentLine);
        break;

      case TextAlignement.RIGHT:
        const textWidthAtCursor = this.service.getLineWidth(currentLine);

        this.currentPosition.x = this.initialCursorPoint.x - (this.service.getFullTextWidth(currentLine) - textWidthAtCursor);
        break;
    }
    this.setYPos(lineIndex);
    this.updateVisual();
  }
}
