import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { ToolSelectorService } from '../tool/tool-selector/tool-selector.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('sandbox', {
    static: false,
  }) sandbox: ElementRef<HTMLCanvasElement>;

  constructor(toolSecetorService: ToolSelectorService) {
    toolSecetorService.listen(tool => {
      console.log('YEE ' + tool);
    });
  }

  ngAfterViewInit() {
  }
}
