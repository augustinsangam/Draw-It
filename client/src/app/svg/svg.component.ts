import {
  AfterViewInit,
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
  SVGStructure,
  ToolLogicDirective
} from '../tool/tool-logic/tool-logic.directive';
import {
  ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

import * as Tools from '../tool/tools';
import { SvgService } from './svg.service';

@Component({
  selector: '[app-svg]',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss']
})
export class SvgComponent implements OnInit, AfterViewInit {

  @ViewChild('container', {
    read: ViewContainerRef,
    static: true
  }) private viewContainerRef: ViewContainerRef;

  @ViewChild('drawZone', {
    static: false,
    read: SVGGElement
  }) private drawZone: SVGGElement;

  @ViewChild('temporaryZone', {
    static: false,
    read: SVGGElement
  }) private temporaryZone: SVGGElement;

  @ViewChild('endZone', {
    static: false,
    read: SVGGElement
  }) private endZone: SVGGElement;

  private svgStructure: SVGStructure;

  private readonly components: Type<ToolLogicDirective>[];

  constructor(
    private readonly elementRef: ElementRef<SVGSVGElement>,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly toolSelectorService: ToolSelectorService,
    private readonly svgService: SvgService
  ) {
    this.components = new Array(Tool._Len)
    for ( const entry of Tools.TOOL_MANAGER ) {
      this.components[entry[0]] = entry[1][1];
    }
  }

  private setToolHandler = (tool: Tool) => this.setTool(tool);

  ngOnInit() {
    this.toolSelectorService.onChange(this.setToolHandler);
  }

  ngAfterViewInit() {
    this.svgStructure = {
      root: this.elementRef.nativeElement,
      drawZone: this.drawZone,
      temporaryZone: this.temporaryZone,
      endZone: this.endZone
    };
    this.svgService.structure = this.svgStructure;
  }

  private setTool(tool: Tool): ComponentRef<ToolLogicDirective> {
    this.viewContainerRef.clear();
    const component = this.components[tool];
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      component
    );
    let ref: ComponentRef<ToolLogicDirective>;
    ref = this.viewContainerRef.createComponent(factory);
    ref.instance.svgStructure = this.svgStructure;
    ref.changeDetectorRef.detectChanges();
    return ref;
  }
}
