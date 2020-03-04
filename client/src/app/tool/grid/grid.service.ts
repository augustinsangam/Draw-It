import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';
import { Dimension } from '../shape/common/rectangle';
import { ToolService } from '../tool.service';

@Injectable({
  providedIn: 'root'
})
export class GridService extends ToolService {

  readonly MAX_SQUARESIZE: number = 400;
  readonly MIN_SQUARESIZE: number = 5;
  protected readonly DEFAULT_OPACITY: number = 0.4;
  protected readonly DEFAULT_SQUARESIZE: number = 100;
  protected readonly SQUARESIZE_INCREMENT: number = 5;

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
    this.squareSize = this.DEFAULT_SQUARESIZE;
    this.opacity = this.DEFAULT_OPACITY;
    this.active = false;
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  keyEvHandler(keyCode: string): void {
    switch (keyCode) {
      case 'g': {
        this.active = !this.active;
        break;
      }
      case '+': {
        if (this.active && this.squareSize < this.MAX_SQUARESIZE) {
          this.squareSize += this.SQUARESIZE_INCREMENT - (this.squareSize % this.SQUARESIZE_INCREMENT);
        }
        break;
      }
      case '-': {
        if (this.active && this.squareSize > this.MIN_SQUARESIZE) {
          this.squareSize % this.SQUARESIZE_INCREMENT === 0 ?
            this.squareSize -= this.SQUARESIZE_INCREMENT : this.squareSize -= this.squareSize % this.SQUARESIZE_INCREMENT;
        }
        break;
      }
      default:
        break;
    }
    this.handleGrid();
  }

  handleGrid(): void {
    const width = this.svg.structure.root.getAttribute('width');
    const height = this.svg.structure.root.getAttribute('height');
    if (width != null && height != null) {
      this.svgDimensions = {
        width: +width,
        height: +height
      };
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
