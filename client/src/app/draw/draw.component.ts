import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import SharedEvents from './shared-events';
import { BrushService } from './tool/brush/brush.service';
import { PencilService } from './tool/pencil/pencil.service';
import { Tool } from './tool/tool.enum';
import { ToolService } from './tool/tool.service';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements AfterViewInit {
  @ViewChild('panel', {
    static: false,
  }) panel: ElementRef<HTMLElement>;
  sharedEvents: SharedEvents;
  toolServices: ToolService[];
  selectedTool: Tool;
  toggle: boolean;

  // TODO: Move logic to draw.service.ts
  constructor(pencilService: PencilService, brushService: BrushService) {
    this.toggle = false;
    this.toolServices = new Array<ToolService>(Tool._Len);
    this.toolServices[Tool.Brush] = brushService;
    this.toolServices[Tool.Pencil] = pencilService;
  }

  ngAfterViewInit() {
    console.assert(!!this.sharedEvents);
  }

  selectTool(tool: Tool) {
    // TODO: TypeScript 3.7: this.toolServices[this.selectedTool]?.end();
    if (this.selectedTool != null) {
      this.toolServices[this.selectedTool].dispose();
    }
    this.selectedTool = tool;
    this.toolServices[tool].init(this.sharedEvents);
  }
}
