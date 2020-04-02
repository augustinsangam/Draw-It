import {Cursor} from './cursor';
import {TextLine} from './text-line';

export class TextNavHandler {

  constructor(private cursor: Cursor,
              private lines: TextLine[]
              ) { }

  arrowLeft(currentLine: TextLine): void {
    if (currentLine.cursorIndex > 0) {
      --currentLine.cursorIndex;
      this.cursor.move(currentLine, this.lines.indexOf(currentLine));
    }
  }

  cursorDown(currentLine: TextLine): void {
    if (!!currentLine.tspan.textContent && currentLine.cursorIndex < currentLine.tspan.textContent.length) {
      ++currentLine.cursorIndex;
      this.cursor.move(currentLine, this.lines.indexOf(currentLine));
    }
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

  arrowDown(currentLine: TextLine): TextLine {
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
