import { Injectable } from '@angular/core';
import { ToolService } from '../tool.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends ToolService {

  thickness = 2;
  jonctionOption = true;
  radius = 2;

  constructor() {
    super();
  }

}
