import { Component, ComponentFactoryResolver, Input, Type, ViewChild,
  ViewContainerRef } from '@angular/core';

import { Tool } from '../tool/tool.enum';
import { ToolPanelComponent } from '../tool/tool-panel/tool-panel.component';
import { BrushPanelComponent } from '../tool/brush/brush-panel/brush-panel.component';
import { PencilPanelComponent } from '../tool/pencil/pencil-panel/pencil-panel.component';

@Component({
  selector: 'draw-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  @ViewChild('container', {
    read: ViewContainerRef,
    static: true, // FIXME: Is it true or false?
  }) private viewContainerRef: ViewContainerRef;
  private readonly components: Type<ToolPanelComponent>[];
  collapsePanel: boolean;

  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver) {
    this.collapsePanel = false;
    this.components = new Array(Tool._Len);
    this.components[Tool.Brush] = BrushPanelComponent;
    this.components[Tool.Pencil] = PencilPanelComponent;
  }

  @Input()
  set tool(tool: Tool) {
    // FIXME: ERROR Error: "No component factory found for undefined. Did you add it to @NgModule.entryComponents?"
    if (tool != null) {
      console.log('PANEL: Tool is ' + tool);
      this.viewContainerRef.clear();
      const component = this.components[tool];
      const factory = this.componentFactoryResolver.resolveComponentFactory(component);
      const ref = this.viewContainerRef.createComponent(factory);
      ref.changeDetectorRef.detectChanges();
    }
  }
}