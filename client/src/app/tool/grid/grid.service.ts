import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';
import { SvgService } from 'src/app/svg/svg.service';
import {Dimension} from '../shape/common/Rectangle';
import { ToolService } from '../tool.service';

@Injectable({
  providedIn: 'root'
})
export class GridService extends ToolService {

  readonly MAX_SQUARESIZE = 400;
  readonly MIN_SQUARESIZE = 5;

  active: boolean;
  opacity: number;
  squareSize: number;
  isCreated: boolean;
  grid: SVGElement;

  keyboardChanges: Subject<any>;
  private readonly renderer: Renderer2;
  private svgDimensions: Dimension;

  constructor(rendererFactory: RendererFactory2,
              private svg: SvgService) {
    super();
    this.squareSize = 100;
    this.opacity = 0.4;
    this.active = false;
    this.keyboardChanges = new Subject<any>();
    this.isCreated = false;
    this.renderer = rendererFactory.createRenderer(null, null);
    if (!this.isCreated) {
      const path = this.renderer.createElement(
        'path',
        // TODO : use the svgNS of ToolLogicDirective if possible
        'http://www.w3.org/2000/svg'
      );
      path.setAttribute('id', 'grid');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-width', '1');

      this.grid = path;
      // this.handleGrid();
      this.isCreated = true;
    } else {
      this.grid = document.getElementById('grid') as unknown as SVGElement;
    }

  }

  keyEvHandler(keyCode: string) {
    switch (keyCode) {
      case 'KeyG': {
        this.active = !this.active;
        break;
      }
      case 'NumpadAdd': {
        if (this.active && this.squareSize < this.MAX_SQUARESIZE) {
          this.squareSize += 5 - (this.squareSize % 5);
        }
        break;
      }
      case 'NumpadSubtract': {
        if (this.active && this.squareSize > this.MIN_SQUARESIZE) {
          this.squareSize % 5 === 0 ?
            this.squareSize -= 5 : this.squareSize -= this.squareSize % 5;
        }
        break;
      }
      default: { break }
    }
    this.keyboardChanges.next(keyCode);
  }

  handleGrid() {
    if (this.svgDimensions === undefined) {
      const width = this.svg.structure.root.getAttribute('width');
      const height = this.svg.structure.root.getAttribute('height');
      if (width != null && height != null) {
        this.svgDimensions = {
          width: +width,
          height: +height
        }
      }
    }
    if (this.active)  {
      this.grid.setAttribute('d', this.generateGrid());
      this.grid.setAttribute('stroke', 'black');
      this.grid.setAttribute('opacity', this.opacity.toString());
      this.renderer.appendChild(this.svg.structure.endZone, this.grid);
    } else {
      this.grid.setAttribute('d', '');
    }
  }

  protected generateGrid(): string {
    let stringPath = '';

    // lignes verticales
    for (let i = 0; i < this.svgDimensions.width;
         i += this.squareSize) {
      stringPath += ' M ' + i.toString() + ',0'
        + ' L' + i.toString() + ',' + this.svgDimensions.height
    }
    // lignes horizontales
    for (let i = 0; i < this.svgDimensions.height;
         i += this.squareSize) {
      stringPath += ' M 0' + ',' + i.toString()
        + ' L ' + this.svgDimensions.width + ',' + i.toString()
    }

    return stringPath
  }
}
