import { Component, ComponentFactoryResolver, ElementRef, OnInit, Type,
  ViewChild, ViewContainerRef } from '@angular/core';

import { BrushLogicComponent } from '../tool/brush/brush-logic/brush-logic.component';
import { LineLogicComponent } from '../tool/line/line-logic/line-logic.component';
import { PencilLogicComponent } from '../tool/pencil/pencil-logic/pencil-logic.component';
import { RectangleLogicComponent } from '../tool/rectangle/rectangle-logic/rectangle-logic.component';
import { ToolLogicDirective } from '../tool/tool-logic/tool-logic.directive';
import { ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

@Component({
  selector: '[app-svg]',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss']
})
export class SvgComponent implements OnInit {

  @ViewChild('container', {
    read: ViewContainerRef,
    static: true,
  }) private viewContainerRef: ViewContainerRef;
  private readonly components: Type<ToolLogicDirective>[];

  constructor(private readonly elementRef: ElementRef<SVGElement>,
              private readonly componentFactoryResolver: ComponentFactoryResolver,
              private readonly toolSelectorService: ToolSelectorService) {
    this.components = new Array(Tool._Len);
    this.components[Tool.Brush] = BrushLogicComponent;
    // this.components[Tool.Eraser] = EraserLogicCompnent;
    this.components[Tool.Line] = LineLogicComponent;
    this.components[Tool.Pencil] = PencilLogicComponent;
    this.components[Tool.Rectangle] = RectangleLogicComponent;
  }

  ngOnInit() {
    this.toolSelectorService.onChange(tool => this.setTool(tool));
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
