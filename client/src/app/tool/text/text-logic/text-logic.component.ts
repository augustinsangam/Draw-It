import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ShortcutHandlerService} from '../../../shortcut-handler/shortcut-handler.service';
import {UndoRedoService} from '../../../undo-redo/undo-redo.service';
import {ColorService} from '../../color/color.service';
import {MathService} from '../../mathematics/tool.math-service.service';
import {BackGroundProperties, StrokeProperties} from '../../shape/common/abstract-shape';
import {Point} from '../../shape/common/point';
import {Rectangle} from '../../shape/common/rectangle';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {Cursor} from '../text-classes/cursor';
import {LetterDeleterHandler} from '../text-classes/letter-deleter-handler';
import {TextAlignement} from '../text-classes/text-alignement';
import {TextHandlers} from '../text-classes/text-handlers';
import {StateIndicators} from '../text-classes/text-indicators';
import {TextLine} from '../text-classes/text-line';
import {TextNavHandler} from '../text-classes/text-nav-handler';
import {TextService} from '../text.service';

@Component({
  selector: 'app-text-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class TextLogicComponent extends ToolLogicDirective
  implements OnDestroy {

  readonly TEXT_OFFSET: number = 10;

  private listeners: (() => void)[];
  private cursor: Cursor;
  private indicators: StateIndicators;
  private lines: TextLine[];
  private currentLine: TextLine;
  private textElement: SVGTSpanElement;
  private initialPoint: Point;
  private handlers: TextHandlers;

  constructor(private readonly service: TextService,
              private readonly renderer: Renderer2,
              private readonly mathService: MathService,
              private readonly colorService: ColorService,
              private readonly shortcutService: ShortcutHandlerService,
              private readonly undoRedoService: UndoRedoService
  ) {
    super();
    this.listeners = [];
    this.indicators = {onDrag: false, onType: false};
    this.lines = [];
    this.undoRedoService.resetActions();
  }

  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => {
        mouseEv.cancelBubble = true;
        mouseEv.preventDefault();
        if (!this.indicators.onType) {
          this.indicators.onDrag = true;
          this.initRectVisu(mouseEv);
        }
      }
    );

    const onMouseUp = this.renderer.listen(
      this.svgStructure.root,
      'mouseup',
      (mouseEv: MouseEvent) => {
        const point = this.svgStructure.root.createSVGPoint();
        point.x = mouseEv.offsetX;
        point.y = mouseEv.offsetY;
        if (!(this.service.textZoneRectangle.element as SVGGeometryElement).isPointInFill(point) && this.indicators.onType) {
          this.stopTyping(false);
          return;
        }
        this.onMouseUp(mouseEv);
      }
    );

    const onMouseLeave = this.renderer.listen(
      this.svgStructure.root,
      'mouseleave',
      () => {
        if (!this.indicators.onType && this.indicators.onDrag) {
          this.service.textZoneRectangle.element.remove();
          this.indicators.onDrag = false;
        }
      }
    );

    const onMouseMove = this.renderer.listen(
      this.svgStructure.root,
      'mousemove',
      (mouseEv: MouseEvent) => {
        if (this.indicators.onDrag) {
          this.service.textZoneRectangle.dragRectangle(this.initialPoint, new Point(mouseEv.offsetX, mouseEv.offsetY));
        }
      }
    );

    const onKeyDown = this.renderer.listen(
      'document',
      'keydown',
      (keyEv: KeyboardEvent) => {
        if (this.indicators.onType) {
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
    if (this.indicators.onType) {
      this.stopTyping(false);
    }
    this.listeners.forEach((listener) => listener());
  }

  private onKeyDown(keyEv: KeyboardEvent): void {
    switch (keyEv.key) {

      case 'Escape':
        this.cancelTyping();
        break;

      case 'Enter':
        this.addLine();
        break;

      case 'Home':
        keyEv.preventDefault();
        this.handlers.textNav.keyHome(this.currentLine);
        break;

      case 'End':
        keyEv.preventDefault();
        this.handlers.textNav.keyEnd(this.currentLine);
        break;

      case 'ArrowUp':
        keyEv.preventDefault();
        this.currentLine = this.handlers.textNav.cursorUp(this.currentLine);
        break;

      case 'ArrowDown':
        keyEv.preventDefault();
        this.currentLine = this.handlers.textNav.cursorDown(this.currentLine);
        break;

      case 'ArrowLeft':
        keyEv.preventDefault();
        this.currentLine = this.handlers.textNav.cursorLeft(this.currentLine);
        break;

      case 'ArrowRight':
        keyEv.preventDefault();
        this.currentLine = this.handlers.textNav.cursorRight(this.currentLine);
        break;

      case 'Backspace':
        this.currentLine = this.handlers.letterDelete.deleteLeftLetter(this.currentLine);
        break;

      case 'Delete':
        this.currentLine = this.handlers.letterDelete.deleteRightLetter(this.currentLine);
        break;

      case 'Space':
        keyEv.preventDefault();
        this.addLetterAtCursor('U+0020');
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
    this.indicators.onDrag = false;
    const finalPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
    this.service.currentZoneDims = this.mathService.getRectangleSize(this.initialPoint, finalPoint);
    this.initialPoint = this.mathService.getRectangleUpLeftCorner(this.initialPoint, finalPoint);
    if (!this.indicators.onType) {
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
    const initialCursorXPos = (this.service.textAlignement === TextAlignement.left) ?
      this.initialPoint.x :
      (this.service.textAlignement === TextAlignement.center) ?
        this.initialPoint.x + this.service.currentZoneDims.width / 2 :
        this.initialPoint.x + this.service.currentZoneDims.width;

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
    this.indicators.onType = true;
    this.shortcutService.desactivateAll();
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
    this.indicators.onDrag = false;
  }

  private stopTyping(cancelled: boolean): void {
    this.cursor.removeCursor();
    this.service.textZoneRectangle.element.remove();
    this.service.currentZoneDims = {height: 0, width: 0};
    this.indicators.onType = false;
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
    this.textElement.setAttribute('fill', this.colorService.primaryColor);
    this.textElement.setAttribute('font-family', this.service.currentFont);
    this.textElement.setAttribute('font-size', this.service.fontSize.toString());
    this.textElement.setAttribute('text-anchor', this.service.getTextAnchor());
    this.textElement.setAttribute('font-weight', this.service.textMutators.bold ? 'bold' : 'normal');
    this.textElement.setAttribute('font-style', this.service.textMutators.italic ? 'italic' : 'normal');
    this.textElement.setAttribute('text-decoration', this.service.textMutators.underline ? 'underline' : 'none');
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
