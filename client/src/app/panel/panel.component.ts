import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { SharedService } from '../shared/shared.service';
import { ToolSelectorService } from '../tool-selector/tool-selector.service';
import { ToolComponent } from '../tool/tool.component';
import { Tool } from '../tool/tool.enum';

@Component({
  selector: 'app-panel',
  styleUrls: [
    './panel.component.css',
  ],
  templateUrl: './panel.component.html',
})
export class PanelComponent implements OnInit {
  @ViewChild('container', {
    read: ViewContainerRef,
    static: true,
  })
  private viewContainerRef: ViewContainerRef;

  @HostBinding('style.width.px')
  // Must be public
  hostWidth: number;

  private childWidth: number;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly sharedService: SharedService,
    private readonly toolSelectorService: ToolSelectorService,
  ) {
    // Panel is collapsed by default
    this.setWidthOfChild(0);
  }

  ngOnInit(): void {
    this.toolSelectorService.onSame(() => this.toggle());
    this.toolSelectorService.onChange((tool: Tool) => this.setTool(tool));
  }

  private setWidthOfChild(width: number): void {
    this.hostWidth = this.childWidth = width;
  }

  private toggle(): void {
    this.hostWidth = this.hostWidth ? 0 : this.childWidth;
  }

  private setTool(tool: Tool): ComponentRef<ToolComponent> | null {
    const component = this.sharedService.toolComponents[tool];
    if (!!component) {
      this.viewContainerRef.clear();
      const componentFactory = this.componentFactoryResolver
        .resolveComponentFactory(component);
      const componentRef = this.viewContainerRef
        .createComponent(componentFactory);
      componentRef.instance.width.subscribe(
        (w: number) => this.setWidthOfChild(w));
      componentRef.changeDetectorRef.detectChanges();
      return componentRef;
    }
    return null;
  }
}
