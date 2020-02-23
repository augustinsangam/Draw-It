import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  // public

  private cmdDone: (ChildNode[])[]
  private cmdUndone: (ChildNode[])[];
  private firstCommand: boolean;
  private svgElRef: ElementRef<SVGSVGElement>;
  constructor() {
    this.cmdDone = [];
    this.cmdUndone = [];
  }

  setSVG(svgElRef: ElementRef<SVGSVGElement>): void {
    this.svgElRef = svgElRef;
  }

  addToCommands(): void {
    this.cmdDone.push(Array.from(this.svgElRef.nativeElement.childNodes));
    this.cmdUndone = [];
    if (this.svgElRef.nativeElement.children.length) {
      this.firstCommand = true;
    }
  }

  undo(): void {

    if (this.cmdDone.length) {
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

  canUndo(): boolean {
    if (!! this.svgElRef) {
      const notEmpty = this.svgElRef.nativeElement.children.length >= 1;
      return ( this.firstCommand && notEmpty);
    }
    return false;
  }

  canRedo(): boolean {
    return (this.cmdUndone.length > 0);
  }
}
