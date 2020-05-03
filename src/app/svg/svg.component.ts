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
  ToolLogicDirective
} from '../tool/tool-logic/tool-logic.directive';
import {
  ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';
import { SVGStructure } from './svg-structure';

import * as Tools from '../tool/tools';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
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

  @ViewChild('defsZone', {
    static: true,
  }) private defsZone: ElementRef<SVGGElement>;

  @ViewChild('drawZone', {
    static: true,
  }) private drawZone: ElementRef<SVGGElement>;

  @ViewChild('temporaryZone', {
    static: true,
  }) private temporaryZone: ElementRef<SVGGElement>;

  @ViewChild('endZone', {
    static: true,
  }) private endZone: ElementRef<SVGGElement>;

  private svgStructure: SVGStructure;
  private readonly components: Type<ToolLogicDirective>[];

  constructor(
    private readonly elementRef: ElementRef<SVGSVGElement>,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly toolSelectorService: ToolSelectorService,
    private readonly svgService: SvgService,
    private readonly undoRedoService: UndoRedoService
  ) {
    this.components = new Array(Tool._Len);
    for ( const entry of Tools.TOOL_MANAGER ) {
      this.components[entry[0]] = entry[1][1];
    }
  }

  private setToolHandler = (tool: Tool) => this.setTool(tool);

  ngOnInit(): void {
    this.toolSelectorService.onChange(this.setToolHandler);
  }

  ngAfterViewInit(): void {
    this.svgStructure = {
      root: this.elementRef.nativeElement,
      defsZone: this.defsZone.nativeElement,
      drawZone: this.drawZone.nativeElement,
      temporaryZone: this.temporaryZone.nativeElement,
      endZone: this.endZone.nativeElement
    };
    this.svgService.structure = this.svgStructure;
    this.undoRedoService.intialise(this.svgStructure);
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
    ref.instance.svgShape = this.svgService.shape;
    ref.changeDetectorRef.detectChanges();
    return ref;
  }
}
