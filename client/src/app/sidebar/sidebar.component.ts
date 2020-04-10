import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { SvgService } from '../svg/svg.service';
import {
  ToolSelectorService
} from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit, AfterViewChecked {

  @ViewChild('line', { static: false })
  protected lineElRef: ElementRef<HTMLElement>;

  @ViewChild('rectangle', { static: false })
  protected rectangleElRef: ElementRef<HTMLElement>;

  @ViewChild('polygone', {
    static: false,
  })
  protected polygoneElRef: ElementRef<HTMLElement>;

  @ViewChild('pencil', {
    static: false,
  })
  protected pencilElRef: ElementRef<HTMLElement>;

  @ViewChild('brush', {
    static: false,
  })
  protected brushElRef: ElementRef<HTMLElement>;

  @ViewChild('ellipse', {
    static: false
  })
  protected ellipseElRef: ElementRef<HTMLElement>;

  @ViewChild('pipette', {
    static: false
  })
  protected pipetteElRef: ElementRef<HTMLElement>;

  @ViewChild('efface', {
    static: false,
  })
  protected eraserElRef: ElementRef<HTMLElement>;

  @ViewChild('selection', {
    static: false,
  })
  protected selectionElRef: ElementRef<HTMLElement>;

  @ViewChild('aerosol', {
    static: false,
  })
  protected aerosolElRef: ElementRef<HTMLElement>;

  @ViewChild('applicator', {
    static: false,
  })
  protected applicatorElRef: ElementRef<HTMLElement>;

  @ViewChild('grid', {
    static: false,
  })
  protected gridElRef: ElementRef<HTMLElement>;

  @ViewChild('text', {
    static: false,
  })
  protected textElRef: ElementRef<HTMLElement>;

  @ViewChild('bucket', {
    static: false,
  })
  protected bucketElRef: ElementRef<HTMLElement>;

  @ViewChild('plume', {
    static: false,
  })
  protected featherpenElRef: ElementRef<HTMLElement>;

  @Output() protected documentationEvent: EventEmitter<null>;
  @Output() protected exportEvent: EventEmitter<null>;
  @Output() protected saveEvent: EventEmitter<null>;
  @Output() protected homeEvent: EventEmitter<null>;
  @Output() protected galleryEvent: EventEmitter<null>;

  private toolToElRef: ElementRef<HTMLElement>[];
  protected Tool: typeof Tool = Tool;

  private canUndo: boolean;
  private canRedo: boolean;

  constructor(private readonly toolSelectorService: ToolSelectorService,
              protected readonly undoRedoService: UndoRedoService,
              private changeDetectorRef: ChangeDetectorRef,
              private svgService: SvgService,
              private renderer: Renderer2
  ) {
    this.documentationEvent   = new EventEmitter();
    this.exportEvent          = new EventEmitter();
    this.saveEvent            = new EventEmitter();
    this.homeEvent            = new EventEmitter();
    this.galleryEvent         = new EventEmitter();
    this.toolToElRef          = new Array(Tool._Len);
  }

  ngAfterViewInit(): void {
    this.toolToElRef[Tool.Aerosol]    = this.aerosolElRef;
    this.toolToElRef[Tool.Applicator] = this.applicatorElRef;
    this.toolToElRef[Tool.Bucket]     = this.bucketElRef;
    this.toolToElRef[Tool.Brush]      = this.brushElRef;
    this.toolToElRef[Tool.Ellipse]    = this.ellipseElRef;
    this.toolToElRef[Tool.Eraser]     = this.eraserElRef;
    this.toolToElRef[Tool.FeatherPen] = this.featherpenElRef;
    this.toolToElRef[Tool.Grid]       = this.gridElRef;
    this.toolToElRef[Tool.Line]       = this.lineElRef;
    this.toolToElRef[Tool.Pencil]     = this.pencilElRef;
    this.toolToElRef[Tool.Pipette]    = this.pipetteElRef;
    this.toolToElRef[Tool.Polygone]   = this.polygoneElRef;
    this.toolToElRef[Tool.Rectangle]  = this.rectangleElRef;
    this.toolToElRef[Tool.Selection]  = this.selectionElRef;
    this.toolToElRef[Tool.Text]       = this.textElRef;
    this.toolSelectorService.onChange(
      (tool, old) => this.setTool(tool, old));
  }

  ngAfterViewChecked(): void {
    const canUndo = this.undoRedoService.canUndo();
    const canRedo = this.undoRedoService.canRedo();
    if (canUndo !== this.canUndo) {
      this.canUndo = canUndo;
      this.changeDetectorRef.detectChanges();
    }
    if (canRedo !== this.canRedo) {
      this.canRedo = canRedo;
      this.changeDetectorRef.detectChanges();
    }
    let elementInDrawZone = false;
    if (!!this.svgService.structure) {
      elementInDrawZone = this.svgService.structure.drawZone.childElementCount !== 0;
    }
    this.svgService.drawInProgress = elementInDrawZone || canRedo || canUndo;

  }

  private setTool(tool: Tool, old?: Tool): void {
    if (old != null && old < Tool._Len) {
      const oldElRef = this.toolToElRef[old];
      this.renderer.removeClass(oldElRef.nativeElement, 'selected');
    }
    if (tool < Tool._Len) {
      const elRef = this.toolToElRef[tool];
      this.renderer.addClass(elRef.nativeElement, 'selected');
    }
  }

}
