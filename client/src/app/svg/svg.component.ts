import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { DrawConfig, UndoRedoAction } from '../constants/constants';
import { MathematicsService } from '../mathematics/mathematics.service';
import { SharedService } from '../shared/shared.service';
import { ToolSelectorService } from '../tool-selector/tool-selector.service';
import { ColorService } from '../tool/color/color.service';
import { ToolDirective } from '../tool/tool.directive';
import { Tool } from '../tool/tool.enum';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Component({
  selector: 'app-svg',
  styleUrls: [
    './svg.component.css',
  ],
  templateUrl: './svg.component.svg',
})
export class SvgComponent implements AfterViewInit, OnDestroy {
  // Must be public
  @Input() config: DrawConfig;

  // Cannot be static because it contains elements that must be rendered
  // Must be public
  @ViewChild('container', {
    static: false,
  })
  readonly elementRef: ElementRef<SVGSVGElement>;

  private toolDirective?: ToolDirective;

  constructor(
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
    private readonly mathematicsService: MathematicsService,
    private readonly sharedService: SharedService,
    private readonly toolSelectorService: ToolSelectorService,
    private readonly undoRedoService: UndoRedoService,
  ) {}

  ngAfterViewInit(): void {
    // Save initial state
    const drawZone = this.elementRef.nativeElement.getElementById('zone');
    this.undoRedoService.save(UndoRedoAction.SVG, drawZone.cloneNode(true));

    this.undoRedoService.set(UndoRedoAction.SVG, (_redo, newChild: Node) => {
      this.toolDirective?.ngOnDestroy();
      const oldChild = this.elementRef.nativeElement.getElementById('zone');
      this.elementRef.nativeElement.replaceChild(
        newChild.cloneNode(true), oldChild);
      this.toolDirective?.ngOnInit();
    });

    this.toolSelectorService.onChange((tool) => this.setTool(tool));

    this.elementRef.nativeElement.style.backgroundColor = this.config.color;
    this.elementRef.nativeElement.setAttribute(
      'height', this.config.height.toString());
    this.elementRef.nativeElement.setAttribute(
      'width', this.config.width.toString());
  }

  ngOnDestroy(): void {
    this.toolDirective?.ngOnDestroy();
  }

  private setTool(tool: Tool): void {
    this.toolDirective?.ngOnDestroy();
    if (tool > Tool._None && tool < Tool._Len) {
      const toolDirective = this.sharedService.toolDirectives[tool];
      const toolService = this.sharedService.toolServices[tool];
      // Mimic angular directive internal builder
      this.toolDirective = new toolDirective(
        this.elementRef,
        this.colorService,
        this.mathematicsService,
        this.renderer,
        toolService,
        this.undoRedoService,
      );
      this.toolDirective.ngOnInit();
    }
  }
}
