import { Injectable } from '@angular/core';
import {ToolService} from '../../tool.service';
import {Point} from '../../shape/common/Point';

@Injectable({
  providedIn: 'root'
})
export class AerosolService extends ToolService {

  thickness: number;
  frequency: number;

  constructor() {
    super();
    this.frequency = 250;
    this.thickness = 30;
  }

  generatePoints(p: Point): string {
    let disk = '';

    for (let i = 0; i < 50; i++) {

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
