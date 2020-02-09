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

  private toolToElRef: ElementRef<HTMLElement>[];

  // Must be pubilc
  constructor(private readonly toolSelectorService: ToolSelectorService) {
    this.documentationEv = new EventEmitter<null>();
    this.toolToElRef = new Array(Tool._Len);
  }

  // Must be pubilc
  ngAfterViewInit() {
    this.toolToElRef[Tool.Brush] = this.brushElRef;
    this.toolToElRef[Tool.Line] = this.lineElRef;
    this.toolToElRef[Tool.Pencil] = this.pencilElRef;
    this.toolToElRef[Tool.Rectangle] = this.rectangleElRef;
    this.toolSelectorService.onChange(
      (tool, old) => this.setTool(tool, old));
  }

  private setTool(tool: Tool, old?: Tool) {
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
