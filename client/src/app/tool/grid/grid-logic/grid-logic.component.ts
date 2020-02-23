import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {GridService} from '../grid.service';
import {Dimension} from '../../shape/common/Rectangle';

@Component({
  selector: 'app-grid-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class GridLogicComponent extends ToolLogicDirective
implements OnDestroy {

  svgDimensions: Dimension;
  grid: SVGElement;

  constructor(
    private readonly service: GridService,
    private readonly renderer: Renderer2,
  ) {
    super();
  }

  ngOnInit() {
    const width = this.svgStructure.root.getAttribute('width');
    const height = this.svgStructure.root.getAttribute('height');
    if (width != null && height != null) {
      this.svgDimensions = {
        width: +width,
        height: +height
      }
    }
    const path = this.renderer.createElement('path', this.svgNS);
    path.setAttribute('id', 'grid');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '1');

    this.grid = path;
    this.handleGrid();
    this.service.changeDetector.subscribe(() => this.handleGrid());
  }

  ngOnDestroy(): void {
  }

  protected handleGrid() {
    if (this.service.active)  {
      this.grid.setAttribute('d', this.generateGrid());
      this.grid.setAttribute('stroke', 'black');
      this.grid.setAttribute('opacity', this.service.opacity.toString());
      this.renderer.appendChild(this.svgStructure.endZone, this.grid);
    } else {
      this.grid.setAttribute('d', '');
    }
  }

  protected generateGrid(): string {
    let stringPath = '';

    // lignes verticales
    for (let i = 0; i < this.svgDimensions.width;
         i += this.service.squareSize) {
      stringPath += ' M ' + i.toString() + ',0'
        + ' L' + i.toString() + ',' + this.svgDimensions.height
    }
    // lignes horizontales
    for (let i = 0; i < this.svgDimensions.height;
         i += this.service.squareSize) {
      stringPath += ' M 0' + ',' + i.toString()
        + ' L ' + this.svgDimensions.width + ',' + i.toString()
    }

    return stringPath
  }

}
