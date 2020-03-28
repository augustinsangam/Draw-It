import { Renderer2 } from '@angular/core';
import { Point } from '../../shape/common/point';
import { Matrix } from './matrix';

export class Transform {

  private matrix: Matrix;

  constructor(private element: SVGElement, private renderer: Renderer2) {
    const transform = this.element.getAttribute('transform') as string;
    const result = /matrix\(\s*([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)\)/.exec(transform);
    // console.log(result);
    const data = (result !== null) ?
      [[+result[1], +result[3], +result[5]],
       [+result[2], +result[4], +result[6]],
       [         0,          0,          1]]
    :
    undefined;

    this.matrix = new Matrix(3, 3, data);
    // console.log(data);
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

  static scaleAll(elements: Iterable<SVGElement>, x: number, y: number, offsetX: number, offsetY: number, renderer: Renderer2): void {
    for (const element of elements) {
      new Transform(element, renderer).scale(x, y, offsetX, offsetY);
    }
  }

  translate(dx: number, dy: number): void {
    const translateMatrix = new Matrix(3, 3, [[1, 0, dx],
                                              [0, 1, dy],
                                              [0, 0, 1]]);
    this.matrix = this.matrix.multiply(translateMatrix);
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
    // console.log(rotateMatrix);
    this.matrix = this.matrix.multiply(translateMatrix);
    this.matrix = this.matrix.multiply(rotateMatrix);
    this.matrix = this.matrix.multiply(translateMatrixInverse);
    this.setAttributes();
  }

  scale(x: number, y: number, offsetX: number, offsetY: number): void {
    return;
  }

  getTransformTranslate(): [number, number] {
    return [this.matrix.data[0][2] , this.matrix.data[1][2]];
    // return [this.matrixAtribute[4] , this.matrixAtribute[5]];
  }

  private setAttributes(): void {
    this.renderer.setAttribute(
      this.element,
      'transform',
      // `scale(${this.scaleAttribute[0]},${this.scaleAttribute[1]}) ` +
      // `translate(${this.translateAttribute[0]},${this.translateAttribute[1]}) ` +
      // `rotate(${this.rotateAttribute[0]},${this.rotateAttribute[1]},${this.rotateAttribute[2]}) `
      `matrix(${this.matrix.data[0][0]},` +
      `${this.matrix.data[1][0]},` +
      `${this.matrix.data[0][1]},` +
      `${this.matrix.data[1][1]},` +
      `${this.matrix.data[0][2]},` +
      `${this.matrix.data[1][2]})`
      // `matrix(${this.matrix.linearize().slice(0, 6).toString()})`
      );
  }

}
