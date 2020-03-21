import {Renderer2} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {ToolLogicDirective} from '../tool-logic/tool-logic.directive';
import {TextService} from './text.service';

// tslint:disable:use-lifecycle-interface
export class Cursor extends ToolLogicDirective {

  frequency: Observable<number>;
  blinker: Subscription;
  visible: boolean;
  readonly CURSOR_INTERVAL: number = 500;

  constructor(private readonly renderer: Renderer2,
              private readonly service: TextService,
              private element: SVGElement,
  ) {
    super();
    this.visible = true;
  }

  ngOnInit(): void {

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
}
