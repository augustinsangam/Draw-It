import { Point } from '../tool/shape/common/point';

export class Zone {

  constructor(private left: number,
              private right: number,
              private top: number,
              private bottom: number
  ) { }

  union(zone: Zone): Zone {
    return new Zone(
      Math.min(this.left, zone.left),
      Math.max(this.right, zone.right),
      Math.min(this.top, zone.top),
      Math.max(this.bottom, zone.bottom)
    );
  }

  intersection(zone: Zone): [boolean, Zone] {
    const left = Math.max(this.left, zone.left);
    const right = Math.min(this.right, zone.right);
    const top = Math.max(this.top, zone.top);
    const bottom = Math.min(this.bottom, zone.bottom);
    return [(left < right && top < bottom), new Zone(left, right, top, bottom)];
  }

  getPoints(): [Point, Point] {
    return [new Point(this.left, this.top), new Point(this.right, this.bottom)];
  }

}
