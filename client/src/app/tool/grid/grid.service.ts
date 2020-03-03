import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';
import { Dimension } from '../shape/common/rectangle';
import { ToolService } from '../tool.service';

const MAX_SQUARESIZE = 400;
const MIN_SQUARESIZE = 5;
const DEFAULT_OPACITY = 0.4;
const DEFAULT_SQUARESIZE = 100;
const OFFSET_SQUARESIZE = 100;

@Injectable({
  providedIn: 'root'
})
export class GridService extends ToolService {

  active: boolean;
  opacity: number;
  squareSize: number;
  grid: SVGElement;

  private readonly renderer: Renderer2;
  private svgDimensions: Dimension;

  constructor(rendererFactory: RendererFactory2,
              private svg: SvgService
  ) {
    super();
    this.squareSize = DEFAULT_SQUARESIZE;
    this.opacity = DEFAULT_OPACITY;
    this.active = false;
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  keyEvHandler(keyCode: string): void {
    switch (keyCode) {
      case 'KeyG': {
        this.active = !this.active;
        break;
      }
      case 'NumpadAdd': {
        if (this.active && this.squareSize < MAX_SQUARESIZE) {
          this.squareSize += OFFSET_SQUARESIZE - (this.squareSize % OFFSET_SQUARESIZE);
        }
        break;
      }
      case 'NumpadSubtract': {
        if (this.active && this.squareSize > MIN_SQUARESIZE) {
          this.squareSize % OFFSET_SQUARESIZE === 0 ?
            this.squareSize -= OFFSET_SQUARESIZE : this.squareSize -= this.squareSize % OFFSET_SQUARESIZE;
        }
        break;
      }
      default:
        break;
    }
    this.handleGrid();
  }

  handleGrid(): void {
    if (this.svgDimensions === undefined) {
      const width = this.svg.structure.root.getAttribute('width');
      const height = this.svg.structure.root.getAttribute('height');
      if (width != null && height != null) {
        this.svgDimensions = {
          width: +width,
          height: +height
        };
      }
    }

    if (!!this.grid) {
      this.grid.remove();
    }

    if (this.active) {
      const path = this.renderer.createElement(
        'path',
        this.svg.structure.root.namespaceURI
      );
      path.setAttribute('id', 'grid');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-width', '1');

      this.grid = path;

      this.grid.setAttribute('d', this.generateGrid());
      this.grid.setAttribute('stroke', 'black');
      this.grid.setAttribute('opacity', this.opacity.toString());
      this.renderer.appendChild(this.svg.structure.endZone, this.grid);
    }
  }

  protected generateGrid(): string {
    let stringPath = '';

    // lignes verticales
    for (let i = 0; i < this.svgDimensions.width;
      i += this.squareSize) {
      stringPath += ' M ' + i.toString() + ',0'
        + ' L' + i.toString() + ',' + this.svgDimensions.height;
    }
    // lignes horizontales
    for (let i = 0; i < this.svgDimensions.height;
      i += this.squareSize) {
      stringPath += ' M 0' + ',' + i.toString()
        + ' L ' + this.svgDimensions.width + ',' + i.toString();
    }

    return stringPath;
  }
}
