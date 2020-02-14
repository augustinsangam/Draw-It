import { Injectable } from '@angular/core';

import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class PencilService extends ToolService {

  thickness: number;

  constructor() {
    super();
    this.thickness = 10;
  }
}
