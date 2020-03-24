import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ShortcutHandlerService} from '../../../shortcut-handler/shortcut-handler.service';
import {ColorService} from '../../color/color.service';
import {MathService} from '../../mathematics/tool.math-service.service';
import {BackGroundProperties, StrokeProperties} from '../../shape/common/abstract-shape';
import {Dimension} from '../../shape/common/dimension';
import {Point} from '../../shape/common/point';
import {Rectangle} from '../../shape/common/rectangle';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {Cursor} from '../cursor';
import {TextService} from '../text.service';
import {TextLine} from '../text-line';

@Component({
  selector: 'app-text-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class TextLogicComponent extends ToolLogicDirective
implements OnDestroy {

  listeners: (() => void)[];
  textZoneRect: Rectangle;
  zoneDims: Dimension;
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
        this.cursor.removeCursor();
        this.textZoneRect.element.remove();
        this.onType = false;
        this.shortcutService.activateAll();
        this.currentLine.letters = [];
        break;

      case 'Enter':
        this.addLine();
        break;

      case 'ArrowLeft':
        console.log('ArrowLeft');
        this.cursor.moveLeft(this.lines, this.currentLine);
        break;

      case 'ArrowRight':
        console.log('ArrowRight');
        break;

      case 'Backspace':
        this.removeLastLetter();
        break;

      default:
        // console.log(keyEv.key);
        if (keyEv.key.length === 1) {
          this.addLetter(keyEv.key);
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
    this.zoneDims = this.mathService.getRectangleSize(this.initialPoint, finalPoint);
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
    this.cursor = new Cursor(
      this.renderer,
      this.service,
      cursor,
      new Point(
        this.initialPoint.x + 10,
        this.initialPoint.y + 10 + this.service.fontSize
      )
    );
    this.renderer.setAttribute(cursor, 'd', `M ${this.initialPoint.x + 10} ${this.initialPoint.y + 10} v ${this.service.fontSize}`);
    this.renderer.setAttribute(cursor, 'stroke', 'rgba(1,1,1,1)');
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

  private addTspan(): void {
    this.currentLine = {tspan: this.renderer.createElement('tspan', this.svgNS), letters: []};
    this.renderer.appendChild(this.textElement, this.currentLine.tspan);
    this.lines.push(this.currentLine);
  }

  private addLine(): void {
    this.addTspan();
    console.log(this.initialPoint)
    this.renderer.setAttribute(this.currentLine.tspan, 'x', `${+this.service.getTextAlign(this.zoneDims.width) + this.initialPoint.x}`);
    this.renderer.setAttribute(this.currentLine.tspan, 'y', `${this.cursor.currentPosition.y + 10}`);
    this.cursor.nextLine();
  }

  private addLetter(letter: string): void {
    this.currentLine.letters.push(letter);
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
    this.renderer.setAttribute(this.currentLine.tspan, 'x', `${+this.service.getTextAlign(this.zoneDims.width) + this.initialPoint.x}`);
    this.renderer.setAttribute(this.currentLine.tspan, 'y', `${this.cursor.currentPosition.y - 10}`);
    this.cursor.moveRight(
      this.service.getTextAlign(this.zoneDims.width) + this.initialPoint.x + this.service.getLineWidth(this.currentLine)
    );
  }

  private removeLastLetter(): void {
    if (this.currentLine.letters.length !== 0) {
      this.currentLine.tspan.textContent = '';
      this.currentLine.letters.pop();
    } else {
      this.currentLine = this.lines[this.lines.indexOf(this.currentLine) - 1];
    }
    this.updateText();
  }
}
