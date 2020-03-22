import { EventEmitter, Injectable } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedElements: Set<SVGElement>;
  selectAllElements: EventEmitter<null>;

  clipboard: Set<SVGElement>;

  cut: EventEmitter<null>;

  paste: EventEmitter<null>;

  constructor(private readonly svgService: SvgService) {
    this.selectedElements = new Set();
    this.clipboard = new Set();
    this.selectAllElements = new EventEmitter();
    this.cut = new EventEmitter();
    this.paste = new EventEmitter();
  }

  onCopy(): void {
    this.clipboard = new Set(this.selectedElements);
  }

  onPaste(): void {
    for (const element of this.clipboard) {
      this.svgService.structure.drawZone.appendChild(element.cloneNode(true));
    }
    this.selectedElements = new Set(this.clipboard);
  }

  onDuplicate(): void {
    for (const element of this.selectedElements) {
      this.svgService.structure.drawZone.appendChild(element.cloneNode(true));
    }
  }

  onDelete(): void {
    for (const element of this.selectedElements) {
      element.remove();
    }
    this.selectedElements = new Set();
  }
  onCut(): void {
    this.clipboard = new Set(this.selectedElements);
    for (const element of this.selectedElements) {
      element.remove();
    }
    this.selectedElements = new Set();
  }

}
