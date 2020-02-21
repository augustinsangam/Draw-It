import { Component, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-applicator-logic',
  templateUrl: './applicator-logic.component.html',
  styleUrls: ['./applicator-logic.component.scss']
})
export class ApplicatorLogicComponent extends ToolLogicDirective {

  constructor(private renderer: Renderer2, private colorService: ColorService) {
    super();
  }

  private handlers = {
    left: ($event: MouseEvent) => {
      if (this.isSvgElement($event.target as SVGElement)) {
        if ($event.target instanceof SVGPathElement) {
            ($event.target as SVGElement)
          .setAttribute('stroke', this.colorService.primaryColor);
        } else {
          const fill = ($event.target as SVGElement).getAttribute('fill');
          const isFilled = (fill !== null && fill !== 'none');
          if (isFilled) {
            ($event.target as SVGElement)
            .setAttribute('fill', this.colorService.primaryColor);
          }
        }
      }
    },
    right: ($event: MouseEvent) => {
      $event.preventDefault();
      if (this.isSvgElement($event.target as SVGElement)
        && !($event.target instanceof SVGPathElement)) {
        ($event.target as SVGElement)
        .setAttribute('stroke', this.colorService.secondaryColor);
      }
    }
  }

  // Bug de lint - Tool Logic directive implémente OnInit
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.renderer.listen(this.svgElRef.nativeElement, 'click',
      this.handlers.left);

    this.renderer.listen(this.svgElRef.nativeElement, 'contextmenu',
      this.handlers.right);
  }

  private isSvgElement(element: SVGElement): boolean {
    return element !== this.svgElRef.nativeElement;
  }

}
