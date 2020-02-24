import { Injectable } from '@angular/core';

import { UndoRedoAction } from '../constants/constants';

interface UndoRedoContext {
  action: UndoRedoAction,
  data?: any,
}

type UndoRedoCb = (redo: boolean, data?: any) => void;

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService {
  private readonly actionToCb: Map<UndoRedoAction, UndoRedoCb>;
  private readonly ctxs: UndoRedoContext[];
  private idx: number;

  constructor() {
    this.actionToCb = new Map();
    this.ctxs = new Array();
    this.idx = -1;
  }

  private call(redo: boolean, ctx: UndoRedoContext) {
    if (this.actionToCb.has(ctx.action)) {
      this.actionToCb.get(ctx.action)(redo, ctx.data);
    }
  }

  // Must be public
  set(action: UndoRedoAction, cb: UndoRedoCb): void {
    this.actionToCb.set(action, cb);
  }

  // Must be public
  save(action: UndoRedoAction, data?: any): void {
    this.ctxs[++this.idx] = {
      action,
      data,
    };
    // Truncate array
    this.ctxs.length = this.idx + 1;
  }

  // Must be public
  canUndo(): boolean {
    return this.idx > 0;
  }

  // Must be public
  canRedo(): boolean {
    return this.idx < this.ctxs.length - 1;
  }

  // Must be public
  undo(): void {
    if (this.canUndo()) {
      this.call(false, this.ctxs[--this.idx]);
    }
  }

  // Must be public
  redo(): void {
    if (this.canRedo()) {
      this.call(true, this.ctxs[++this.idx]);
    }
  }

  // Must be public
  do(redo: boolean): void {
    redo ? this.redo() : this.undo();
  }
}
