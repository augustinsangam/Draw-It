import { Injectable } from '@angular/core';
import { Point } from '../../shape/common/point';
import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class AerosolService extends ToolService {

  protected static readonly MAX_FREQUENCY: number = 400;
  protected static readonly MIN_FREQUENCY: number = 1;
  private   static readonly DEFAULT_FREQUENCY: number = 250;
  protected static readonly MAX_THICKNESS: number = 100;
  protected static readonly MIN_THICKNESS: number = 10;
  private   static readonly DEFAULT_THICKNESS: number = 20;
  private   static readonly NUMBER_POINTS: number = 25;

  thickness: number;
  frequency: number;

  constructor() {
    super();
    this.frequency = AerosolService.DEFAULT_FREQUENCY;
    this.thickness = AerosolService.DEFAULT_THICKNESS;
  }

  generatePoints(p: Point): string {
    let disk = '';

    for (let i = 0; i < AerosolService.NUMBER_POINTS; i++) {

      const theta = Math.random() * 2 * Math.PI;
      const r = Math.random() * this.thickness;

      const x = p.x + r * Math.cos(theta);
      const y = p.y + r * Math.sin(theta);
      disk += `M ${Math.round(x) - 1}, ${Math.round(y)} a 1, 1 0 1, 0 2,0 a 1, 1 0 1, 0 -2,0 `;
    }

    return disk;
  }
}
