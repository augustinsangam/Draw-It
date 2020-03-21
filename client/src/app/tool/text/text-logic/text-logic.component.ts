import {Component, OnDestroy, Renderer2} from '@angular/core';
import {MathService} from '../../mathematics/tool.math-service.service';
import {BackGroundProperties, StrokeProperties} from '../../shape/common/abstract-shape';
import {Point} from '../../shape/common/point';
import {Rectangle} from '../../shape/common/rectangle';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {TextService} from '../text.service';
import {Cursor} from '../cursor';

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

  constructor(private readonly service: TextService,
              private readonly renderer: Renderer2,
              private readonly mathService: MathService,
  ) {
    super();
    this.listeners = [];
  }

  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => this.onMouseDown(mouseEv)
    );

    const onKeyDown = this.renderer.listen(
      'document',
      'keydown',
      (keyEv: KeyboardEvent) => this.onKeyDown(keyEv)
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
    this.cursor = new Cursor(this.renderer, this.service, cursor);
    this.renderer.setAttribute(cursor, 'd', `M ${mouseEv.offsetX + 10} ${mouseEv.offsetY + 10} v ${this.service.fontSize}`);
    this.renderer.setAttribute(cursor, 'stroke', 'rgba(1,1,1,1)');
    this.cursor.initBlink();
  }

  private onMouseDown(mouseEv: MouseEvent): void {
    this.initTextZoneVisu(mouseEv);
  }

  private onKeyDown(keyEv: KeyboardEvent): void {
    if (keyEv.code === 'Escape') {
      this.cursor.removeCursor();
      this.textZoneRect.element.remove();
    }
  }

}
