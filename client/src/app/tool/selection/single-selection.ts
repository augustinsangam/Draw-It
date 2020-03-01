import { Offset } from './offset';
import { Point } from './point';
import { Selection } from './selection';

export class SingleSelection extends Selection {

  constructor(element: SVGElement, svgOffset: Offset) {
    super(svgOffset);
    this.zone = this.getZone(element);
  }

  points(): Point[] {
    return this.zone.getPoints();
  }

}
