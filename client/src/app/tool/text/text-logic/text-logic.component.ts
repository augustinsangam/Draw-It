import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ShortcutHandlerService} from '../../../shortcut-handler/shortcut-handler.service';
import {ColorService} from '../../color/color.service';
import {MathService} from '../../mathematics/tool.math-service.service';
import {BackGroundProperties, StrokeProperties} from '../../shape/common/abstract-shape';
import {Point} from '../../shape/common/point';
import {Rectangle} from '../../shape/common/rectangle';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {Cursor} from '../cursor';
import {TextAlignement} from '../text-alignement';
import {TextLine} from '../text-line';
import {TextService} from '../text.service';

@Component({
  selector: 'app-text-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class TextLogicComponent extends ToolLogicDirective
implements OnDestroy {

  readonly TEXT_OFFSET: number = 10;

  listeners: (() => void)[];
  textZoneRect: Rectangle;
  cursor: Cursor;
  onType: boolean;
  lines: TextLine[];
  currentLine: TextLine;
  textElement: SVGTSpanElement;
  initialPoint: Point;
  onDrag: boolean;

  constructor(private readonly service: TextService,
              private readonly renderer: Renderer2,
              private readonly mathService: MathService,
              private readonly colorService: ColorService,
              private readonly shortcutService: ShortcutHandlerService,
  ) {
    super();
    this.listeners = [];
    this.onDrag = false;
    this.lines = [];
  }

  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => {
        if (!this.onType) {
          this.onDrag = true;
          this.onMouseDown(mouseEv);
        }
      }
    );

    const onMouseUp = this.renderer.listen(
      this.svgStructure.root,
      'mouseup',
      (mouseEv: MouseEvent) => this.onMouseUp(mouseEv)
    );

    const onMouseMove = this.renderer.listen(
      this.svgStructure.root,
      'mousemove',
      (mouseEv: MouseEvent) => {
        if (this.onDrag) {
          this.textZoneRect.dragRectangle(this.initialPoint, new Point(mouseEv.offsetX, mouseEv.offsetY));
        }
      }
    );

    const onKeyDown = this.renderer.listen(
      'document',
      'keydown',
      (keyEv: KeyboardEvent) => {
        if (this.onType) {
          this.onKeyDown(keyEv);
        }
      }
    );

    this.listeners = [
      onMouseDown,
      onKeyDown,
      onMouseUp,
      onMouseMove,
    ];
  }

  ngOnDestroy(): void {
    this.listeners.forEach((listener) => listener());
  }

  private onKeyDown(keyEv: KeyboardEvent): void {

    switch (keyEv.key) {

      case 'Escape':
        console.log('Escape');
        this.stopTyping();
        break;

      case 'Enter':
        this.addLine();
        break;

      case 'Home':
        keyEv.preventDefault();
        this.currentLine.cursorIndex = 0;
        this.cursor.move(this.currentLine, this.lines.indexOf(this.currentLine));
        break;

      case 'End':
        keyEv.preventDefault();
        this.currentLine.cursorIndex = this.currentLine.tspan.textContent.length;
        this.cursor.move(this.currentLine, this.lines.indexOf(this.currentLine));
        break;

      case 'ArrowUp':
        keyEv.preventDefault();
        if (this.lines.indexOf(this.currentLine) - 1 >= 0) {
          const oldCursorIndex = this.currentLine.cursorIndex;
          this.currentLine = this.lines[this.lines.indexOf(this.currentLine) - 1];
          if (this.currentLine.letters.length >= oldCursorIndex) {
            this.currentLine.cursorIndex = oldCursorIndex;
          } else {
            this.currentLine.cursorIndex = this.currentLine.letters.length;
          }
          this.cursor.move(this.currentLine, this.lines.indexOf(this.currentLine));
        }
        break;

      case 'ArrowDown':
        keyEv.preventDefault();
        if (this.lines.indexOf(this.currentLine) + 1 < this.lines.length) {
          const oldCursorIndex = this.currentLine.cursorIndex;
          this.currentLine = this.lines[this.lines.indexOf(this.currentLine) + 1];
          if (this.currentLine.letters.length >= oldCursorIndex) {
            this.currentLine.cursorIndex = oldCursorIndex;
          } else {
            this.currentLine.cursorIndex = this.currentLine.letters.length;
          }
          this.cursor.move(this.currentLine, this.lines.indexOf(this.currentLine));
        }
        break;

      case 'ArrowLeft':
        keyEv.preventDefault();
        if (this.currentLine.cursorIndex > 0) {
          --this.currentLine.cursorIndex;
          this.cursor.move(this.currentLine, this.lines.indexOf(this.currentLine));
        }
        break;

      case 'ArrowRight':
        keyEv.preventDefault();
        if (this.currentLine.cursorIndex < this.currentLine.tspan.textContent.length) {
          ++this.currentLine.cursorIndex;
          this.cursor.move(this.currentLine, this.lines.indexOf(this.currentLine));
        }
        break;

      case 'Backspace':
        this.deleteLeftLetter();
        break;

      case 'Delete':
        this.deleteRightLetter();
        break;

      case 'Space':
        keyEv.preventDefault();
        this.addLetterAtCursor(' ');
        break;

      default:
        console.log(keyEv.key);
        if (keyEv.key.length === 1) {
          this.addLetterAtCursor(keyEv.key);
        }
        break;
    }
  }

  private onMouseDown(mouseEv: MouseEvent): void {
    mouseEv.preventDefault();
    mouseEv.cancelBubble = true;
    this.initRectVisu(mouseEv);
  }

  private onMouseUp(mouseEv: MouseEvent): void {
    mouseEv.cancelBubble = false;
    const finalPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
    this.onDrag = false;
    this.initialPoint = this.mathService.getRectangleUpLeftCorner(
      this.initialPoint,
      finalPoint
    );
    this.service.currentZoneDims = this.mathService.getRectangleSize(this.initialPoint, finalPoint);
    if (!this.onType) {
      this.startTyping(mouseEv);
    }
  }

  private initRectVisu(mouseEv: MouseEvent): void {
    this.initialPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
    const textZoneRect = this.renderer.createElement('rect', this.svgNS);
    this.renderer.appendChild(this.svgStructure.temporaryZone, textZoneRect);
    this.textZoneRect = new Rectangle(this.renderer, textZoneRect, this.mathService);
    this.textZoneRect.setParameters(BackGroundProperties.None, StrokeProperties.Dashed);
    this.renderer.setStyle(textZoneRect, 'stroke', 'rgba(87,87,87,0.5)');
  }

  private initCursor(): void {
    const cursor = this.renderer.createElement('path', this.svgNS);
    this.renderer.appendChild(this.svgStructure.temporaryZone, cursor);

    const initialCursorXPos = (this.service.textAlignement === TextAlignement.left) ?
      this.initialPoint.x :
      (this.service.textAlignement === TextAlignement.center) ?
        this.initialPoint.x + this.service.currentZoneDims.width / 2 :
        this.initialPoint.x + this.service.currentZoneDims.width;

    this.cursor = new Cursor(
      this.renderer,
      this.service,
      cursor,
      new Point(
        initialCursorXPos,
        this.initialPoint.y + this.TEXT_OFFSET + this.service.fontSize
      )
    );
    this.cursor.initBlink();
  }

  private initSVGText(): void {
    this.textElement = this.renderer.createElement('text', this.svgNS);
    this.renderer.appendChild(this.svgStructure.drawZone, this.textElement);
    this.setTextStyle();

    this.addTspan();
  }

  private startTyping(mouseEv: MouseEvent): void {
    this.onType = true;
    this.shortcutService.desactivateAll();
    this.initSVGText();
    this.initCursor();
  }

  private stopTyping(): void {
    this.cursor.removeCursor();
    this.textZoneRect.element.remove();
    this.service.currentZoneDims = {height: 0, width: 0};
    this.onType = false;
    this.shortcutService.activateAll();
    this.currentLine = {tspan: undefined as unknown as SVGElement, letters: [], cursorIndex: 0};
    this.lines = [];
  }

  private addTspan(): void {
    this.currentLine = {tspan: this.renderer.createElement('tspan', this.svgNS), letters: [], cursorIndex: 0};
    this.renderer.appendChild(this.textElement, this.currentLine.tspan);
    this.lines.push(this.currentLine);
  }

  private addLine(): void {
    this.addTspan();
    this.renderer.setAttribute(
      this.currentLine.tspan,
      'x',
      `${+this.service.getTextAlign() + this.initialPoint.x}`
    );
    this.renderer.setAttribute(this.currentLine.tspan, 'y', `${this.cursor.currentPosition.y + this.TEXT_OFFSET}`);
    this.cursor.move(this.currentLine, this.lines.indexOf(this.currentLine));
  }

  private addLetterAtCursor(letter: string): void {
    const preCursor = this.currentLine.letters.slice(0, this.currentLine.cursorIndex);
    const postCursor = this.currentLine.letters.slice(this.currentLine.cursorIndex, this.currentLine.letters.length);
    this.currentLine.letters = preCursor;
    this.currentLine.letters.push(letter);
    postCursor.forEach((postLetter) => this.currentLine.letters.push(postLetter));
    ++this.currentLine.cursorIndex;
    this.updateText();
  }

  private setTextStyle(): void {
    this.textElement.setAttribute('fill', this.colorService.primaryColor);

    this.textElement.setAttribute('font-family', this.service.currentFont);
    this.textElement.setAttribute('font-size', this.service.fontSize.toString());

    this.textElement.setAttribute('text-anchor', this.service.getTextAnchor());

    this.textElement.setAttribute('font-weight', this.service.textMutators.bold ? 'bold' : 'normal');
    this.textElement.setAttribute('font-style', this.service.textMutators.italic ? 'italic' : 'normal');
    this.textElement.setAttribute('text-decoration', this.service.textMutators.underline ? 'underline' : 'none');
  }

  private updateText(): void {
    this.currentLine.tspan.textContent = '';
    const svgLetter = this.renderer.createText(this.currentLine.letters.join(''));
    this.renderer.appendChild(this.currentLine.tspan, svgLetter);
    this.renderer.setAttribute(
      this.currentLine.tspan,
      'x',
      `${+this.service.getTextAlign() + this.initialPoint.x }`
    );
    this.renderer.setAttribute(this.currentLine.tspan, 'y', `${this.cursor.currentPosition.y - this.TEXT_OFFSET}`);
    this.cursor.move(this.currentLine, this.lines.indexOf(this.currentLine));
  }

  private deleteRightLetter(): void {
    if (this.currentLine.letters.length === 0 || this.currentLine.cursorIndex === this.currentLine.letters.length) {
      return ;
    }
    const preCursor = this.currentLine.letters.slice(0, this.currentLine.cursorIndex);
    const postCursor = this.currentLine.letters.slice(this.currentLine.cursorIndex + 1, this.currentLine.letters.length);
    console.log(`pre: ${preCursor} post: ${postCursor}`);
    if (postCursor.length !== 0) {
      this.currentLine.letters = preCursor;
      postCursor.forEach((letter) => this.currentLine.letters.push(letter));
    } else {
      this.currentLine.letters = preCursor;
      this.currentLine.cursorIndex = this.currentLine.letters.length;
    }
    this.updateText();
  }

  private deleteLeftLetter(): void {
    if (this.currentLine.letters.length === 0 || this.currentLine.cursorIndex === 0) {
      return ;
    }
    const preCursor = this.currentLine.letters.slice(0, this.currentLine.cursorIndex - 1);
    const postCursor = this.currentLine.letters.slice(this.currentLine.cursorIndex, this.currentLine.letters.length);
    console.log(`pre: ${preCursor} post: ${postCursor}`);
    if (preCursor.length !== 0) {
      this.currentLine.letters = preCursor;
      postCursor.forEach((letter) => this.currentLine.letters.push(letter));
      --this.currentLine.cursorIndex;
    } else {
      this.currentLine.letters = postCursor;
      this.currentLine.cursorIndex = 0;
    }
    this.updateText();
  }
}
