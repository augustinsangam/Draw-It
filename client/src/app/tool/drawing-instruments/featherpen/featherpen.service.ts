import { Injectable } from '@angular/core';
import {Point} from '../../shape/common/point';
import {ToolService} from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class FeatherpenService extends ToolService {

  readonly MIN_LENGTH: number = 10;
  readonly MAX_LENGTH: number = 200;
  readonly DEFAULT_LENGTH: number = 100;
  readonly MAX_ANGLE: number = 180;
  readonly MIN_ANGLE: number = 0;
  readonly DEFAULT_ANGLE: number = 20;

  length: number;
  angle: number;

  constructor() {
    super();
    this.length = this.DEFAULT_LENGTH;
    this.angle = this.DEFAULT_ANGLE;
  }

  pathCentered(point: Point): string {
    const topPoint = new Point(
      point.x + this.length / 2 * Math.sin(this.toRadians(this.angle)),
      point.y - this.length / 2 * Math.cos(this.toRadians(this.angle))
    );
    const bottomPoint = new Point(
      point.x - this.length / 2 * Math.sin(this.toRadians(this.angle)),
      point.y + this.length / 2 * Math.cos(this.toRadians(this.angle))
    );
    return `M ${point.x} ${point.y} L ${topPoint.x} ${topPoint.y} L ${bottomPoint.x} ${bottomPoint.y}`;
  }

  toRadians(angleDeg: number): number {
    return angleDeg * Math.PI / 180;
  }

  incrementAngle(wheelEv: WheelEvent): number {
    const oldAngle = this.angle;
    if (wheelEv.altKey) {
      this.angle = (this.angle + 1) % 180;
      return oldAngle;
    }
    this.angle = (this.angle + 15) % 180;
    return oldAngle;
  }

  interpolate(oldAngle: number, newAngle: number, point: Point): string {
    let path = '';
    for (let angle = oldAngle; angle < newAngle; angle++) {
      this.angle = angle;
      path += this.pathCentered(point);
    }
    this.angle = newAngle;
    return path;
  }

}
