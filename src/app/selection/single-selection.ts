import { Point } from '../tool/shape/common/point';
import { Offset } from './offset';
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
