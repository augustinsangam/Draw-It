import { Offset } from './Offset';
import { Point } from './Point';
import { Selection } from './Selection'

export class SingleSelection extends Selection {

  constructor(element: SVGElement, svgOffset: Offset) {
    super(svgOffset);
    this.zone = this.getZone(element);
  }

  getPoints(): Point[] {
    return this.zone.getPoints();
  }

}
