import { Component, ComponentFactoryResolver, ElementRef, Type, ViewChild,
  ViewContainerRef } from '@angular/core';

import { BrushLogicComponent } from '../tool/brush/brush-logic/brush-logic.component';
import { ColorLogicComponent } from '../tool/color/color-logic/color-logic.component';
import { PencilLogicComponent } from '../tool/pencil/pencil-logic/pencil-logic.component';
import { ToolLogicComponent } from '../tool/tool-logic/tool-logic.component';
import { ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

@Component({
  selector: '[app-svg]',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss']
})
export class SvgComponent {
  @ViewChild('container', {
    read: ViewContainerRef,
    static: true,
  }) private viewContainerRef: ViewContainerRef;
  private readonly components: Type<ToolLogicComponent>[];

  constructor(private readonly elementRef: ElementRef<SVGElement>,
              private readonly componentFactoryResolver: ComponentFactoryResolver,
              toolSelectorService: ToolSelectorService) {
    this.components = new Array(Tool._Len);
    this.components[Tool.Brush] = BrushLogicComponent;
    this.components[Tool.Color] = ColorLogicComponent;
    // this.components[Tool.Eraser] = EraserLogicCompnent;
    this.components[Tool.Pencil] = PencilLogicComponent;
    toolSelectorService.listen(tool => this.setTool(tool));
  }

  private setTool(tool: Tool) {
    this.viewContainerRef.clear();
    const component = this.components[tool];
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.instance.svgElRef = this.elementRef;
    ref.changeDetectorRef.detectChanges();
  }
}
