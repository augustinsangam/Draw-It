import { Injectable } from '@angular/core';

import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root',
})
export class RectangleService extends ToolService {
  borderOption: boolean;
  fillOption: boolean;
  thickness: number;

  constructor() {
    super();
    this.borderOption = true;
    this.fillOption = true;
    this.thickness = 2;
  }
}
