import { Injectable } from '@angular/core';
import {ToolService} from '../tool.service';

@Injectable({
  providedIn: 'root'
})
export class PipetteService extends ToolService  {

  static readonly DEFAULT_COLOR: string = 'rgba(0, 0, 0, 0)';
  currentColor: string;

  constructor() {
    super();
    this.currentColor = PipetteService.DEFAULT_COLOR;
  }
}
