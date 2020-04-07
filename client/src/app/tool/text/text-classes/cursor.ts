import {Renderer2} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {Point} from '../../shape/common/point';
import {TextService} from '../text.service';
import {TextAlignement} from './text-alignement';
import {TextLine} from './text-line';

// tslint:disable:use-lifecycle-interface
export class Cursor {

  private frequency: Observable<number>;
  private blinker: Subscription;
  private visible: boolean;
  currentPosition: Point;
  initialCursorPoint: Point;
  readonly CURSOR_INTERVAL: number = 500;

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

  private updateVisual(): void {
    this.renderer.setAttribute(this.element, 'd',
      `M ${this.currentPosition.x} ${this.currentPosition.y} v ${-this.service.fontSize}`
    );
  }

  move(currentLine: TextLine, lineIndex: number): void {
    switch (this.service.textAlignement) {
      case TextAlignement.left:
        this.currentPosition.x = this.initialCursorPoint.x + this.service.getTextAlign() + this.service.getLineWidth(currentLine);
        break;

      case TextAlignement.center:
        const textStart = this.initialCursorPoint.x - this.service.getFullTextWidth(currentLine) / 2;

        this.currentPosition.x = textStart + this.service.getLineWidth(currentLine);
        break;

      case TextAlignement.right:
        const textWidthAtCursor = this.service.getLineWidth(currentLine);

        this.currentPosition.x = this.initialCursorPoint.x - (this.service.getFullTextWidth(currentLine) - textWidthAtCursor);
        break;
    }
    this.currentPosition.y = this.initialCursorPoint.y + (lineIndex * this.service.fontSize);
    this.updateVisual();
  }
}
