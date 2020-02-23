import { Injectable } from '@angular/core';
import {ToolService} from '../tool.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridService extends ToolService {

  active: boolean;
  opacity: number;
  squareSize: number;
  changeDetector: Subject<number>;

  constructor() {
    super();
    this.squareSize = 200;
    this.opacity = 0.4;
    this.changeDetector = new Subject<number>();
    this.active = false;
  }
}
