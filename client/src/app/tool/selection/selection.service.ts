import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SvgService } from 'src/app/svg/svg.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedElements: Set<SVGElement>;
  clipboard: Set<SVGElement>;
  private componentMethodDisableSelection: Subject<null> = new Subject<null>();
  private componentMethodEnableSelection: Subject<Set<SVGElement>> = new Subject<Set<SVGElement>>();
  selectAllElements: EventEmitter<null>;
  constructor(private readonly svgService: SvgService) {
    this.selectedElements = new Set();
    this.clipboard = new Set();
    this.selectAllElements = new EventEmitter(); }
  disableSelectionObservable$: Observable<null> = this.componentMethodDisableSelection.asObservable();
  enableSelectionObservable$: Observable<Set<SVGElement>> = this.componentMethodEnableSelection.asObservable();

  onCopy(): void {
    this.clipboard = new Set(this.selectedElements);
  }

  callDisableSelectionMethod(): void {
    this.componentMethodDisableSelection.next();
  }

  callEnableSelectionMethod(): void {
    this.componentMethodEnableSelection.next(this.clipboard);
  }

  onPaste(): void {
    for (const element of this.clipboard) {
      this.svgService.structure.drawZone.appendChild(element.cloneNode(true));
    }
    this.callEnableSelectionMethod();
    this.selectedElements = new Set(this.clipboard);
  }

  onDuplicate(): void {
    for (const element of this.selectedElements) {
      this.svgService.structure.drawZone.appendChild(element.cloneNode(true));
    }
  }

  onDelete(): void {
    this.callDisableSelectionMethod();
    for (const element of this.selectedElements) {
      element.remove();
    }
    this.selectedElements = new Set();
  }
  onCut(): void {
    this.clipboard = new Set(this.selectedElements);
    this.callDisableSelectionMethod();
    for (const element of this.selectedElements) {
      element.remove();
    }
    this.selectedElements = new Set();
  }

}
