import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';
import {AerosolService} from '../aerosol.service';
import {ColorService} from '../../../color/color.service';
import {Point} from '../../../shape/common/Point';

@Component({
  selector: 'app-aerosol-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class AerosolLogicComponent extends ToolLogicDirective
  implements OnDestroy {

  private listeners: (() => void)[];
  private currentGroup: SVGElement;
  private groups: any;
  private onDrag: boolean;
  private currMousePos: Point;

  constructor(
    private readonly service: AerosolService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService
  ) {
    super();
    this.listeners = [];
    this.groups = [];
    this.onDrag = false;
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

    this.listeners = [
      onMouseDown,
      onMouseUp,
      onMouseMove,
    ]
  }

  protected onMouseDown(mouseEv: MouseEvent): void {
    this.currMousePos = {x: mouseEv.offsetX, y: mouseEv.offsetY};
    this.currentGroup = this.renderer.createElement('g', this.svgNS);
    this.addSplash();
    this.renderer.appendChild(this.svgElRef.nativeElement, this.currentGroup);
    this.onDrag = true;
  }

  protected addSplash(): void {
    this.currentGroup.appendChild(this.generatePoints(this.service.thickness))
  }

  protected onMouseMove(mouseEv: MouseEvent): void {
    if (this.onDrag) {
      this.addSplash();
      this.currMousePos = {x: mouseEv.offsetX, y: mouseEv.offsetY};
      setTimeout(() => console.log('GO'), 1000);
    }
  }

  protected onMouseUp(mouseEv: MouseEvent) {
    this.onDrag = false;
    this.groups.push(this.currentGroup);
  }

  protected generatePoints(radius: number) {
    let randPoint: SVGElement;
    const currentCircle = this.renderer.createElement('g', this.svgNS);
    for (let i = 0; i < 100; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const r = Math.random() * radius;

      const x = this.currMousePos.x + r * Math.cos(theta);
      const y = this.currMousePos.y + r * Math.sin(theta);

      randPoint = this.renderer.createElement('circle', this.svgNS);
      randPoint.setAttribute('cx', x.toString());
      randPoint.setAttribute('cy', y.toString());
      randPoint.setAttribute('r', '1');
      randPoint.setAttribute('fill', this.colorService.primaryColor);

      currentCircle.appendChild(randPoint);
    }
    return currentCircle;
  }

  ngOnDestroy(): void {
    this.listeners.forEach(listenner => { listenner(); });
  }

}
