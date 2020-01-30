import { Injectable } from '@angular/core';

import { Tool } from '../tool.enum';

type callback = (tool: Tool) => void;

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService {
  private tool: Tool;
  private onSameCallbacks: callback[];
  private onChangeCallbacks: callback[];

  constructor() {
    this.tool = Tool._None;
    this.onSameCallbacks = new Array();
    this.onChangeCallbacks = new Array();
  }

  set(tool: Tool) {
    console.assert(tool != null);
    if (this.tool != tool) {
      this.tool = tool;
      this.onChangeCallbacks.forEach(cb => cb(tool));
    } else {
      this.onSameCallbacks.forEach(cb => cb(tool));
    }
  }

  onChange(cb: callback) {
    this.onChangeCallbacks.push(cb);
  }

  onSame(cb: callback) {
    this.onSameCallbacks.push(cb);
  }
}
