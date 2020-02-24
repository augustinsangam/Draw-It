import { Injectable } from '@angular/core';

import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root',
})
export class LineService extends ToolService {
  radius: number;
  thickness: number;
  withJonction: boolean;

  constructor() {
    super();
    this.radius = 2;
    this.thickness = 2;
    this.withJonction = true;
  }
}
