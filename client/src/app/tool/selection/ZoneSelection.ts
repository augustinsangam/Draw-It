import { Offset } from './Offset';
import { Point } from './Point';
import { Zone } from './Zone';

export class ZoneSelection {

  private zone: Zone;

  constructor(private svgOffset: Offset) {
  }

  addElement(element: SVGElement) {
    if (this.zone === undefined) {
      this.zone = this.getZone(element);
    } else {
      this.zone = this.zone.union(this.getZone(element));
    }
  }

  addElements(elements: SVGElement[]) {
    elements.forEach(element => {
      this.addElement(element);
    });
  }

  getPoints(): Point[] {
    return this.zone.getPoints();
  }

  private getZone(element: SVGElement): Zone {
    const thikness = this.getThikness(element);
    const domRectangle = element.getBoundingClientRect();
    const startingPoint = new Point(
      domRectangle.left - this.svgOffset.left - thikness / 2,
      domRectangle.top - this.svgOffset.top - thikness / 2
    );
    const offsetIncrement = this.getOffsetIncrement(element);
    const endPoint = new Point(
      startingPoint.x + (domRectangle.width + thikness + offsetIncrement.left),
      startingPoint.y + (domRectangle.height + thikness + + offsetIncrement.top)
    );
    return new Zone(startingPoint.x, endPoint.x, startingPoint.y, endPoint.y);
  }

  private getThikness(element: SVGElement): number {
    const strokeWidthAttribute = element.getAttribute('stroke-width');
    if (!!strokeWidthAttribute) {
      return parseInt(
        strokeWidthAttribute as string, 10
      );
    } else {
      const thickness = parseInt(
        element.style.strokeWidth as string, 10
      );

      return (!!thickness) ? thickness : 0;
    }
  }

  private getOffsetIncrement(element: SVGElement): Offset {
    return element.classList.contains('filter1') ? {
      left: this.getThikness(element),
      top: this.getThikness(element)
    } : {
      left: 0,
      top: 0
    }
  }

}
