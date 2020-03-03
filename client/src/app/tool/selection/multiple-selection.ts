import { Point } from '../shape/common/point';
import { Offset } from './offset';
import { Selection } from './selection';
import { SelectionReturn } from './selection-return';
import { Zone } from './zone';

export class MultipleSelection extends Selection {

  private compareZone: Zone;
  private selectedElements: Set<SVGElement>;

  constructor(elements: Set<SVGElement>, svgOffset: Offset, p1?: Point, p2?: Point) {
    super(svgOffset);
    if (p1 === undefined || p2 === undefined) {
      this.selectAll(elements);
    } else {
      this.selectedElements = new Set();
      this.compareZone = new Zone(p1.x, p2.x, p1.y, p2.y);
      this.findSelectedElements(elements);
    }
  }

  getSelection(): SelectionReturn {
    return {
      empty: this.selectedElements.size === 0,
      selectedElements: this.selectedElements,
      points: (!!this.zone) ? this.zone.getPoints() : [
        new Point(0, 0),
        new Point(0, 0)
      ]
    };
  }

  private findSelectedElements( elements: Set<SVGElement>): void {
    elements.forEach((element) => {
      if (element instanceof SVGElement) {
        const elementZone = this.getZone(element);
        const intersection = this.compareZone.intersection(elementZone);
        // TODO : J'ai implémenté un deep test de base. Mais ce n'est demandé à ce qu'il
        // parait. Je le garde pour le futur au cas où je decide de continuer cette
        // application pour faire celle de mes rêves.
        // Pour faire un deeptest utiliser :
        // if (intersection[0] && intersection[1]
        //    .deepTestPass(element as SVGGeometryElement, this.point))
        // Il faut aussi passer un SVGPoint au constructeur
        if (intersection[0]) {
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

  private selectAll(elements: Set<SVGElement>): void {
    this.selectedElements = elements;
    elements.forEach((element) => {
      if (element instanceof SVGElement) {
        if (!!this.zone) {
          this.zone = this.zone.union(this.getZone(element));
        } else {
          this.zone = this.getZone(element);
        }
      }
    });
  }

}
