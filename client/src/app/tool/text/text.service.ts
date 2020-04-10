import {Injectable} from '@angular/core';
import {Dimension} from '../shape/common/dimension';
import {Rectangle} from '../shape/common/rectangle';
import {ToolService} from '../tool.service';
import {TextAlignement} from './text-classes/text-alignement';
import {StateIndicators} from './text-classes/text-indicators';
import {TextLine} from './text-classes/text-line';
import {TextMutators} from './text-classes/text-mutators';

interface Font {
  value: string;
  viewValue: string;
}

enum SvgAlignement {
  left = 'start',
  center = 'middle',
  right = 'end'
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
  indicators: StateIndicators;
  fontSize: number;
  fontsList: Font[];
  currentZoneDims: Dimension;
  textZoneRectangle: Rectangle;

  constructor() {
    super();
    this.textMutators = { bold: false, italic: false, underline: false };
    this.textAlignement = TextAlignement.left;
    this.currentFont = 'Arial';
    this.fontsList = [
      {value: 'Arial, sans-serif'     , viewValue: 'Arial'              },
      {value: 'Geo-Sans-Light-NMS'    , viewValue: 'Geo Sans Light NMS' },
      {value: 'Courier New, monospace', viewValue: 'Courier New'        },
      {value: 'JetBrains-Mono'        , viewValue: 'JetBrains Mono'     },
      {value: 'texgyrepagella'        , viewValue: 'TeX Pagella'        },
      {value: 'Times New Roman, serif', viewValue: 'Times New Roman'    },
    ];
    this.fontSize = this.DEFAULT_FONTSIZE;
  }

  getTextAlign(): number {
    if (this.textAlignement === TextAlignement.left) {
      return 0;
    }
    return this.textAlignement === TextAlignement.center
      ? this.currentZoneDims.width / 2
      : this.currentZoneDims.width;
  }

  getTextAnchor(): string {
    if (this.textAlignement === TextAlignement.left) {
      return SvgAlignement.left;
    }

    return this.textAlignement === TextAlignement.center
      ? SvgAlignement.center
      : SvgAlignement.right;
  }

  getFullTextWidth(currentLine: TextLine): number {
    const oldIndex = currentLine.cursorIndex;
    if (currentLine.tspan.textContent) {
      currentLine.cursorIndex = currentLine.tspan.textContent.length;
    }
    const fullTextWidth = this.getLineWidth(currentLine);
    currentLine.cursorIndex = oldIndex;

    return fullTextWidth;
  }

  getLineWidth(currentLine: TextLine): number {
    const oldText = currentLine.tspan.textContent;
    if (!!currentLine.tspan.textContent && currentLine.tspan.textContent.length !== currentLine.cursorIndex) {
      currentLine.tspan.textContent = currentLine.tspan.textContent.slice(0, currentLine.cursorIndex);
    }
    const xPos = (currentLine.tspan as SVGTextContentElement).getComputedTextLength();
    currentLine.tspan.textContent = oldText;
    return xPos;
  }
}
