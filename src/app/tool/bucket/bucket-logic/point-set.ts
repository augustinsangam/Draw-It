import { Point } from '../../shape/common/point';

export class PointSet {

  private set: Set<string>;

  constructor() {
    this.set = new Set();
  }

  size(): number {
    return this.set.size;
  }

  add(point: Point): this {
    this.set.add(point.freeze());
    return this;
  }

  delete(value: Point): boolean {
    return this.set.delete(value.freeze());
  }

  has(point: Point): boolean {
    return this.set.has(point.freeze());
  }

  randomPoint(): Point | null {
    for ( const pointFreezed of this.set) {
      return Point.unfreeze(pointFreezed);
    }
    return null;
  }

  nearestPoint(point: Point): [Point | null, number] {
    let nearest: Point | null = null;
    let distance = Number.MAX_SAFE_INTEGER;
    this.forEach((borderPoint) => {
      const newDistance = point.squareDistanceTo(borderPoint);
      if (newDistance < distance) {
        distance = newDistance;
        nearest = borderPoint;
      }
    });
    return [nearest, distance];
  }

  forEach(callbackfn: (value: Point) => void): void {
    return this.set.forEach((pointFreezed) => {
      callbackfn(Point.unfreeze(pointFreezed));
    });
  }

}
