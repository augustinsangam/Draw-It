import { Injectable } from '@angular/core';
import { Point } from '../../selection/Point';
import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class AerosolService extends ToolService {

  thickness: number;
  frequency: number;

  readonly MAX_FREQUENCY = 400;
  readonly MIN_FREQUENCY = 1;
  readonly MAX_THICKNESS = 100;
  readonly MIN_THICKNESS = 10;

  constructor() {
    super();
    this.frequency = 100;
    this.thickness = 30;
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
