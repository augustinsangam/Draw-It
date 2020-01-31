import { Injectable } from '@angular/core';
import { ToolService } from '../tool.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleService extends ToolService {

  fillOption    = true;
  borderOption  = true;
  thickness     = 2;

  constructor() {
    super();
  }

}
