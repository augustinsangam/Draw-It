export class TextLine {

  constructor(
    public tspan: SVGElement,
    public letters: string[],
    public cursorIndex: number) {

  }

  moveUp(offSetY: number): void {
    const oldY = this.tspan.getAttribute('y');
    if (oldY !== null) {
      this.tspan.setAttribute('y', `${+oldY - offSetY}`);
    }
  }

  moveDown(init: number, index: number, fontSize: number): void {
    this.tspan.setAttribute('y', `${init + (index + 1) * fontSize}`);
  }

  splitAtCursor(index: number, freshTspan: SVGElement): TextLine {
    const newLine = new TextLine(
      freshTspan,
      Array.from(this.letters.slice(index, this.letters.length)),
      0
    );
    newLine.tspan.textContent = newLine.letters.join('');

    this.letters = this.letters.slice(0, index);
    this.tspan.textContent = this.letters.join('');
    this.cursorIndex = index;

    return newLine;
  }

  emptySelf(): void {
    this.tspan.remove();
    this.tspan = undefined as unknown as SVGElement;
    this.letters = [];
    this.cursorIndex = 0;
  }

  append(line: TextLine): void {
    this.cursorIndex = this.letters.length;
    line.letters.forEach((letter) => this.letters.push(letter));
    this.tspan.textContent = this.letters.join('');
  }

}
