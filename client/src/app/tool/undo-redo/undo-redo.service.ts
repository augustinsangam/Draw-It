import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {
  private cmdDone: HTMLElement [];
  private cmdUndone: HTMLElement [];
  private svgElRef: ElementRef<SVGSVGElement>;
  constructor(svgElRef: ElementRef<SVGSVGElement>) {
    this.svgElRef = svgElRef;
    this.cmdDone = [];
    this.cmdUndone = [];
  }
  addToCmdDone(cmd: HTMLElement): void {
    this.cmdDone.push(cmd);
    this.cmdUndone = [];
  }
  undo(): void {
    if (this.cmdDone.length) {
      this.cmdUndone.push(this.cmdDone.pop() as HTMLElement);
      this.refresh(this.cmdDone[this.cmdDone.length - 1])
    }
  }
  redo(): void {
    if (this.cmdUndone.length) {
      this.cmdDone.push(this.cmdUndone.pop() as HTMLElement);
      this.refresh(this.cmdUndone[this.cmdUndone.length - 1])
    }
  }
  refresh(svgNativeElement: HTMLElement): void {
    const svg = svgNativeElement.cloneNode();
    this.svgElRef.nativeElement.replaceWith(svg);
  }
}
