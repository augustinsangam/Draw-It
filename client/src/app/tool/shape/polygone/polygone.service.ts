import { Injectable } from '@angular/core';
import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class PolygoneService extends ToolService {

  fillOption: boolean;
  borderOption: boolean;
  thickness: number;
  sides: number;

  constructor() {
    super();
    this.fillOption = true;
    this.borderOption = true;
    this.thickness = 2;
    this.sides = 8;
  }
}