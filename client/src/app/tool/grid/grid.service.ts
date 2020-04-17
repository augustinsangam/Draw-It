import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';
import { Dimension } from '../shape/common/dimension';
import { ToolService } from '../tool.service';
import { GridKeys } from './grid-keys';

@Injectable({
  providedIn: 'root'
})
export class GridService extends ToolService {

  protected static readonly MIN_SQUARESIZE: number = 5;
  protected static readonly MAX_SQUARESIZE: number = 400;
  protected static readonly MIN_OPACITY: number = 5;
  protected static readonly MAX_OPACITY: number = 100;
  protected static readonly DEFAULT_OPACITY: number = 40;
  protected static readonly DEFAULT_SQUARESIZE: number = 100;
  protected static readonly SQUARESIZE_INCREMENT: number = 5;

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
    this.squareSize = GridService.DEFAULT_SQUARESIZE;
    this.opacity = GridService.DEFAULT_OPACITY;
    this.active = false;
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  keyEvHandler(keyCode: string): void {
    switch (keyCode) {
      case GridKeys.G: {
        this.active = !this.active;
        break;
      }
      case GridKeys.PLUS: {
        if (this.active && this.squareSize < GridService.MAX_SQUARESIZE) {
          this.squareSize += GridService.SQUARESIZE_INCREMENT - (this.squareSize % GridService.SQUARESIZE_INCREMENT);
        }
        break;
      }
      case GridKeys.MINUS: {
        if (this.active && this.squareSize > GridService.MIN_SQUARESIZE) {
          this.squareSize -= this.squareSize % GridService.SQUARESIZE_INCREMENT === 0 ?
          GridService.SQUARESIZE_INCREMENT : this.squareSize % GridService.SQUARESIZE_INCREMENT;
        }
        break;
      }
      default:
        break;
    }
    this.handleGrid();
  }

  handleGrid(): void {
    this.svgDimensions = {
      width: this.svg.shape.width,
      height: this.svg.shape.height
    };

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
      this.grid.setAttribute('opacity', (this.opacity / GridService.MAX_OPACITY).toString());
      this.renderer.appendChild(this.svg.structure.endZone, this.grid);
    }
  }

  protected generateGrid(): string {
    let stringPath = '';

    for (let i = 0; i < this.svgDimensions.width;
      i += this.squareSize) {
      stringPath += ` M ${i},0 L ${i},${this.svgDimensions.height}`;
    }
    for (let i = 0; i < this.svgDimensions.height;
      i += this.squareSize) {
      stringPath += ` M 0,${i} L ${this.svgDimensions.width},${i}`;
    }

    return stringPath;
  }
}
