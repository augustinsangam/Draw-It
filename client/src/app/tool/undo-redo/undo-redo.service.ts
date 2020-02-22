import { Injectable } from '@angular/core';
import { SVGStructure } from '../tool-logic/tool-logic.directive';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  private cmdDone: (ChildNode[])[]
  private cmdUndone: (ChildNode[])[];

  private firstCommand: boolean;

  private svgStructure: SVGStructure;

  constructor() {
    this.cmdDone = [];
    this.cmdUndone = [];
    this.firstCommand = false;
  }

  intialise(svgStructure: SVGStructure): void {
    this.svgStructure = svgStructure;
    this.saveState();
  }

  saveState(): void {
    const drawZone = this.svgStructure.drawZone;
    this.cmdDone.push(Array.from(drawZone.childNodes));
    this.cmdUndone = [];
    this.firstCommand = (drawZone.children.length !== 0);
  }

  undo(): void {
    if (this.cmdDone.length !== 0) {
      const lastCommand = this.cmdDone.pop();
      this.cmdUndone.push(lastCommand as ChildNode[]);
      this.refresh(this.cmdDone[this.cmdDone.length - 1]);
    }
  }

  redo(): void {
    if (this.cmdUndone.length) {
      const lastCommand = this.cmdUndone.pop();
      this.cmdDone.push(lastCommand as ChildNode[]);
      this.refresh(this.cmdDone[this.cmdDone.length - 1]);
    }
  }

  refresh(node: ChildNode[]): void {
    const childrens = Array.from(this.svgStructure.drawZone.childNodes);
    const nodeChildrens = Array.from(node);
    for (const element of childrens) {
      element.remove();
    }
    for (const element of nodeChildrens) {
      this.svgStructure.drawZone.appendChild(element);
    }
  }

  canUndo(): boolean {
    return this.firstCommand && this.svgStructure.drawZone.children.length >= 1;
  }

  canRedo(): boolean {
    return this.cmdUndone.length > 0;
  }

}
