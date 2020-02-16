import { Offset } from './Offset';
import { Point } from './Point';
import { Selection } from './Selection'
import { SelectionReturn } from './SelectionReturn';
import { Zone } from './Zone';

export class MultipleSelection extends Selection {

  private zone: Zone;
  private compareZone: Zone;
  private selectedElements: SVGElement[];

  constructor(elements: SVGElement[],
              p1: Point, p2: Point, private svgOffset: Offset,
              private point: SVGPoint) {
    super();
    this.selectedElements = [];
    this.compareZone = new Zone(p1.x, p2.x, p1.y, p2.y)
    this.findSelectedElements(elements);
  }

  getSelection(): SelectionReturn {
    return {
      empty: this.selectedElements.length === 0,
      selectedElements: this.selectedElements,
      points: (!!this.zone) ? this.zone.getPoints() : [
        new Point(0, 0),
        new Point(0, 0)
      ]
    }
  }

  private findSelectedElements( elements: SVGElement[]): void {
    elements.forEach(element => {
      if (element instanceof SVGElement) {
        const elementZone = this.getZone(element);
        const intersection = this.compareZone.intersection(elementZone);
        if (intersection[0] && intersection[1]
            .deepTestPass(element as SVGGeometryElement, this.point)) {
          // Les zones et les élements se touchent
          this.selectedElements.push(element);
          if (!!this.zone) {
            this.zone = this.zone.union(elementZone);
          } else {
            this.zone = elementZone;
          }
        }
      }
    });
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
