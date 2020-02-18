import { Offset } from './Offset';
import { Point } from './Point';
import { Selection } from './Selection'
import { SelectionReturn } from './SelectionReturn';
import { Zone } from './Zone';

export class MultipleSelection extends Selection {

  private compareZone: Zone;
  private selectedElements: Set<SVGElement>;

  constructor(elements: Set<SVGElement>,
              p1: Point, p2: Point, svgOffset: Offset,
              private point: SVGPoint) {
    super(svgOffset);
    this.selectedElements = new Set();
    this.compareZone = new Zone(p1.x, p2.x, p1.y, p2.y)
    this.findSelectedElements(elements);
  }

  getSelection(): SelectionReturn {
    return {
      empty: this.selectedElements.size === 0,
      selectedElements: this.selectedElements,
      points: (!!this.zone) ? this.zone.getPoints() : [
        new Point(0, 0),
        new Point(0, 0)
      ]
    }
  }

  private findSelectedElements( elements: Set<SVGElement>): void {
    elements.forEach(element => {
      if (element instanceof SVGElement) {
        const elementZone = this.getZone(element);
        const intersection = this.compareZone.intersection(elementZone);
        if (intersection[0] && intersection[1]
            .deepTestPass(element as SVGGeometryElement, this.point)) {
          // Les zones et les élements se touchent
          this.selectedElements.add(element);
          if (!!this.zone) {
            this.zone = this.zone.union(elementZone);
          } else {
            this.zone = elementZone;
          }
        }
      }
    });
  }

}
