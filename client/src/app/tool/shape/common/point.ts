
export class Point {

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static unfreeze(pointFreezed: string): Point {
    const [x, y] = pointFreezed.split(' ').map((value) => Number(value));
    return new Point(x, y);
  }

  equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

  squareDistanceTo(point: Point): number {
    const [dx, dy] = [point.x - this.x, point.y - this.y];
    return dx * dx + dy * dy;
  }

  freeze(): string {
    return `${this.x} ${this.y}`;
  }

}
