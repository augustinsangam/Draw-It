import { Component, ComponentFactoryResolver, Type, ViewChild,
  ViewContainerRef } from '@angular/core';

import { BrushPanelComponent } from '../tool/brush/brush-panel/brush-panel.component';
import { PencilPanelComponent } from '../tool/pencil/pencil-panel/pencil-panel.component';
import { ToolPanelComponent } from '../tool/tool-panel/tool-panel.component';
import { ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  @ViewChild('container', {
    read: ViewContainerRef,
    static: false, // FIXME: Is it true or false?
  }) private viewContainerRef: ViewContainerRef;
  private readonly components: Type<ToolPanelComponent>[];
  protected collapsePanel: boolean;

  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver,
             toolSelectorService: ToolSelectorService) {
    this.collapsePanel = false;
    this.components = new Array(Tool._Len);
    this.components[Tool.Brush] = BrushPanelComponent;
    this.components[Tool.Pencil] = PencilPanelComponent;
    toolSelectorService.listen(tool => this.setTool(tool));
  }

  private setTool(tool: Tool) {
    this.viewContainerRef.clear();
    const component = this.components[tool];
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
}
