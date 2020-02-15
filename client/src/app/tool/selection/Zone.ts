
export class Zone {

  private left: number;
  private right: number;
  private top: number;
  private bottom: number;

  constructor(left: number, right: number, top: number, bottom: number) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }

  union(zone: Zone): Zone {
    return new Zone(
      Math.min(this.left, zone.left),
      Math.max(this.right, zone.right),
      Math.min(this.top, zone.top),
      Math.max(this.bottom, zone.bottom)
    );
  }

}
