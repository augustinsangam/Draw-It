import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  HostBinding,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  ToolPanelDirective } from '../tool/tool-panel/tool-panel.directive';
import {
  ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

import { EventManager } from '@angular/platform-browser';
import { ColorBoxComponent } from '../tool/color/color-box/color-box.component';
import * as Tools from '../tool/tools';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @ViewChild('container', {
    read: ViewContainerRef,
    static: true
  }) private viewContainerRef: ViewContainerRef;

  @ViewChild('chatBox', {
    read: ViewContainerRef,
    static: true
  }) private chatBoxRef: ViewContainerRef;

  @HostBinding('style.width.px')
  private hostWidth: number;

  private readonly components: Type<ToolPanelDirective>[];
  private childWidth: number;
  private currentTool: Tool;

  constructor(
    private elRef: ElementRef,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly toolSelectorService: ToolSelectorService,
    private readonly eventManager: EventManager
  ) {
    this.components = new Array(Tool._Len);
    for ( const entry of Tools.TOOL_MANAGER ) {
      this.components[entry[0]] = entry[1][0];
    }
    this.childWidth = 0;
    this.hostWidth = 0;
  }

  ngOnInit(): void {
    this.toolSelectorService.onSame(() => this.toggle());
    this.toolSelectorService.onChange((tool: Tool) => this.setTool(tool));
    this.eventManager.addEventListener(
      this.elRef.nativeElement,
      'click',
      (event: MouseEvent) => {
        if (event.target === this.elRef.nativeElement) {
          this.onBoxClicked(false);
        }
      }
    );
  }

  private toggle(): void {
    this.hostWidth = this.hostWidth ? 0 : this.childWidth;
    this.chatBoxRef.clear();
    if (this.hostWidth !== 0) {
      this.addColorBox();
    }
  }

  private setTool(tool: Tool): ComponentRef<ToolPanelDirective> | null {
    this.currentTool = tool;
    if (tool < Tool._Len) {
      this.viewContainerRef.clear();
      const component = this.components[tool];
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        component
      );
      const ref = this.viewContainerRef.createComponent(factory);
      ref.instance.width.subscribe((w: number) => this.setWidthOfChild(w));
      ref.changeDetectorRef.detectChanges();
      this.chatBoxRef.clear();
      this.addColorBox();
      return ref;
    }
    return null;
  }

  addColorBox(): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(ColorBoxComponent);
    const componentInstance = this.chatBoxRef.createComponent(factory).instance;
    componentInstance.expandStatus.subscribe((value) => {
      this.onBoxClicked(value);
    });
  }

  onBoxClicked(isExpanded: boolean): void {
    if (isExpanded) {
      this.viewContainerRef.clear();
    } else {
      this.setTool(this.currentTool);
    }
  }

  private setWidthOfChild(width: number): void {
    this.hostWidth = this.childWidth = width;
  }

}
