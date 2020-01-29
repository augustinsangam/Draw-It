import { Component, EventEmitter, Output } from '@angular/core';

import { ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() selectedTool: EventEmitter<Tool>;
  private selectedElDOMTokenList: DOMTokenList;

  constructor(private readonly toolSelectorService: ToolSelectorService) {
    this.selectedTool = new EventEmitter<Tool>();
  }

  selectTool(tool: Tool, {classList}: HTMLElement) {
    // TODO: TypeScript 3.7: this.selectedElDOMTokenList?.remove(…)
    if (!!this.selectedElDOMTokenList) {
      this.selectedElDOMTokenList.remove('selected');
    }
    classList.add('selected');
    this.selectedElDOMTokenList = classList;
    this.toolSelectorService.set(tool);
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

  selectColor({target}: MouseEvent) {
    this.selectTool(Tool.Color, target as HTMLElement);
  }
}
