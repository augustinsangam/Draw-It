export class TextLine {

  constructor(
    public tspan: SVGElement,
    public letters: string[],
    public cursorIndex: number) {

  }

  moveUp(offSetY: number): void {
    const oldY = this.tspan.getAttribute('y') as number;
    this.tspan.setAttribute('y', `${oldY - offSetY}`);
  }

  moveDown(offSetY: number): void {
    const oldY = this.tspan.getAttribute('y') as number;
    this.tspan.setAttribute('y', `${oldY - offSetY}`);
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
