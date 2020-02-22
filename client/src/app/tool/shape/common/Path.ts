import { ElementRef, Renderer2 } from '@angular/core';
import { MathService } from '../../mathematics/tool.math-service.service';
import { Point } from './Point';

// Class tested in ../Line/line-logic.component.spec.ts
export class Path {
  private pathAtribute = '';
  private mathService = new MathService();
  datas: PathData = { points: [], instructions: [] };
  lastPoint: Point;

  constructor(
    initialPoint: Point,
    private renderer: Renderer2,
    private element: ElementRef,
    public withJonctions: boolean
  ) {
    this.datas.points.push(initialPoint);
    const instruction =
      'M ' + initialPoint.x.toString() + ' ' + initialPoint.y.toString() + ' ';

    this.addInstruction(instruction);
  }

  addLine(point: Point): void {
    this.datas.points.push(point);
    const instruction =
      'L ' + point.x.toString() + ' ' + point.y.toString() + ' ';
    this.addInstruction(instruction);
  }

  addInstruction(instruction: string): void {
    this.datas.instructions.push(instruction);
    this.pathAtribute += instruction;
    this.renderer.setAttribute(this.element, 'd', this.pathAtribute);
  }

  addJonction( center: Point, radius: number) {
    const instruction = ` M ${center.x},
    ${center.y} m -${radius} 0 a ${radius},${radius} 0 1,0 ${2 * radius},
    0 a ${radius},${radius} 0 1,0 -${2 * radius},0 M ${center.x},
    ${center.y} `;
    this.addInstruction(instruction);
  }

  getAlignedPoint(newPoint: Point): Point {
    const lastPoint = this.datas.points[this.datas.points.length - 1];

    return this.mathService.findAlignedSegmentPoint(newPoint, lastPoint);
  }

  simulateNewLine(point: Point): void {
    const temp =
      this.pathAtribute +
      'L ' +
      point.x.toString() +
      ' ' +
      point.y.toString() +
      ' ';
    this.lastPoint = point;
    this.renderer.setAttribute(this.element, 'd', temp);
  }

  removeLastInstruction() {
    this.datas.points.pop();
    const lengthToRemove = String(this.datas.instructions.pop()).length;
    this.pathAtribute = this.pathAtribute.substr(
      0,
      this.pathAtribute.length - lengthToRemove
    );
    this.renderer.setAttribute(this.element, 'd', this.pathAtribute);
  }

  removePath() {
    this.pathAtribute = '';
    this.datas.points = [];
    this.datas.instructions = [];
    this.renderer.setAttribute(this.element, 'd', this.pathAtribute);
  }

  closePath() {
    this.datas.points.push(this.datas.points[0]);
    const instruction = 'Z';
    this.addInstruction(instruction);
  }

  setLineCss(strokewidth: string, strokeColor: string) {
    this.renderer.setAttribute(this.element, 'stroke-width', strokewidth);
    this.renderer.setAttribute(this.element, 'stroke', strokeColor);
    if (this.withJonctions) {
      this.renderer.setAttribute(this.element, 'fill', strokeColor);
    } else {
      this.renderer.setAttribute(this.element, 'fill', 'none');
    }
  }
}

interface PathData {
    points: Point[],
    instructions: string[],
  }
