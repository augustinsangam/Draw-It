import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ShortcutHandlerService } from '../../../shortcut-handler/shortcut-handler.service';
import { UndoRedoService } from '../../../undo-redo/undo-redo.service';
import { ColorService } from '../../color/color.service';
import { MathService } from '../../mathematics/tool.math-service.service';
import { BackGroundProperties, StrokeProperties } from '../../shape/common/abstract-shape';
import { Point } from '../../shape/common/point';
import { Rectangle } from '../../shape/common/rectangle';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { Cursor } from '../text-classes/cursor';
import { LetterDeleterHandler } from '../text-classes/letter-deleter-handler';
import { TextAlignement } from '../text-classes/text-alignement';
import { TextHandlers } from '../text-classes/text-handlers';
import {TextKeycodes} from '../text-classes/text-keycodes';
import { TextLine } from '../text-classes/text-line';
import { TextNavHandler } from '../text-classes/text-nav-handler';
import { TextService } from '../text.service';

@Component({
  selector: 'app-text-logic',
  template: '',
})

export class TextLogicComponent extends ToolLogicDirective
  implements OnDestroy, OnInit {

  readonly TEXT_OFFSET: number = 10;

  private listeners: (() => void)[];
  private cursor: Cursor;
  private lines: TextLine[];
  private currentLine: TextLine;
  private textElement: SVGTSpanElement;
  private initialPoint: Point;
  private handlers: TextHandlers;

  constructor(
    private readonly service: TextService,
    private readonly renderer: Renderer2,
    private readonly mathService: MathService,
    private readonly colorService: ColorService,
    private readonly shortcutService: ShortcutHandlerService,
    private readonly undoRedoService: UndoRedoService,
  ) {
    super();
    this.listeners = [];
    this.service.indicators = { onDrag: false, onType: false };
    this.lines = [];
    this.undoRedoService.resetActions();
  }

  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => {
        if (mouseEv.button !== 0) {
          return;
        }
        mouseEv.cancelBubble = true;
        mouseEv.preventDefault();
        if (!this.service.indicators.onType) {
          this.service.indicators.onDrag = true;
          this.initRectVisu(mouseEv);
        }
      }
    );

    const onMouseUp = this.renderer.listen(
      this.svgStructure.root,
      'mouseup',
      (mouseEv: MouseEvent) => {
        if (mouseEv.button !== 0) {
          return;
        }
        const point = this.svgStructure.root.createSVGPoint();
        point.x = mouseEv.offsetX;
        point.y = mouseEv.offsetY;
        if (!(this.service.textZoneRectangle.element as SVGGeometryElement).isPointInFill(point) && this.service.indicators.onType) {
          this.stopTyping(false);
        } else {
          this.onMouseUp(mouseEv);
        }
      }
    );

    const onMouseLeave = this.renderer.listen(
      this.svgStructure.root,
      'mouseleave',
      () => {
        if (!this.service.indicators.onType && this.service.indicators.onDrag) {
          this.service.textZoneRectangle.element.remove();
          this.service.indicators.onDrag = false;
        }
      }
    );

    const onMouseMove = this.renderer.listen(
      this.svgStructure.root,
      'mousemove',
      (mouseEv: MouseEvent) => {
        if (this.service.indicators.onDrag) {
          this.service.textZoneRectangle.dragRectangle(this.initialPoint, new Point(mouseEv.offsetX, mouseEv.offsetY));
        }
      }
    );

    const onKeyDown = this.renderer.listen(
      'document',
      'keydown',
      (keyEv: KeyboardEvent) => {
        if (this.service.indicators.onType) {
          this.onKeyDown(keyEv);
        }
      }
    );

    this.listeners = [
      onMouseDown,
      onKeyDown,
      onMouseUp,
      onMouseMove,
      onMouseLeave,
    ];
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'crosshair');
  }

  ngOnDestroy(): void {
    if (this.service.indicators.onType) {
      this.stopTyping(false);
    }
    this.listeners.forEach((listener) => listener());
  }

  private onKeyDown(keyEv: KeyboardEvent): void {
    switch (keyEv.key) {

      case TextKeycodes.escape:
        this.cancelTyping();
        break;

      case TextKeycodes.enter:
        this.addLine();
        break;

      case TextKeycodes.home:
        keyEv.preventDefault();
        this.handlers.textNav.keyHome(this.currentLine);
        break;

      case TextKeycodes.end:
        keyEv.preventDefault();
        this.handlers.textNav.keyEnd(this.currentLine);
        break;

      case TextKeycodes.arrowUp:
        keyEv.preventDefault();
        this.currentLine = this.handlers.textNav.cursorUp(this.currentLine);
        break;

      case TextKeycodes.arrowDown:
        keyEv.preventDefault();
        this.currentLine = this.handlers.textNav.cursorDown(this.currentLine);
        break;

      case TextKeycodes.arrowLeft:
        keyEv.preventDefault();
        this.currentLine = this.handlers.textNav.cursorLeft(this.currentLine);
        break;

      case TextKeycodes.arrowRight:
        keyEv.preventDefault();
        this.currentLine = this.handlers.textNav.cursorRight(this.currentLine);
        break;

      case TextKeycodes.backspace:
        this.currentLine = this.handlers.letterDelete.deleteLeftLetter(this.currentLine);
        break;

      case TextKeycodes.delete:
        this.currentLine = this.handlers.letterDelete.deleteRightLetter(this.currentLine);
        break;

      case TextKeycodes.space:
        keyEv.preventDefault();
        this.addLetterAtCursor(' ');
        break;

      default:
        if (keyEv.key.length === 1) {
          this.addLetterAtCursor(keyEv.key);
        }
        break;
    }
    if (keyEv.key !== 'Escape') {
      this.updateView();
    }
  }

  private onMouseUp(mouseEv: MouseEvent): void {
    mouseEv.cancelBubble = false;
    this.service.indicators.onDrag = false;
    const finalPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
    this.service.currentZoneDims = this.mathService.getRectangleSize(this.initialPoint, finalPoint);
    this.initialPoint = this.mathService.getRectangleUpLeftCorner(this.initialPoint, finalPoint);
    if (!this.service.indicators.onType) {
      this.startTyping();
    }
  }

  private initRectVisu(mouseEv: MouseEvent): void {
    this.initialPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
    const textZoneRect = this.renderer.createElement('rect', this.svgNS);
    this.renderer.appendChild(this.svgStructure.temporaryZone, textZoneRect);
    this.service.textZoneRectangle = new Rectangle(this.renderer, textZoneRect, this.mathService);
    this.service.textZoneRectangle.setParameters(BackGroundProperties.None, StrokeProperties.Dashed);
    this.renderer.setStyle(textZoneRect, 'stroke', 'rgba(87,87,87,0.5)');
  }

  private initCursor(): void {
    const cursor = this.renderer.createElement('path', this.svgNS);
    this.renderer.appendChild(this.svgStructure.temporaryZone, cursor);
    let initialCursorXPos: number;

    if (this.service.textAlignement === TextAlignement.left) {
      initialCursorXPos = this.initialPoint.x;
    } else if (this.service.textAlignement === TextAlignement.center) {
      initialCursorXPos = this.initialPoint.x + this.service.currentZoneDims.width / 2;
    } else {
      initialCursorXPos = this.initialPoint.x + this.service.currentZoneDims.width;
    }

    this.cursor = new Cursor(this.renderer, this.service, cursor, new Point(
      initialCursorXPos,
      this.initialPoint.y + this.TEXT_OFFSET + this.service.fontSize
      )
    );
    this.cursor.initBlink();

    this.handlers = {
      textNav: new TextNavHandler(this.cursor, this.lines),
      letterDelete: new LetterDeleterHandler(this.lines, this.service)
    };
  }

  private initSVGText(): void {
    this.textElement = this.renderer.createElement('text', this.svgNS);
    this.renderer.appendChild(this.svgStructure.drawZone, this.textElement);
    this.setTextStyle();

    this.addLine();
  }

  private startTyping(): void {
    this.service.indicators.onType = true;
    this.service.startTypingEmitter.emit();
    this.shortcutService.deactivateAll();
    this.initCursor();
    this.initSVGText();
  }

  private cancelTyping(): void {
    this.stopTyping(true);
    this.lines.forEach((line) => {
      line.tspan.remove();
      line.letters = [];
      line.cursorIndex = 0;
    });
    this.textElement.remove();
    this.service.indicators.onDrag = false;
  }

  private stopTyping(cancelled: boolean): void {
    this.cursor.removeCursor();
    this.service.textZoneRectangle.element.remove();
    this.service.currentZoneDims = {height: 0, width: 0};
    this.service.indicators.onType = false;
    this.service.endTypingEmitter.emit();
    if (this.currentLine.tspan.textContent === '' && this.lines.length === 1) {
      this.textElement.remove();
    }
    this.shortcutService.activateAll();
    delete this.currentLine;
    this.lines = [];
    if (!cancelled) {
      this.undoRedoService.saveState();
    }
  }

  private addLine(): void {
    if (!this.currentLine) {
      this.currentLine = new TextLine(this.renderer.createElement('tspan', this.svgNS),  [], 0);
    }
    const prevLineIndex = this.lines.indexOf(this.currentLine);
    const newTspan = this.renderer.createElement('tspan', this.svgNS);

    this.currentLine = this.currentLine.splitAtCursor(this.currentLine.cursorIndex, newTspan);

    this.renderer.appendChild(this.textElement, this.currentLine.tspan);
    this.renderer.setStyle(this.currentLine.tspan, 'white-space', 'pre');
    this.renderer.setAttribute(this.currentLine.tspan, 'x', `${+this.service.getTextAlign() + this.initialPoint.x}`);

    this.lines.splice(prevLineIndex + 1, 0, this.currentLine);

    this.lines.slice(this.lines.indexOf(this.currentLine), this.lines.length).forEach((line) => {
      line.moveDown(this.initialPoint.y, this.lines.indexOf(line), this.service.fontSize);
    });
  }

  private addLetterAtCursor(letter: string): void {
    const preCursor = this.currentLine.letters.slice(0, this.currentLine.cursorIndex);
    const postCursor = this.currentLine.letters.slice(this.currentLine.cursorIndex, this.currentLine.letters.length);
    this.currentLine.letters = preCursor;
    this.currentLine.letters.push(letter);
    postCursor.forEach((postLetter) => this.currentLine.letters.push(postLetter));
    ++this.currentLine.cursorIndex;
  }

  private setTextStyle(): void {
    this.renderer.setAttribute(this.textElement, 'fill', this.colorService.primaryColor);
    this.renderer.setAttribute(this.textElement, 'font-family', this.service.currentFont);
    this.renderer.setAttribute(this.textElement, 'font-size', this.service.fontSize.toString());
    this.renderer.setAttribute(this.textElement, 'text-anchor', this.service.getTextAnchor());
    this.renderer.setAttribute(this.textElement, 'font-weight', this.service.textMutators.bold ? 'bold' : 'normal');
    this.renderer.setAttribute(this.textElement, 'font-style', this.service.textMutators.italic ? 'italic' : 'normal');
    this.renderer.setAttribute(this.textElement, 'text-decoration', this.service.textMutators.underline ? 'underline' : 'none');
    this.renderer.setStyle(this.textElement, 'user-select', 'none');
  }

  private updateView(): void {
    this.lines.forEach((line) => {
      line.tspan.textContent = '';
      const svgLetter = this.renderer.createText(line.letters.join(''));
      this.renderer.appendChild(line.tspan, svgLetter);
    });
    this.renderer.setAttribute(this.currentLine.tspan, 'x', `${+this.service.getTextAlign() + this.initialPoint.x }`);
    this.renderer.setAttribute(
      this.currentLine.tspan,
      'y',
      `${this.initialPoint.y + (this.lines.indexOf(this.currentLine) + 1) * this.service.fontSize}`
    );

    this.cursor.move(this.currentLine, this.lines.indexOf(this.currentLine));
  }
}
