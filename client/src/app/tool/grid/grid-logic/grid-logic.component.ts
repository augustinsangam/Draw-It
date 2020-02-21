import {Component, OnDestroy} from '@angular/core';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {GridService} from '../grid.service';

@Component({
  selector: 'app-grid-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class GridLogicComponent extends ToolLogicDirective
implements OnDestroy {

  SVGWIDTH = 1000;
  SVGHEIGHT = 1000;

  constructor(
    private readonly service: GridService,
  ) {
    super();
  }

  // M x_i,y_i L x_f,y_f
  // ligne verticale : x_i = x_f et y_i = TOP, y_f = BOTTOM
  // ligne horizontale : y_i = y_f et x_i = LEFT, x_f = RIGHT

  ngOnInit() {
    this.generatePath();
  }

  ngOnDestroy(): void {
  }

  protected generatePath(): string {
    let stringPath = '';

    // lignes verticales
    for (let i = 0; i < this.SVGWIDTH; i += this.service.squareSize) {
      stringPath += ' M ' + i.toString() + ',0'
        + ' L' + i.toString() + ',' + this.SVGHEIGHT
    }
    // lignes horizontales
    for (let i = 0; i < this.SVGHEIGHT; i += this.service.squareSize) {
      stringPath += ' M 0' + ',' + i.toString()
        + ' L ' + this.SVGWIDTH + ',' + i.toString()
    }
    console.log(stringPath);

    return stringPath
  }

}
