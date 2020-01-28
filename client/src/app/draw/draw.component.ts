import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { Tool } from './tool/tool.enum';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements AfterViewInit {
  @ViewChild('panel', {
    static: false,
  }) panel: ElementRef<HTMLElement>;
  selectedTool: Tool;
  toggle: boolean;

  constructor() {
  }

  ngAfterViewInit() {
  }

  selectTool(tool: Tool) {
    this.selectedTool = tool;
  }
}
