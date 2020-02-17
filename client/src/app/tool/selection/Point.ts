export class Point {

  x: number;
  y: number;

  constructor(x: number, y: number) {
    // Un point ne peut avoir des coordonnées négatives
    this.x = Math.max(0, x);
    this.y = Math.max(0, y);
  }

  equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

}
