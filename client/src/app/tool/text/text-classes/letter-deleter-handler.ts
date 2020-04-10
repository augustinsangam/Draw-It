import { TextService } from '../text.service';
import { TextLine } from './text-line';

export class LetterDeleterHandler {

  constructor(private lines: TextLine[],
              private readonly service: TextService) {
  }

  deleteLeftLetter(currentLine: TextLine): TextLine {
    const onFirstLine = this.lines.indexOf(currentLine) === 0;
    const atStartOfLine = currentLine.cursorIndex === 0;
    const lineEmpty = currentLine.letters.length === 0;

    if ((atStartOfLine || lineEmpty) && onFirstLine) {
      return currentLine;
    }

    if (atStartOfLine && !onFirstLine) {

      const lineAbove = this.lines[this.lines.indexOf(currentLine) - 1];
      lineAbove.append(currentLine);
      this.lines.slice(this.lines.indexOf(currentLine), this.lines.length).forEach((line) => {
        line.moveUp(this.service.fontSize);
      });

      this.lines.splice(this.lines.indexOf(currentLine), 1);
      currentLine.emptySelf();
      currentLine = lineAbove;

    } else {

      const preCursor = currentLine.letters.slice(0, currentLine.cursorIndex - 1);
      const postCursor = currentLine.letters.slice(currentLine.cursorIndex, currentLine.letters.length);
      if (preCursor.length !== 0) {
        currentLine.letters = preCursor;
        postCursor.forEach((letter) => currentLine.letters.push(letter));
        --currentLine.cursorIndex;
      } else {
        currentLine.letters = postCursor;
        currentLine.cursorIndex = 0;
      }
    }
    return currentLine;
  }

  deleteRightLetter(currentLine: TextLine): TextLine {
    const onLastLine = this.lines.indexOf(currentLine) === this.lines.length - 1;
    const atEndOfLine = currentLine.cursorIndex === currentLine.letters.length;

    if (onLastLine && atEndOfLine) {
      return currentLine;
    }

    if (atEndOfLine && !onLastLine) {

      const lineBelow = this.lines[this.lines.indexOf(currentLine) + 1];
      currentLine.append(lineBelow);
      this.lines.slice(this.lines.indexOf(lineBelow), this.lines.length).forEach((line) => {
        line.moveUp(this.service.fontSize);
      });

      this.lines.splice(this.lines.indexOf(lineBelow), 1);
      lineBelow.emptySelf();

    } else {

      const preCursor = currentLine.letters.slice(0, currentLine.cursorIndex);
      const postCursor = currentLine.letters.slice(currentLine.cursorIndex + 1, currentLine.letters.length);
      if (postCursor.length !== 0) {
        currentLine.letters = preCursor;
        postCursor.forEach((letter) => currentLine.letters.push(letter));
      } else {
        currentLine.letters = preCursor;
        currentLine.cursorIndex = currentLine.letters.length;
      }

    }
    return currentLine;
  }
}
