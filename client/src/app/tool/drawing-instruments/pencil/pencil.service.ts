import { Injectable } from '@angular/core';

import { ToolService } from '../../tool.service';

const DEFAULT_THICKNESS = 10;

@Injectable({
  providedIn: 'root'
})
export class PencilService extends ToolService {

  thickness: number;

  constructor() {
    super();
    this.thickness = DEFAULT_THICKNESS;
  }
}
