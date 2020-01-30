import { Component, ComponentFactoryResolver, ElementRef, OnInit, Type,
  ViewChild, ViewContainerRef } from '@angular/core';

import { BrushPanelComponent } from '../tool/brush/brush-panel/brush-panel.component';
import { ColorPanelComponent } from '../tool/color/color-panel/color-panel.component';
import { PencilPanelComponent } from '../tool/pencil/pencil-panel/pencil-panel.component';
import { ToolPanelComponent } from '../tool/tool-panel/tool-panel.component';
import { ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @ViewChild('container', {
    read: ViewContainerRef,
    static: true,
  }) private viewContainerRef: ViewContainerRef;
  private readonly components: Type<ToolPanelComponent>[];
  private collapse: boolean;

  constructor(private readonly elementRef: ElementRef<HTMLElement>,
              private readonly componentFactoryResolver: ComponentFactoryResolver,
              private readonly toolSelectorService: ToolSelectorService) {
    this.components = new Array(Tool._Len);
    this.components[Tool.Brush] = BrushPanelComponent;
    this.components[Tool.Color] = ColorPanelComponent;
    // this.components[Tool.Eraser] = EraserPanelCompnent;
    this.components[Tool.Pencil] = PencilPanelComponent;
    this.collapse = true;
  }

  ngOnInit() {
    // TODO: use elementRef to toggle width from 0 to viewContainerRef’s width
    // this.toolSelectorService.onSame(tool => this);
    this.toolSelectorService.onChange(tool => this.setTool(tool));
  }

  private setTool(tool: Tool) {
    this.viewContainerRef.clear();
    const component = this.components[tool];
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
    // TODO: child.ngAfterViewInit => send width and set to elementRef
  }
}
