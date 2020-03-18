import { Injectable } from '@angular/core';
import {ToolService} from '../tool.service';
import {TextMutators} from './text-mutators';

@Injectable({
  providedIn: 'root'
})
export class TextService extends ToolService {
  readonly MAX_FONTSIZE: number = 96;
  readonly MIN_FONTSIZE: number = 4;
  readonly DEFAULT_FONTSIZE: number = 50;

  showFonts: boolean;
  font: string;
  textMutators: TextMutators;
  fontSize: number;
  fontsList: string[];

  constructor() {
    super();
    this.showFonts = false;
    this.textMutators = {bold: false, italic: false, underline: false};
    this.font = 'Times New Roman';
    this.fontsList = [
      // sans serif
      'Arial, sans-serif',
      'Helvetica, sans-serif',
      'Gill Sans, sans-serif',
      'Lucida, sans-serif',
      'Helvetica Narrow, sans-serif',
      // serif
      'Times, serif',
      'Times New Roman, serif',
      'Palatino, serif',
      'Bookman, serif',
      'New Century Schoolbook, serif',
      // monospace
      'Andale Mono, monospace',
      'Courier New, monospace',
      'Courier, monospace',
      'Lucidatypewriter, monospace',
      'Fixed, monospace',
      // cursive
      'Comic Sans, Comic Sans MS, cursive',
      'Zapf Chancery, cursive',
      'Coronetscript, cursive',
      'Florence, cursive',
      'Parkavenue, cursive',
      // fantasy
      'Impact, fantasy',
      'Arnoldboecklin, fantasy',
      'Oldtown, fantasy',
      'Blippo, fantasy',
      'Brushstroke, fantasy'
    ];
    this.fontSize = this.DEFAULT_FONTSIZE;
  }
}
