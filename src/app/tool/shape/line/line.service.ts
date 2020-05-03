import { Injectable } from '@angular/core';
import { ToolService } from '../../tool.service';
@Injectable({
  providedIn: 'root'
})
export class LineService extends ToolService {

  thickness: number;
  withJonction: boolean;
  radius: number;

  constructor() {
    super();
    this.thickness = 2;
    this.withJonction = true;
    this.radius = 2;
  }
}
