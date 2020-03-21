import {Component, OnDestroy, Renderer2} from '@angular/core';
import {MathService} from '../../mathematics/tool.math-service.service';
import {BackGroundProperties, StrokeProperties} from '../../shape/common/abstract-shape';
import {Point} from '../../shape/common/point';
import {Rectangle} from '../../shape/common/rectangle';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {TextService} from '../text.service';
import {Cursor} from '../cursor';
import {ShortcutHandlerService} from '../../../shortcut-handler/shortcut-handler.service';
import {ColorService} from '../../color/color.service';

@Component({
  selector: 'app-text-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class TextLogicComponent extends ToolLogicDirective
implements OnDestroy {

  readonly TEXTZONESIZE_X: number = 300;
  readonly TEXTZONEOFFSET_Y: number = 20;

  listeners: (() => void)[];
  textZoneRect: Rectangle;
  cursor: Cursor;
  onType: boolean;
  textElement: SVGElement;
  currentTspan: SVGElement;
  initialPoint: Point;
  typedLetters: string[];
  onDrag: boolean;

  constructor(private readonly service: TextService,
              private readonly renderer: Renderer2,
              private readonly mathService: MathService,
              private readonly colorService: ColorService,
              private readonly shortcutService: ShortcutHandlerService,
  ) {
    super();
    this.listeners = [];
    this.typedLetters = [];
    this.onDrag = false;
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
      (mouseEv: MouseEvent) => {
        this.onDrag = false;
        this.initialPoint = this.mathService.getRectangleUpLeftCorner(
          this.initialPoint,
          new Point(mouseEv.offsetX, mouseEv.offsetY)
        );
        if (!this.onType) {
          this.startTyping(mouseEv);
        }
      }
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

  private initRectVisu(mouseEv: MouseEvent): void {
    this.initialPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
    const textZoneRect = this.renderer.createElement('rect', this.svgNS);
    this.renderer.appendChild(this.svgStructure.temporaryZone, textZoneRect);
    this.textZoneRect = new Rectangle(this.renderer, textZoneRect, this.mathService);
    this.textZoneRect.setParameters(BackGroundProperties.None, StrokeProperties.Dashed);
    this.renderer.setStyle(textZoneRect, 'stroke', 'rgba(87,87,87,0.5)');
  }

  private onMouseDown(mouseEv: MouseEvent): void {
    this.initRectVisu(mouseEv);
  }

  private initCursor(mouseEv: MouseEvent): void {
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

  private startTyping(mouseEv: MouseEvent): void {
    this.onType = true;
    this.shortcutService.desactivateAll();
    this.initSVGText();
    this.initCursor(mouseEv);
  }

  private initSVGText(): void {
    this.textElement = this.renderer.createElement('text', this.svgNS);
    this.renderer.appendChild(this.svgStructure.drawZone, this.textElement);
    this.setTextStyle();

    this.currentTspan = this.renderer.createElement('tspan', this.svgNS);
    this.renderer.appendChild(this.textElement, this.currentTspan);
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

  private onKeyDown(keyEv: KeyboardEvent): void {
    switch (keyEv.key) {

      case 'Escape':
        console.log('Escape');
        this.cursor.removeCursor();
        this.textZoneRect.element.remove();
        this.onType = false;
        this.shortcutService.activateAll();
        this.typedLetters = [];
        break;

      case 'Enter':
        this.addLine();
        break;

      case 'ArrowLeft':
        console.log('ArrowLeft');
        break;

      case 'ArrowRight':
        console.log('ArrowRight');
        break;

      case 'Backspace':
        this.removeLastLetter();
        break;

      default:
        console.log(keyEv.key);
        this.addLetter(keyEv.key);
        break;
    }
  }

  private addLine(): void {
    console.log('adding line');
  }

  private updateText(): void {
    const svgLetter = this.renderer.createText(this.typedLetters.join(''));
    this.renderer.appendChild(this.currentTspan, svgLetter);
    this.renderer.setAttribute(this.currentTspan, 'x', (+this.service.getTextAlign(this.TEXTZONESIZE_X) + this.initialPoint.x).toString());
    this.renderer.setAttribute(this.currentTspan, 'y', `${this.cursor.currentPosition.y - 10}`);
    this.cursor.moveLeft(
      +this.service.getTextAlign(this.TEXTZONESIZE_X) + this.initialPoint.x + this.currentTspan.getBoundingClientRect().width
    );
  }

  private addLetter(letter: string): void {
    this.currentTspan.textContent = '';
    this.typedLetters.push(letter);
    this.updateText();
  }

  private removeLastLetter(): void {
    this.currentTspan.textContent = '';
    this.typedLetters.pop();
    this.updateText();
  }
}
