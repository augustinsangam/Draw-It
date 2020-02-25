import { Injectable } from '@angular/core';

import { Tool } from '../tool/tool.enum';

export type callback = (tool: Tool, old?: Tool) => void;

@Injectable({
  providedIn: 'root',
})
export class ToolSelectorService {
  private tool: Tool;
  private onChangeCallbacks: callback[];
  private onSameCallbacks: callback[];

  private constructor() {
    this.tool = Tool._None;
    this.onChangeCallbacks = [];
    this.onSameCallbacks = [];
  }

  // Must be public
  get current() {
    return this.tool;
  }

  // Must be public
  set(tool: Tool): void {
    if (this.tool === tool) {
      this.onSameCallbacks.forEach(async (cb) => cb(tool));
    } else {
      this.onChangeCallbacks.forEach(async (cb) => cb(tool, this.tool));
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