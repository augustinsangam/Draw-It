import { Point } from '../../shape/common/point';

export class PointSet {

  private set: Set<string>;

  constructor() {
    this.set = new Set();
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

  forEach(callbackfn: (value: Point) => void): void {
    return this.set.forEach((pointFreezed) => {
      const [x, y] = pointFreezed.split(' ').map((value) => Number(value));
      callbackfn(new Point(x, y));
    });
  }

}
