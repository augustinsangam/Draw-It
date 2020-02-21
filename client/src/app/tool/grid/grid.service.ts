import { Injectable } from '@angular/core';
import {ToolService} from '../tool.service';

@Injectable({
  providedIn: 'root'
})
export class GridService extends ToolService {

  opacity: number;
  squareSize: number;

  constructor() {
    super();
    this.squareSize = 10;
    this.opacity = 0.4
  }
}
