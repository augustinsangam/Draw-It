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
  @Output() protected importEvent: EventEmitter<null>;

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
    this.importEvent          = new EventEmitter();
    this.toolToElRef          = new Array(Tool._Len);
  }

  ngAfterViewInit(): void {
    this.toolToElRef[Tool.AEROSOL]     = this.aerosolElRef;
    this.toolToElRef[Tool.APPLICATOR]  = this.applicatorElRef;
    this.toolToElRef[Tool.BUCKET]      = this.bucketElRef;
    this.toolToElRef[Tool.BRUSH]       = this.brushElRef;
    this.toolToElRef[Tool.ELLIPSE]     = this.ellipseElRef;
    this.toolToElRef[Tool.ERASER]      = this.eraserElRef;
    this.toolToElRef[Tool.FEATHER_PEN] = this.featherpenElRef;
    this.toolToElRef[Tool.GRID]        = this.gridElRef;
    this.toolToElRef[Tool.LINE]        = this.lineElRef;
    this.toolToElRef[Tool.PENCIL]      = this.pencilElRef;
    this.toolToElRef[Tool.PIPETTE]     = this.pipetteElRef;
    this.toolToElRef[Tool.POLYGONE]    = this.polygoneElRef;
    this.toolToElRef[Tool.RECTANGLE]   = this.rectangleElRef;
    this.toolToElRef[Tool.SELECTION]   = this.selectionElRef;
    this.toolToElRef[Tool.TEXT]        = this.textElRef;
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
