import { Injectable } from '@angular/core';
import { Point } from '../../shape/common/point';
import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class AerosolService extends ToolService {

  readonly MAX_FREQUENCY: number = 400;
  readonly MIN_FREQUENCY: number = 1;
  readonly DEFAULT_FREQUENCY: number = 100;
  readonly MAX_THICKNESS: number = 100;
  readonly MIN_THICKNESS: number = 10;
  readonly DEFAULT_THICKNESS: number = 50;
  readonly NUMBER_POINTS: number = 2;

  thickness: number;
  frequency: number;

  constructor() {
    super();
    this.frequency = this.DEFAULT_FREQUENCY;
    this.thickness = this.DEFAULT_THICKNESS;
  }

  generatePoints(p: Point): string {
    let disk = '';

    for (let i = 0; i < this.NUMBER_POINTS; i++) {

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
