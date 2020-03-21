import {Injectable} from '@angular/core';
import {ToolService} from '../tool.service';
import {TextAlignement} from './text-alignement';
import {TextMutators} from './text-mutators';

interface Font {
  value: string;
  viewValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class TextService extends ToolService {
  readonly MAX_FONTSIZE: number = 80;
  readonly MIN_FONTSIZE: number = 4;
  readonly DEFAULT_FONTSIZE: number = 50;

  currentFont: string;
  textMutators: TextMutators;
  textAlignement: TextAlignement;
  fontSize: number;
  fontsList: Font[];

  constructor() {
    super();
    this.textMutators = {bold: false, italic: false, underline: false};
    this.textAlignement = TextAlignement.left;
    this.currentFont = 'Times New Roman';
    this.fontsList = [
      // sans serif
      {value: 'Arial, sans-serif', viewValue: 'Arial'},
      // {value: 'Helvetica, sans-serif', viewValue: 'Helvetica'},
      // {value: 'Gill Sans, sans-serif', viewValue: 'Gill Sans'},
      // {value: 'Lucida, sans-serif', viewValue: 'Lucida'},
      // {value: 'Helvetica Narrow, sans-serif', viewValue: 'Helvetica Narrow'},
      // serif
      // {value: 'Times, serif', viewValue: 'Times'},
      {value: 'Times New Roman, serif', viewValue: 'Times New Roman'},
      // {value: 'Palatino, serif', viewValue: 'Palatino'},
      // {value: 'Bookman, serif', viewValue: 'Bookman'},
      // {value: 'New Century Schoolbook, serif', viewValue: 'New Century Schoolbook'},
      // monospace
      {value: 'Andale Mono, monospace', viewValue: 'Andale Mono'},
      {value: 'Courier New, monospace', viewValue: 'Courier New'},
      // {value: 'Courier, monospace', viewValue: 'Courier'},
      // {value: 'Lucidatypewriter, monospace', viewValue: 'Lucidatypewriter'},
      // {value: 'Fixed, monospace', viewValue: 'Fixed'},
      // cursive
      // {value: 'Comic Sans, Comic Sans MS, cursive', viewValue: 'Comic Sans'},
      // {value: 'Zapf Chancery, cursive', viewValue: 'Zapf Chancery'},
      // {value: 'Coronetscript, cursive', viewValue: 'Coronetscript'},
      // {value: 'Florence, cursive', viewValue: 'Florence'},
      // {value: 'Parkavenue, cursive', viewValue: 'Parkavenue'},
      // fantasy
      // {value: 'Impact, fantasy', viewValue: 'Impact'},
      // {value: 'Arnoldboecklin, fantasy', viewValue: 'Arnoldboecklin'},
      // {value: 'Oldtown, fantasy', viewValue: 'Oldtown'},
      // {value: 'Blippo, fantasy', viewValue: 'Blippo'},
      // {value: 'Brushstroke, fantasy', viewValue: 'Brushstroke'}
    ];
    this.fontSize = this.DEFAULT_FONTSIZE;
  }

  getTextAlign(width: number): string {
    return this.textAlignement === TextAlignement.left ? '0' : (
      this.textAlignement === TextAlignement.center ? `${width / 2}` : `${width}`
    );
  }

  getTextAnchor(): string {
    return this.textAlignement === 'left' ? 'start' : (
      this.textAlignement === 'center' ? 'middle' : 'end'
    );
  }

  getLetterOffset(textWidth: number, textLength: number): number {
    console.log(textWidth / textLength)
    return textWidth / textLength;
  }
}
