import { Injectable } from '@angular/core';
import { ToolService } from '../tool.service';
@Injectable({
  providedIn: 'root'
})
export class LineService extends ToolService {

  thickness = 2;
  withJonction = true;
  radius = 2;

  constructor() {
    super();
  }
}
