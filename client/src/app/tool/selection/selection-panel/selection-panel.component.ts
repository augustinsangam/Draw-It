import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-selection-panel',
  templateUrl: './selection-panel.component.html',
  styleUrls: ['./selection-panel.component.scss']
})
export class SelectionPanelComponent extends ToolPanelDirective implements AfterViewInit {

  @ViewChild('previewCircle', {
    static: false,
  }) previewCircle: ElementRef<SVGElement>;

  @ViewChild('circles', {
    static: false,
  }) circles: ElementRef<SVGGElement>;

  constructor(elementRef: ElementRef<HTMLElement>,
              protected readonly service: SelectionService,
              private eventManager: EventManager,
              private renderer: Renderer2) {
    super(elementRef);
  }

  ngAfterViewInit(): void {
    const circles = Array.from(this.circles.nativeElement.children);
    for (const [index, circle] of circles.entries()) {
      this.eventManager.addEventListener(
        circle as unknown as HTMLElement,
        'click',
        () => {
          this.service.magnetPoint = index;
          const cx = circle.getAttribute('cx') as string;
          const cy = circle.getAttribute('cy') as string;
          this.renderer.setAttribute(this.previewCircle.nativeElement, 'cx', cx);
          this.renderer.setAttribute(this.previewCircle.nativeElement, 'cy', cy);
        }
      );
      this.renderer.setStyle(circle, 'cursor', 'pointer');
    }
  }

}
