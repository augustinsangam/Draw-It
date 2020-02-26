import { Injectable } from '@angular/core';
import {Point} from '../../shape/common/Point';
import {ToolService} from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class AerosolService extends ToolService {

  thickness: number;
  frequency: number;

  readonly MAX_FREQUENCY = 200;
  readonly MIN_FREQUENCY = 1;

  constructor() {
    super();
    this.frequency = 50;
    this.thickness = 45;
  }

  generatePoints(p: Point): string {
    let disk = '';

    for (let i = 0; i < 25; i++) {

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
