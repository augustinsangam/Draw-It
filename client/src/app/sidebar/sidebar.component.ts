import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { Page } from '../page/page';
import { ToolSelectorService } from '../tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

@Component({
  selector: 'app-sidebar',
  styleUrls: [
    './sidebar.component.css',
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements AfterViewInit {
  // Must be public
  @Output() pageEv: EventEmitter<Page>;

  // Must be public
  readonly pageType: typeof Page;
  // Must be public
  readonly selection: boolean[];
  // Must be public
  readonly toolType: typeof Tool;

  constructor(
    private readonly toolSelectorService: ToolSelectorService,
  ) {
    this.pageEv = new EventEmitter();
    this.pageType = Page;
    this.selection = new Array(Tool._Len);
    for (let tool = Tool._Len; --tool; ) {
      this.selection[tool] = false;
    }
    this.toolType = Tool;
  }

  // Must be pubilc
  ngAfterViewInit() {
    this.toolSelectorService.onChange(
      (tool, old) => this.setTool(tool, old));
  }

  private setTool(tool: Tool, old?: Tool): void {
    if (!!old) {
      this.selection[old] = false;
    }
    this.selection[tool] = true;
  }

  // Must be public
  selectTool(tool: Tool): void {
    this.toolSelectorService.set(tool);
  }
}
