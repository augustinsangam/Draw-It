import { Injectable } from '@angular/core';
import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleService extends ToolService {

  fillOption: boolean;
  borderOption: boolean;
  thickness: number;

  constructor() {
    super();
    this.fillOption = true;
    this.borderOption = true;
    this.thickness = 2;
  }
}
