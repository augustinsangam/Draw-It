import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  // public
  canUndo: boolean;
  canRedo: boolean;
  private cmdDone: (ChildNode[])[]
  private cmdUndone: (ChildNode[])[];
  private svgElRef: ElementRef<SVGSVGElement>;
  constructor() {
    this.cmdDone = [];
    this.cmdUndone = [];
    this.canUndo = false;
    this.canRedo = true;
  }

  setSVG(svgElRef: ElementRef<SVGSVGElement>): void {
    this.svgElRef = svgElRef;
  }

  addToCommands(): void {
    this.cmdDone.push(Array.from(this.svgElRef.nativeElement.childNodes));
    this.cmdUndone = [];
  }

  undo(): void {

    if (this.cmdDone.length >= 2) {
      const lastCommand = this.cmdDone.pop();
      this.cmdUndone.push(lastCommand as ChildNode[]);
      this.refresh(this.cmdDone[this.cmdDone.length - 1]);
      this.canUndo = true;
    } else {
      this.canUndo = false;
    }
  }

  redo(): void {

    if (this.cmdUndone.length) {
      const lastCommand = this.cmdUndone.pop();
      this.cmdDone.push(lastCommand as ChildNode[]);
      this.refresh(this.cmdDone[this.cmdDone.length - 1]);
      this.canRedo = true;
    } else {
      this.canRedo = false;
    }
  }

  refresh(node: ChildNode[]): void {
    const currentSVGChildrens = Array.from(
          this.svgElRef.nativeElement.childNodes);
    const nodeChildrens = Array.from(node);
    for (const element of currentSVGChildrens) {
      element.remove();
    }
    for (const element of nodeChildrens) {
      this.svgElRef.nativeElement.appendChild(element);
    }
  }
}
