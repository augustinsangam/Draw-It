import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import { ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
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
  protected lineElRef: ElementRef<HTMLElement>

  @ViewChild('rectangle', {
    static: false,
  })
  protected rectangleElRef: ElementRef<HTMLElement>

  @ViewChild('pencil', {
    static: false,
  })
  protected pencilElRef: ElementRef<HTMLElement>

  @ViewChild('brush', {
    static: false,
  })
  protected brushElRef: ElementRef<HTMLElement>

  @Output() protected documentationEv: EventEmitter<null>;

  private toolToElRef: Map<Tool, ElementRef<HTMLElement>>;

  // Must be pubilc
  constructor(private readonly toolSelectorService: ToolSelectorService) {
    this.documentationEv = new EventEmitter<null>();
    this.toolToElRef = new Map();
  }

  // Must be pubilc
  ngAfterViewInit() {
    this.toolToElRef.set(Tool.Line, this.lineElRef);
    this.toolToElRef.set(Tool.Rectangle, this.rectangleElRef);
    this.toolToElRef.set(Tool.Pencil, this.pencilElRef);
    this.toolToElRef.set(Tool.Brush, this.brushElRef);
    this.toolSelectorService.onChange(
      (tool, old) => this.selectTool(tool, old));
  }

  private selectTool(tool: Tool, old?: Tool) {
    // TODO: TS 3.7 get(…)?.nativeEl w/o ‘has’ check
    if (old != null) {
      const oldElRef = this.toolToElRef.get(old);
      if (!!oldElRef) {
        oldElRef.nativeElement.classList.remove('selected');
      }
    }
    const elRef = this.toolToElRef.get(tool);
    if (!!elRef) {
      elRef.nativeElement.classList.add('selected');
    }
  }

  protected selectLine() {
    this.toolSelectorService.set(Tool.Line);
  }

  protected selectRectangle() {
    this.toolSelectorService.set(Tool.Rectangle);
  }

  protected selectPencil() {
    this.toolSelectorService.set(Tool.Pencil);
  }

  protected selectBrush() {
    this.toolSelectorService.set(Tool.Brush);
  }
}
