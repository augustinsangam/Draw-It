import { Renderer2 } from '@angular/core';
import { MathService } from '../../mathematics/tool.math-service.service';
import { Point } from './point';

interface PathData {
  points: Point[];
  instructions: string[];
}

// Class tested in ../Line/line-logic.component.spec.ts
// TODO: les strings bizares
export class Path {
  private pathAtribute: string;
  private mathService: MathService;
  datas: PathData;
  lastPoint: Point;

  constructor(
    initialPoint: Point,
    private renderer: Renderer2,
    private element: SVGElement,
    public withJonctions: boolean
  ) {
    this.pathAtribute = '';
    this.mathService = new MathService();
    this.datas = { points: [], instructions: [] };
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

  addJonction(center: Point, radius: number): void {
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

  removeLastInstruction(): void {
    this.datas.points.pop();
    let instructionToRemove = 1;
    if (this.withJonctions) {
      instructionToRemove ++;
    }
    for (let i = 0; i < instructionToRemove; i++) {
      const lengthToRemove = String(this.datas.instructions.pop()).length;
      this.pathAtribute = this.pathAtribute.substr(
        0,
        this.pathAtribute.length - lengthToRemove
      );
      this.renderer.setAttribute(this.element, 'd', this.pathAtribute);
    }
  }

  removePath(): void {
    this.pathAtribute = '';
    this.datas.points = [];
    this.datas.instructions = [];
    this.renderer.setAttribute(this.element, 'd', this.pathAtribute);
  }

  setLineCss(strokewidth: string, strokeColor: string): void {
    this.renderer.setAttribute(this.element, 'stroke-width', strokewidth);
    this.renderer.setAttribute(this.element, 'stroke', strokeColor);
    if (this.withJonctions) {
      this.renderer.setAttribute(this.element, 'fill', strokeColor);
    } else {
      this.renderer.setAttribute(this.element, 'fill', 'none');
    }
  }
}
