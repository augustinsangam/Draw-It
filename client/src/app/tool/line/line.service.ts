import { Injectable } from '@angular/core';
import { ToolService } from '../tool.service';

export enum JonctionOptions {
  EnableJonction = 'Avec',
  DisableJonction = 'Sans',
};

@Injectable({
  providedIn: 'root'
})
export class LineService extends ToolService {

  thickness = 2;
  jonctionOption = JonctionOptions.DisableJonction;
  radius = 2;

  jonctionOptions = [JonctionOptions.EnableJonction, JonctionOptions.DisableJonction];

  constructor() {
    super();
  }

}
