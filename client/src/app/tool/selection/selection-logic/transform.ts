import { Renderer2 } from '@angular/core';
import { Point } from '../../shape/common/point';
import { Matrix } from './matrix';

export class Transform {

  private matrix: Matrix;

  constructor(private element: SVGElement, private renderer: Renderer2) {
    const transform = this.element.getAttribute('transform') as string;
    const result =
      /matrix\(\s*([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)\)/.exec(transform);
    const data = (result !== null) ?
      [[+result[1], +result[3], +result[5]],
       [+result[2], +result[4], +result[6]],
       [         0,          0,          1]]
    : undefined;

    this.matrix = new Matrix(3, 3, data);
  }

  static translateAll(elements: Iterable<SVGElement>, dx: number, dy: number, renderer: Renderer2): void {
    for (const element of elements) {
      new Transform(element, renderer).translate(dx, dy);
    }
  }

  static rotateAll(elements: Iterable<SVGElement>, point: Point, angle: number, renderer: Renderer2): void {
    for (const element of elements) {
      new Transform(element, renderer).rotate(point, angle);
    }
  }

  static scaleAll(elements: Iterable<SVGElement>, point: Point, sx: number, sy: number, renderer: Renderer2): void {
    for (const element of elements) {
      new Transform(element, renderer).scale(point, sx, sy);
    }
  }

  translate(dx: number, dy: number): void {
    const translateMatrix         = new Matrix(3, 3, [[1, 0, dx],
                                                      [0, 1, dy],
                                                      [0, 0, 1]]);
    this.matrix = translateMatrix.multiply(this.matrix);
    this.setAttributes();
  }

  rotate(point: Point, angle: number): void {
    const [x, y] = [point.x, point.y];
    const radians = angle * Math.PI / 180;
    const translateMatrix         = new Matrix(3, 3, [[1, 0, x],
                                                      [0, 1, y],
                                                      [0, 0, 1]]);
    const rotateMatrix            = new Matrix(3, 3, [[Math.cos(radians), -Math.sin(radians), 0],
                                                      [Math.sin(radians),  Math.cos(radians), 0],
                                                      [0, 0, 1]]);
    const translateMatrixInverse  = new Matrix(3, 3, [[1, 0, -x],
                                                      [0, 1, -y],
                                                      [0, 0, 1]]);
    this.matrix = translateMatrixInverse.multiply(this.matrix);
    this.matrix = rotateMatrix.multiply(this.matrix);
    this.matrix = translateMatrix.multiply(this.matrix);
    this.setAttributes();
  }

  scale(point: Point, sx: number, sy: number): void {
    const [x, y] = [point.x, point.y];
    const translateMatrix         = new Matrix(3, 3, [[1, 0, x],
                                                      [0, 1, y],
                                                      [0, 0, 1]]);
    const scaleMatrix             = new Matrix(3, 3, [[sx, 0, 0],
                                                      [0, sy, 0],
                                                      [0, 0, 1]]);
    const translateMatrixInverse  = new Matrix(3, 3, [[1, 0, -x],
                                                      [0, 1, -y],
                                                      [0, 0, 1]]);

    this.matrix = translateMatrixInverse.multiply(this.matrix);
    this.matrix = scaleMatrix.multiply(this.matrix);
    this.matrix = translateMatrix.multiply(this.matrix);
    this.setAttributes();
  }

  getTransformTranslate(): [number, number] {
    return [this.matrix.data[0][2] , this.matrix.data[1][2]];
  }

  private setAttributes(): void {
    this.renderer.setAttribute(
      this.element,
      'transform',
      `matrix(${this.matrix.data[0][0]},` +
      `${this.matrix.data[1][0]},` +
      `${this.matrix.data[0][1]},` +
      `${this.matrix.data[1][1]},` +
      `${this.matrix.data[0][2]},` +
      `${this.matrix.data[1][2]})`
      );
  }

}
