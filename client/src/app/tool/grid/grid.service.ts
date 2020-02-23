import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {ToolService} from '../tool.service';

@Injectable({
  providedIn: 'root'
})
export class GridService extends ToolService {

  readonly MAX_SQUARESIZE = 800;
  readonly MIN_SQUARESIZE = 5;
  active: boolean;
  opacity: number;
  squareSize: number;
  sliderChanges: Subject<number>;
  keyboardChanges: Subject<any>;

  constructor() {
    super();
    this.squareSize = 200;
    this.opacity = 0.4;
    this.active = false;
    this.sliderChanges = new Subject<number>();
    this.keyboardChanges = new Subject<any>();
  }

  keyEvHandler(key: string) {
    if (this.active) {
      switch (key) {
        case 'KeyG': {
          console.log('yo');
          this.active = !this.active;
          break;
        }
        case '+': {
          if (this.squareSize < this.MAX_SQUARESIZE) {
            this.squareSize += 5 - (this.squareSize % 5);
          }
          break;
        }
        case '-': {
          if (this.squareSize > this.MIN_SQUARESIZE) {
            this.squareSize % 5 === 0 ?
              this.squareSize -= 5 : this.squareSize -= this.squareSize % 5;
          }
          break;
        }
        default: {break}
      }
      this.keyboardChanges.next();
    }
  }
}
