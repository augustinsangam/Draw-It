import {Component, OnDestroy, Renderer2} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {ColorService} from '../../../color/color.service';
import {Point} from '../../../shape/common/Point';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';
import {AerosolService} from '../aerosol.service';

@Component({
  selector: 'app-aerosol-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class AerosolLogicComponent extends ToolLogicDirective
  implements OnDestroy {

  private listeners: (() => void)[];
  private currentPath: SVGElement;
  private currMousePos: Point;

  private onDrag: boolean;
  private stringPath: string;

  private periodicSplashAdder: any;
  private frequency: Observable<number>;

  constructor(
    private readonly service: AerosolService,
    private readonly renderer: Renderer2,
    protected readonly colorService: ColorService,
  ) {
    super();
    this.listeners = [];
    this.onDrag = false;
    this.stringPath = '';
  }

  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousedown',
      (mouseEv: MouseEvent) => this.onMouseDown(mouseEv)
    );

    const onMouseMove = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousemove',
      (mouseEv: MouseEvent) => this.onMouseMove(mouseEv)
    );

    const onMouseUp = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mouseup',
      (mouseEv: MouseEvent) => this.onMouseUp(mouseEv)
    );

    const onMouseLeave = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mouseleave',
      (mouseEv: MouseEvent) => this.onMouseUp(mouseEv)
    );

    this.listeners = [
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
    ]
  }

  ngOnDestroy(): void {
    this.listeners.forEach(listenner => { listenner(); });
  }

  protected onMouseDown(mouseEv: MouseEvent): void {
    this.currMousePos = {x: mouseEv.offsetX, y: mouseEv.offsetY};

    this.currentPath = this.renderer.createElement('path', this.svgNS);
    this.currentPath.setAttribute(
      'fill',
      this.colorService.primaryColor
    );
    this.renderer.appendChild(this.svgElRef.nativeElement, this.currentPath);

    this.onDrag = true;

    this.frequency = interval(1000 / (this.service.frequency));
    this.periodicSplashAdder = this.frequency.subscribe(
      () => this.addSplash()
    );
  }

  protected onMouseMove(mouseEv: MouseEvent): void {
    if (this.onDrag) {
      this.currMousePos = {x: mouseEv.offsetX, y: mouseEv.offsetY};
    }
  }

  protected onMouseUp(mouseEv: MouseEvent): void {
    if (this.onDrag) {
      this.periodicSplashAdder.unsubscribe();
    }
    this.onDrag = false;
    this.stringPath = '';
  }

  private addSplash(): void {
    this.stringPath += this.service.generatePoints(
      this.currMousePos
    );
    this.currentPath.setAttribute('d', this.stringPath);
  }

}
