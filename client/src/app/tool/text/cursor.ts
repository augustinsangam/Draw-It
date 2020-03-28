import {Renderer2} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {Point} from '../shape/common/point';
import {TextLine} from './text-line';
import {TextService} from './text.service';
import {TextAlignement} from './text-alignement';

// tslint:disable:use-lifecycle-interface
export class Cursor {

  frequency: Observable<number>;
  blinker: Subscription;
  visible: boolean;
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

  updateVisual(): void {
    this.renderer.setAttribute(this.element, 'd',
      `M ${this.currentPosition.x} ${this.currentPosition.y} v ${-this.service.fontSize}`
    );
  }

  move(currentLine: TextLine, lineIndex: number): void {
    switch (this.service.textAlignement) {
      case TextAlignement.left:
        this.currentPosition.x = this.initialCursorPoint.x + this.service.getTextAlign() + this.service.getLineWidth(currentLine);
        this.currentPosition.y = this.initialCursorPoint.y + ((lineIndex) * this.service.fontSize);
        console.log(`x_initialPoint = ${this.initialCursorPoint.x} + x_align = ${this.service.getTextAlign()} + x_cursorAlign = ${this.service.getCursorAlign(currentLine)}`);
        break;

      case TextAlignement.right:
        const oldIndex = currentLine.cursorIndex;
        // maybe utiliser currentline.tspan.textcontent.length ici
        currentLine.cursorIndex = currentLine.tspan.textContent.length;
        const textWidth = this.service.getLineWidth(currentLine);
        currentLine.cursorIndex = oldIndex;
        const lineAtCursor = this.service.getLineWidth(currentLine);
        this.currentPosition.x = this.initialCursorPoint.x - (textWidth - lineAtCursor);
        console.log(`x_initialPoint = ${this.initialCursorPoint.x} - (totalWidth = ${textWidth} - lineCursorWidth = ${lineAtCursor})`);
        this.currentPosition.y = this.initialCursorPoint.y + ((lineIndex) * this.service.fontSize);
        break;

      default:
        this.currentPosition.x = this.initialCursorPoint.x + this.service.getTextAlign() + this.service.getCursorAlign(currentLine);
        this.currentPosition.y = this.initialCursorPoint.y + ((lineIndex) * this.service.fontSize);
    }
    this.updateVisual();
  }
}
