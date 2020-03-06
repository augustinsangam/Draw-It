import { Injectable } from '@angular/core';
import {ToolService} from '../../tool.service';

const DEFAULT_THICKNESS = 2;

@Injectable({
  providedIn: 'root'
})
export class EllipseService extends ToolService {

  fillOption: boolean;
  borderOption: boolean;
  thickness: number;

  constructor() {
    super();
    this.fillOption = true;
    this.borderOption = true;
    this.thickness = DEFAULT_THICKNESS;
  }

}
