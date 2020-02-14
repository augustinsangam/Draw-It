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
  set(tool: Tool): void {
    if (this.tool === tool) {
      this.onSameCallbacks.forEach(async cb => cb(tool));
    } else {
      this.onChangeCallbacks.forEach(async cb => cb(tool, this.tool));
      this.tool = tool;
    }
  }

  // Must be public
  onChange(cb: callback): void {
    this.onChangeCallbacks.push(cb);
  }

  // Must be public
  onSame(cb: callback): void {
    this.onSameCallbacks.push(cb);
  }
}
