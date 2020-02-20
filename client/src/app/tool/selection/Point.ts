export class Point {

  x: number;
  y: number;

  constructor(x: number, y: number) {
    // Un point ne peut avoir des coordonnées négatives
    this.x = x
    this.y = y;
  }

  equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

}
