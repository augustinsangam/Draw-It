import { Injectable } from '@angular/core';
import {ToolService} from '../tool.service';

@Injectable({
  providedIn: 'root'
})
export class PipetteService extends ToolService  {

  currentColor: string;

  constructor() {
    super();
    this.currentColor = 'rgba(0, 0, 0, 0)';
  }
}
