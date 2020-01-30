import { Injectable } from '@angular/core';
import { ToolService } from '../tool.service';

export enum FillOption {
  With = 'Avec',
  Without = 'Sans'
}

@Injectable({
  providedIn: 'root'
})
export class RectangleService extends ToolService {

  fillOption    = FillOption.With;
  fillOptions   = [FillOption.With, FillOption.Without];
  thickness     = 2;

  constructor() {
    super();
  }

}
