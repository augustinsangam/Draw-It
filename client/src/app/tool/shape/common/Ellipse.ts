import {Point} from './Point';
import {Style} from '@angular/cli/lib/config/schema';
import {ElementRef, Renderer2} from '@angular/core';
import {MathService} from '../../mathematics/tool.math-service.service';

const SEMIOPACITY = 0.5;
export class Ellipse {
  private filled: boolean;
  private initialPoint: Point;
  private style: Style;

  constructor(
    initialPoint: Point,
    private renderer: Renderer2,
    private element: ElementRef,
    private mathService: MathService
  ) {
    this.filled = true;
    this.initialPoint = initialPoint;
  }
}
