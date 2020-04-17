import { Renderer2 } from '@angular/core';
import { Point } from '../../tool/shape/common/point';
import { Matrix } from './matrix';

enum MATRIX_ELEMENT {
  SCALE_X = 1,
  SKEW_Y,
  SKEW_X,
  SCALE_Y,
  TRANSLATE_X,
  TRANSLATE_Y
}

export class Transform {

  private static readonly MATRIX_SIZE: number = 3;

  private matrix: Matrix;

  constructor(private element: SVGElement, private renderer: Renderer2) {
    const transform = this.element.getAttribute('transform') as string;
    const result =
      /matrix\(\s*([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)\)/.exec(transform);
    const data = (result !== null) ?
      [[+result[MATRIX_ELEMENT.SCALE_X] , +result[MATRIX_ELEMENT.SKEW_X]  , +result[MATRIX_ELEMENT.TRANSLATE_X]],
       [+result[MATRIX_ELEMENT.SKEW_Y]  , +result[MATRIX_ELEMENT.SCALE_Y] , +result[MATRIX_ELEMENT.TRANSLATE_Y]],
       [                              0 ,                               0 , 1                                  ]]
    : undefined;

    this.matrix = new Matrix(Transform.MATRIX_SIZE, Transform.MATRIX_SIZE, data);
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

  static scaleAll(elements: Iterable<SVGElement>,
                  point: Point,
                  sx: number,
                  sy: number,
                  renderer: Renderer2): void {
    for (const element of elements) {
      new Transform(element, renderer).scale(point, sx, sy);
    }
  }

  clone(): Transform {
    const result = new Transform(this.element, this.renderer);
    result.matrix = new Matrix(Transform.MATRIX_SIZE, Transform.MATRIX_SIZE, this.matrix.data);
    return result;
  }

  translate(dx: number, dy: number): void {
    const translateMatrix = new Matrix(
      Transform.MATRIX_SIZE,
      Transform.MATRIX_SIZE,
      [[1, 0, dx],
       [0, 1, dy],
       [0, 0, 1]]
    );
    this.matrix = translateMatrix.multiply(this.matrix);
    this.setAttributes();
  }

  rotate({x, y}: Point, angle: number): void {
    const PI_IN_DEGRES = 180;
    const radians = angle * Math.PI / PI_IN_DEGRES;
    const translateMatrix = new Matrix(
      Transform.MATRIX_SIZE,
      Transform.MATRIX_SIZE,
      [[1, 0, x],
       [0, 1, y],
       [0, 0, 1]]
    );

    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    const rotateMatrix = new Matrix(
      Transform.MATRIX_SIZE,
      Transform.MATRIX_SIZE,
      [[cos, -sin, 0],
       [sin,  cos, 0],
       [0, 0, 1]]
    );

    const translateMatrixInverse  = new Matrix(
      Transform.MATRIX_SIZE,
      Transform.MATRIX_SIZE,
      [[1, 0, -x],
       [0, 1, -y],
       [0, 0, 1]]
    );

    this.matrix = translateMatrixInverse.multiply(this.matrix);
    this.matrix = rotateMatrix.multiply(this.matrix);
    this.matrix = translateMatrix.multiply(this.matrix);
    this.setAttributes();
  }

  scale({x, y}: Point, sx: number, sy: number): void {
    const translateMatrix = new Matrix(
      Transform.MATRIX_SIZE,
      Transform.MATRIX_SIZE,
      [[1, 0, x],
       [0, 1, y],
       [0, 0, 1]]
    );

    const scaleMatrix = new Matrix(
      Transform.MATRIX_SIZE,
      Transform.MATRIX_SIZE,
      [[sx, 0, 0],
       [0, sy, 0],
       [0, 0, 1]]
    );

    const translateMatrixInverse = new Matrix(
      Transform.MATRIX_SIZE,
      Transform.MATRIX_SIZE,
      [[1, 0, -x],
       [0, 1, -y],
       [0, 0, 1]]
    );

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
