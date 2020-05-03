import { Injectable } from '@angular/core';

import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class PencilService extends ToolService {

  private static readonly DEFAULT_THICKNESS: number = 10;
  thickness: number;

  constructor() {
    super();
    this.thickness = PencilService.DEFAULT_THICKNESS;
  }
}
