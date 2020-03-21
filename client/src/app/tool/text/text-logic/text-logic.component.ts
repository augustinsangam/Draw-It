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

  constructor(private readonly service: TextService,
              private readonly renderer: Renderer2,
              private readonly mathService: MathService,
              private readonly colorService: ColorService,
              private readonly shortcutService: ShortcutHandlerService,
  ) {
    super();
    this.listeners = [];
    this.typedLetters = [];
  }

  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => {
        if (!this.onType) {
          this.onMouseDown(mouseEv);
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
      onKeyDown
    ];
  }

  ngOnDestroy(): void {
    this.listeners.forEach((listener) => listener());
  }

  private initTextZoneVisu(mouseEv: MouseEvent): void {
    this.initialPoint = new Point(mouseEv.offsetX, mouseEv.offsetY + this.service.fontSize + 10);
    const textZoneRect = this.renderer.createElement('rect', this.svgNS);
    this.renderer.appendChild(this.svgStructure.temporaryZone, textZoneRect);
    this.textZoneRect = new Rectangle(this.renderer, textZoneRect, this.mathService);
    this.textZoneRect.setParameters(BackGroundProperties.None, StrokeProperties.Dashed);
    this.renderer.setStyle(textZoneRect, 'stroke', 'rgba(87,87,87,0.5)');

    this.textZoneRect.dragRectangle(
      new Point(mouseEv.offsetX, mouseEv.offsetY),
      new Point(mouseEv.offsetX + this.TEXTZONESIZE_X, mouseEv.offsetY + this.service.fontSize + this.TEXTZONEOFFSET_Y)
    );

    const cursor = this.renderer.createElement('path', this.svgNS);
    this.renderer.appendChild(this.svgStructure.temporaryZone, cursor);
    this.cursor = new Cursor(
      this.renderer,
      this.service,
      cursor,
      new Point(
        mouseEv.offsetX + 10,
        mouseEv.offsetY + 10 + this.service.fontSize
      )
    );
    this.renderer.setAttribute(cursor, 'd', `M ${mouseEv.offsetX + 10} ${mouseEv.offsetY + 10} v ${this.service.fontSize}`);
    this.renderer.setAttribute(cursor, 'stroke', 'rgba(1,1,1,1)');
    this.cursor.initBlink();
  }

  private onMouseDown(mouseEv: MouseEvent): void {
    this.onType = true;
    this.shortcutService.desactivateAll();
    this.initSVGText();
    this.initTextZoneVisu(mouseEv);
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
        console.log('Enter');
        this.addLine();
        break;

      case 'Backspace':
        console.log('Backspace');
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

  private addLetter(letter: string): void {
    console.log('adding letter');
    this.typedLetters.push(letter);
    const svgLetter = this.renderer.createText(letter);
    this.renderer.appendChild(this.currentTspan, svgLetter);
    this.renderer.setAttribute(this.currentTspan, 'x', (+this.service.getTextAlign(this.TEXTZONESIZE_X) + this.initialPoint.x).toString());
    this.renderer.setAttribute(this.currentTspan, 'y', `${this.cursor.currentPosition.y - 10}`);
    this.cursor.moveLeft(+this.service.getTextAlign(this.TEXTZONESIZE_X) + this.initialPoint.x + this.currentTspan.getBoundingClientRect().width);
  }

  private removeLastLetter(): void {
    this.typedLetters.pop();

    console.log('removing last letter');
  }
}
