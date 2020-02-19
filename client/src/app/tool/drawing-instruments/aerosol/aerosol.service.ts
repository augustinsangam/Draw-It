import { Injectable } from '@angular/core';
import {ToolService} from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class AerosolService extends ToolService {

  thickness: number;
  frequency: number;

  constructor() {
    super();
    this.frequency = 100;
    this.thickness = 10;
  }
}
