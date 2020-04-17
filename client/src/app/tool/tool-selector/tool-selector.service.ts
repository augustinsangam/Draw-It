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

  set(tool: Tool): void {
    if (this.tool === tool) {
      this.onSameCallbacks.forEach(async (cb) => cb(tool));
      return;
    }
    this.onChangeCallbacks.forEach(async (cb) => cb(tool, this.tool));
    this.tool = tool;
  }
  onChange(cb: callback): void {
    this.onChangeCallbacks.push(cb);
  }

  onSame(cb: callback): void {
    this.onSameCallbacks.push(cb);
  }
}
