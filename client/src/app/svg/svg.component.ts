import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  BrushLogicComponent
} from '../tool/drawing-instruments/brush/brush-logic/brush-logic.component';
import {
  PencilLogicComponent
} from '../tool/drawing-instruments/pencil/pencil-logic/pencil-logic.component';
import {
  LineLogicComponent
} from '../tool/shape/line/line-logic/line-logic.component';
import {
  RectangleLogicComponent
} from '../tool/shape/rectangle/rectangle-logic/rectangle-logic.component';
import {
  ToolLogicDirective } from '../tool/tool-logic/tool-logic.directive';
import {
  ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

@Component({
  selector: '[app-svg]',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss']
})
export class SvgComponent implements OnInit {
  @ViewChild('container', {
    read: ViewContainerRef,
    static: true
  })
  private viewContainerRef: ViewContainerRef;
  private readonly components: Type<ToolLogicDirective>[];

  constructor(
    private readonly elementRef: ElementRef<SVGElement>,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly toolSelectorService: ToolSelectorService
  ) {
    this.components = new Array(Tool._Len);
    this.components[Tool.Brush] = BrushLogicComponent;
    this.components[Tool.Line] = LineLogicComponent;
    this.components[Tool.Pencil] = PencilLogicComponent;
    this.components[Tool.Rectangle] = RectangleLogicComponent;
  }

  private setToolHandler = (tool: Tool) => this.setTool(tool);

  ngOnInit() {
    this.toolSelectorService.onChange(this.setToolHandler);
  }

  private setTool(tool: Tool): ComponentRef<ToolLogicDirective> {
    this.viewContainerRef.clear();
    const component = this.components[tool];
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      component
    );
    let ref: ComponentRef<ToolLogicDirective>;
    ref = this.viewContainerRef.createComponent(factory);
    ref.instance.svgElRef = this.elementRef;
    ref.changeDetectorRef.detectChanges();
    return ref;
  }
}
