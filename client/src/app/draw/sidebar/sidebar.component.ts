import { Component, EventEmitter, Output } from '@angular/core';

import { Tool } from '../tool/tool.enum';

@Component({
  selector: 'draw-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() selectedTool: EventEmitter<Tool>;
  private selectedToolLocal: Tool;
  private selectedElDOMTokenList: DOMTokenList;

  constructor() {
    this.selectedTool = new EventEmitter<Tool>();
  }

  selectTool(tool: Tool, {classList}: HTMLElement) {
    if (this.selectedToolLocal !== tool) {
      this.selectedToolLocal = tool;
      // TODO: TypeScript 3.7: this.selectedElDOMTokenList?.remove(…)
      if (!!this.selectedElDOMTokenList) {
        this.selectedElDOMTokenList.remove('selected');
      }
      classList.add('selected');
      this.selectedElDOMTokenList = classList;
      this.selectedTool.emit(tool);
    }
  }

  selectPencil({target}: MouseEvent) {
    this.selectTool(Tool.Pencil, target as HTMLElement);
  }

  selectBrush({target}: MouseEvent) {
    this.selectTool(Tool.Brush, target as HTMLElement);
  }

  selectEraser({target}: MouseEvent) {
    this.selectTool(Tool.Eraser, target as HTMLElement);
  }
}
