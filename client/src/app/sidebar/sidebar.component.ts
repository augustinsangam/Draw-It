import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import {
  ToolSelectorService
} from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {

  @ViewChild('line', {
    static: false,
  })
  protected lineElRef: ElementRef<HTMLElement>;

  @ViewChild('rectangle', {
    static: false,
  })
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

  @Output() protected documentationEvent: EventEmitter<null>;
  @Output() protected exportEvent: EventEmitter<null>;

  private toolToElRef: ElementRef<HTMLElement>[];

  // Must be pubilc
  constructor(private readonly toolSelectorService: ToolSelectorService) {
    this.documentationEvent = new EventEmitter<null>();
    this.exportEvent = new EventEmitter<null>();
    this.toolToElRef = new Array(Tool._Len);
  }

  // Must be pubilc
  ngAfterViewInit() {
    this.toolToElRef[Tool.Applicator] = this.applicatorElRef;
    this.toolToElRef[Tool.Brush] = this.brushElRef;
    this.toolToElRef[Tool.Eraser] = this.eraserElRef;
    this.toolToElRef[Tool.Line] = this.lineElRef;
    this.toolToElRef[Tool.Pencil] = this.pencilElRef;
    this.toolToElRef[Tool.Pipette] = this.pipetteElRef;
    this.toolToElRef[Tool.Polygone] = this.polygoneElRef;
    this.toolToElRef[Tool.Rectangle] = this.rectangleElRef;
    this.toolToElRef[Tool.Selection] = this.selectionElRef;
    this.toolToElRef[Tool.Ellipse] = this.ellipseElRef;
    this.toolToElRef[Tool.Polygone] = this.polygoneElRef;
    this.toolToElRef[Tool.Aerosol] = this.aerosolElRef;
    this.toolSelectorService.onChange(
      (tool, old) => this.setTool(tool, old));
  }

  private setTool(tool: Tool, old?: Tool): void {
    // TODO: TS 3.7 get(…)?.nativeEl w/o ‘has’ check
    if (old != null && old < Tool._Len) {
      const oldElRef = this.toolToElRef[old];
      oldElRef.nativeElement.classList.remove('selected');
    }
    if (tool < Tool._Len) {
      const elRef = this.toolToElRef[tool];
      elRef.nativeElement.classList.add('selected');
    }
  }

  protected selectLine(): void {
    this.toolSelectorService.set(Tool.Line);
  }

  protected selectEraser(): void {
    this.toolSelectorService.set(Tool.Eraser);
  }

  protected selectRectangle(): void {
    this.toolSelectorService.set(Tool.Rectangle);
  }

  protected selectPolygone(): void {
    this.toolSelectorService.set(Tool.Polygone);
  }

  protected selectPencil(): void {
    this.toolSelectorService.set(Tool.Pencil);
  }

  protected selectBrush(): void {
    this.toolSelectorService.set(Tool.Brush);
  }

  protected selectSelection(): void {
    this.toolSelectorService.set(Tool.Selection);
  }

  protected selectEllipse(): void {
    this.toolSelectorService.set(Tool.Ellipse);
  }

  protected selectPipette(): void {
    this.toolSelectorService.set(Tool.Pipette);
  }

  protected selectAerosol(): void {
    this.toolSelectorService.set(Tool.Aerosol);
  }

  protected selectApplicator(): void {
    this.toolSelectorService.set(Tool.Applicator);
  }

  protected selectGrid(): void {
    this.toolSelectorService.set(Tool.Grid);
  }
}
