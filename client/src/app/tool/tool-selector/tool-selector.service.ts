import { Injectable } from '@angular/core';

import { Tool } from '../tool.enum';

export type callback = (tool: Tool, old?: Tool) => void;

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService {
  private tool: Tool;
  private onSameCallbacks: callback[];
  private onChangeCallbacks: callback[];

  private constructor() {
    this.tool = Tool._None;
    this.onSameCallbacks = [];
    this.onChangeCallbacks = [];
  }

  // Must be public
  set(tool: Tool) {
    if (this.tool !== tool) {
      this.onChangeCallbacks.forEach(cb => cb(tool, this.tool));
      this.tool = tool;
    } else {
      this.onSameCallbacks.forEach(cb => cb(tool));
    }
  }

  // Must be public
  onChange(cb: callback) {
    this.onChangeCallbacks.push(cb);
  }

  // Must be public
  onSame(cb: callback) {
    this.onSameCallbacks.push(cb);
  }
}
