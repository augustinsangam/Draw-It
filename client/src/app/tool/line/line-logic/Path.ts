import { ElementRef, Renderer2 } from '@angular/core';
import { MathService} from '../../mathematics/tool.math-service.service'
import {Point} from '../../tool-common classes/Point';
import {Circle} from './Circle'
import {PathData} from './PathData'

export class Path {
    datas: PathData = {points: [], jonctions: [], instructions: []}
    private pathAtribute = '';
    lastPoint: Point;
    private mathService = new MathService();
    constructor( initialPoint: Point,
                 private renderer: Renderer2,
                 private element: ElementRef,
                 public withJonctions: boolean ) {
      this.datas.points.push(initialPoint);
      const instruction = 'M ' + initialPoint.x.toString() + ' ' + initialPoint.y.toString() + ' ';
      this.addInstruction(instruction);
      this.renderer.setAttribute(this.element, 'fill', 'none');
    }
    addLine(point: Point) {
      this.datas.points.push(point);
      const instruction = 'L ' + point.x.toString() + ' ' + point.y.toString() + ' ';
      this.addInstruction(instruction);
    }
    addInstruction(instruction: string) {
      this.datas.instructions.push(instruction);
      this.pathAtribute += instruction;
      this.renderer.setAttribute(this.element, 'd', this.pathAtribute);
    }
    addJonction(element: ElementRef, point: Point, jonctionRadius: string, jonctionColor: string) {
      const jonction = new Circle(point, this.renderer, element, jonctionRadius, jonctionColor)
      this.datas.jonctions.push(jonction);
    }
    getAlignedPoint(newPoint: Point): Point {
      const lastPoint = this.datas.points[this.datas.points.length - 1];
      return this.mathService.findAlignedSegmentPoint(newPoint, lastPoint)
    }
    simulateNewLine(point: Point) {
      const temp = this.pathAtribute + 'L ' + point.x.toString() + ' ' + point.y.toString() + ' ';
      this.lastPoint = point;
      this.renderer.setAttribute(this.element, 'd', temp);
    }
    removeLastLine() {
      this.datas.points.pop();
      const lengthToRemove = String(this.datas.instructions.pop()).length ;
      this.pathAtribute = this.pathAtribute.substr(0, this.pathAtribute.length - lengthToRemove);
      this.renderer.setAttribute(this.element, 'd', this.pathAtribute );
      if (this.withJonctions && this.datas.jonctions.length > 1) {
        this.removeLastJonction();
      }
    }
    removePath() {
      this.pathAtribute = '';
      this.datas.points = [];
      this.datas.instructions = [];
      this.renderer.setAttribute(this.element, 'd', this.pathAtribute);
      while (this.datas.jonctions.length) {
        this.removeLastJonction()
      }
    }
    removeLastJonction() {
      const lastCircle = this.datas.jonctions.pop();
      if (lastCircle !== undefined) {
        const lastJonction = lastCircle.element;
        this.renderer.removeChild(this.renderer.parentNode(lastJonction), lastJonction);
      }
    }
    closePath() {
      this.datas.points.push(this.datas.points[0]);
      const instruction = 'Z';
      this.addInstruction(instruction);
    }
    setLineCss(strokewidth: string, strokeColor: string) {
      this.renderer.setAttribute(this.element, 'stroke-width', strokewidth);
      this.renderer.setAttribute(this.element, 'stroke', strokeColor);
    }
  }
