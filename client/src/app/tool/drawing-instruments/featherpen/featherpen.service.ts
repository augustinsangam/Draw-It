import { Injectable } from '@angular/core';
import {ToolService} from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class FeatherpenService extends ToolService {

  constructor() {
    super();
  }
}
