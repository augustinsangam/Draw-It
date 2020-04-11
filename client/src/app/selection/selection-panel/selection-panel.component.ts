import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { OverlayService } from 'src/app/overlay/overlay.service';
import { DocEnum } from 'src/app/overlay/pages/documentation/doc-enum';
import { ToolPanelDirective } from '../../tool/tool-panel/tool-panel.directive';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-selection-panel',
  templateUrl: './selection-panel.component.html',
  styleUrls: ['./selection-panel.component.scss']
})
export class SelectionPanelComponent extends ToolPanelDirective implements AfterViewInit {

  @ViewChild('previewCircle', {
    static: false,
  }) private previewCircle: ElementRef<SVGElement>;

  @ViewChild('circles', {
    static: false,
    read: ElementRef
  }) private circles: ElementRef<SVGGElement>;

  constructor(elementRef: ElementRef<HTMLElement>,
              protected readonly service: SelectionService,
              private eventManager: EventManager,
              private renderer: Renderer2,
              private overlay: OverlayService) {
    super(elementRef);
  }

  protected showDocumentation(): void {
    this.overlay.openDocumentationDialog(false, DocEnum.selectionRectangle);
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const circles = Array.from(this.circles.nativeElement.children) as SVGElement[];
    this.setCircle(circles[this.service.magnetPoint]);
    for (const [index, circle] of circles.entries()) {
      this.eventManager.addEventListener(
        circle as unknown as HTMLElement,
        'click',
        () => {
          this.service.magnetPoint = index;
          this.setCircle(circle as SVGElement);
        }
      );
      this.renderer.setStyle(circle, 'cursor', 'pointer');
    }
  }

  private setCircle(circle: SVGElement): void {
    const cx = circle.getAttribute('cx') as string;
    const cy = circle.getAttribute('cy') as string;
    this.renderer.setAttribute(this.previewCircle.nativeElement, 'cx', cx);
    this.renderer.setAttribute(this.previewCircle.nativeElement, 'cy', cy);
  }

}
