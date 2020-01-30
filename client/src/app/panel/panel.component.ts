import { Component, ComponentFactoryResolver, HostBinding, OnInit, Type,
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
  private readonly components: Type<ToolPanelComponent>[];
  @ViewChild('container', {
    read: ViewContainerRef,
    static: true,
  }) private viewContainerRef: ViewContainerRef;
  @HostBinding('style.width.px') width: number;
  private widthOfChild: number;

  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver,
              private readonly toolSelectorService: ToolSelectorService) {
    this.components = new Array(Tool._Len);
    this.components[Tool.Brush] = BrushPanelComponent;
    this.components[Tool.Color] = ColorPanelComponent;
    // this.components[Tool.Eraser] = EraserPanelCompnent;
    this.components[Tool.Pencil] = PencilPanelComponent;
    this.widthOfChild = 0;
    // Panel is collapsed by default
    this.width = 0;
  }

  ngOnInit() {
    this.toolSelectorService.onChange(tool => this.setTool(tool));
    this.toolSelectorService.onSame(() => this.toggle());
  }

  private setTool(tool: Tool) {
    this.viewContainerRef.clear();
    const component = this.components[tool];
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    const ref = this.viewContainerRef.createComponent(factory);
    // TODO: param w/o explicit cast to number
    ref.instance.width.subscribe((w: number) => this.setWidthOfChild(w));
    ref.changeDetectorRef.detectChanges();
  }

  private setWidthOfChild(width: number) {
    console.log('WIDTH SET TO ' + width);
    console.log('OLD WIDTHOFCHILD is ' + this.widthOfChild);
    this.widthOfChild = this.width = width;
  }

  private toggle() {
    if (this.width) {
      this.width= 0;
    } else {
      this.width = this.widthOfChild;
    }
  }
}
