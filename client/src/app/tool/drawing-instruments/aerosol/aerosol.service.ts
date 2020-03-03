import { Injectable } from '@angular/core';
import { Point } from '../../shape/common/point';
import { ToolService } from '../../tool.service';

// TODO : S'assurer d'avoir les valeurs la dans le html
const CONSTANTS = {
  MAX_FREQUENCY : 400,
  MIN_FREQUENCY : 1,
  DEFAULT_FREQUENCY : 100,
  MAX_THICKNESS : 100,
  MIN_THICKNESS : 10,
  DEFAULT_THICKNESS : 50,
  NUMBER_POINTS : 25
};

@Injectable({
  providedIn: 'root'
})
export class AerosolService extends ToolService {

  thickness: number;
  frequency: number;

  constructor() {
    super();
    this.frequency = CONSTANTS.DEFAULT_FREQUENCY;
    this.thickness = CONSTANTS.DEFAULT_THICKNESS;
  }

  generatePoints(p: Point): string {
    let disk = '';

    for (let i = 0; i < CONSTANTS.NUMBER_POINTS; i++) {

      const theta = Math.random() * 2 * Math.PI;
      const r = Math.random() * this.thickness;

      const x = p.x + r * Math.cos(theta);
      const y = p.y + r * Math.sin(theta);
      disk += 'M ' + (x - 1).toString() + ', ' + y.toString() +
        ' a 1, 1 0 1, 0 2,0' +
        ' a 1, 1 0 1, 0 -2,0 ';
    }

    return disk;
  }
}
