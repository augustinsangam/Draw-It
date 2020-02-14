import { Component, ComponentFactoryResolver, HostBinding, OnInit, Type,
  ViewChild, ViewContainerRef } from '@angular/core';

import { BrushPanelComponent } from '../tool/brush/brush-panel/brush-panel.component';
import { LinePanelComponent } from '../tool/line/line-panel/line-panel.component';
import { PencilPanelComponent } from '../tool/pencil/pencil-panel/pencil-panel.component';
import { RectanglePanelComponent } from '../tool/rectangle/rectangle-panel/rectangle-panel.component';
import { ToolPanelComponent } from '../tool/tool-panel/tool-panel.component';
import { ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';
import {EllipsePanelComponent} from '../tool/ellipse/ellipse-panel/ellipse-panel.component';

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
  @HostBinding('style.width.px') hostWidth: number;
  private childWidth: number;

  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver,
              private readonly toolSelectorService: ToolSelectorService) {
    this.components = new Array(Tool._Len);
    this.components[Tool.Brush] = BrushPanelComponent;
    // this.components[Tool.Eraser] = EraserPanelCompnent;
    this.components[Tool.Line] = LinePanelComponent;
    this.components[Tool.Pencil] = PencilPanelComponent;
    this.components[Tool.Rectangle] = RectanglePanelComponent;
    this.components[Tool.Ellipse] = EllipsePanelComponent;
    this.childWidth = 0;
    // Panel is collapsed by default
    this.hostWidth = 0;
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
    this.hostWidth = this.childWidth = width;
  }

  private toggle() {
    if (this.hostWidth) {
      this.hostWidth = 0;
    } else {
      this.hostWidth = this.childWidth;
    }
  }
}
