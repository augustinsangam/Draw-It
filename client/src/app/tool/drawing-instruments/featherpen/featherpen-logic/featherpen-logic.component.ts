import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-featherpen-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class FeatherpenLogicComponent extends ToolLogicDirective
 implements OnDestroy {

  private listeners: (() => void)[];

  constructor(private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => {
        console.log('mousedown');
      }
    );

    const onMouseUp = this.renderer.listen(
      this.svgStructure.root,
      'mouseup',
      (mouseEv: MouseEvent) => {
        console.log('mouseup');
      }
    );

    this.listeners = [
      onMouseDown,
      onMouseUp,
    ];
    this.svgStructure.root.setAttribute('cursor', 'crosshair');
  }

  ngOnDestroy(): void {
    this.listeners.forEach((listener) => listener());
  }

}
