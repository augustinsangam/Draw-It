import { Cursor} from './cursor';
import {TextLine} from './text-line';

export class TextNavHandler {

  constructor(private cursor: Cursor,
              public lines: TextLine[],
              ) { }

  cursorLeft(currentLine: TextLine): TextLine {
    if (currentLine.cursorIndex > 0) {
      --currentLine.cursorIndex;
    } else if (this.lines.indexOf(currentLine) !== 0) {
      currentLine = this.lines[this.lines.indexOf(currentLine) - 1];
      currentLine.cursorIndex = currentLine.letters.length;
    }
    this.cursor.move(currentLine, this.lines.indexOf(currentLine));
    return currentLine;
  }

  cursorRight(currentLine: TextLine): TextLine {
    if (!!currentLine.tspan.textContent && currentLine.cursorIndex < currentLine.tspan.textContent.length) {
      ++currentLine.cursorIndex;
    } else if (this.lines.indexOf(currentLine) !== this.lines.length - 1) {
      currentLine = this.lines[this.lines.indexOf(currentLine) + 1];
      currentLine.cursorIndex = 0;
    }
    this.cursor.move(currentLine, this.lines.indexOf(currentLine));
    return currentLine;
  }

  cursorUp(currentLine: TextLine): TextLine {
    if (this.lines.indexOf(currentLine) - 1 >= 0) {
      const oldCursorIndex = currentLine.cursorIndex;
      currentLine = this.lines[this.lines.indexOf(currentLine) - 1];
      if (currentLine.letters.length >= oldCursorIndex) {
        currentLine.cursorIndex = oldCursorIndex;
      } else {
        currentLine.cursorIndex = currentLine.letters.length;
      }
      this.cursor.move(currentLine, this.lines.indexOf(currentLine));
    }
    return currentLine;
  }

  cursorDown(currentLine: TextLine): TextLine {
    if (this.lines.indexOf(currentLine) + 1 < this.lines.length) {
      const oldCursorIndex = currentLine.cursorIndex;
      currentLine = this.lines[this.lines.indexOf(currentLine) + 1];
      if (currentLine.letters.length >= oldCursorIndex) {
        currentLine.cursorIndex = oldCursorIndex;
      } else {
        currentLine.cursorIndex = currentLine.letters.length;
      }
      this.cursor.move(currentLine, this.lines.indexOf(currentLine));
    }
    return currentLine;
  }

  keyHome(currentLine: TextLine): void {
    currentLine.cursorIndex = 0;
    this.cursor.move(currentLine, this.lines.indexOf(currentLine));
  }

  keyEnd(currentLine: TextLine): void {
    if (!!currentLine.tspan.textContent) {
      currentLine.cursorIndex = currentLine.tspan.textContent.length;
    }
    this.cursor.move(currentLine, this.lines.indexOf(currentLine));
  }
}
