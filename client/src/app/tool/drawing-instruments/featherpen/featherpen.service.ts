import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Point} from '../../shape/common/point';
import {ToolService} from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class FeatherpenService extends ToolService {

  readonly MIN_LENGTH: number = 10;
  readonly MAX_LENGTH: number = 100;
  readonly DEFAULT_LENGTH: number = 20;
  readonly MAX_ANGLE: number = 180;
  readonly MIN_ANGLE: number = 0;
  readonly DEFAULT_ANGLE: number = 20;
  readonly OFFSET_ANGLE: number = 15;
  readonly PI_DEG: number = 180;

  length: number;
  angle: number;
  private readonly angles: number[];
  emitter: Subject<number>;

  constructor() {
    super();
    this.length = this.DEFAULT_LENGTH;
    this.angle = this.DEFAULT_ANGLE;
    this.emitter = new Subject();
    this.angles = [];
    let i = 0;
    while (i <= this.MAX_ANGLE) {
      this.angles.push(i++);
    }
  }

  pathCentered(point: Point): string {
    const topPoint = new Point(
      point.x + this.length / 2 * Math.cos(this.toRadians(this.angle)),
      point.y - this.length / 2 * Math.sin(this.toRadians(this.angle))
    );
    const bottomPoint = new Point(
      point.x - this.length / 2 * Math.cos(this.toRadians(this.angle)),
      point.y + this.length / 2 * Math.sin(this.toRadians(this.angle))
    );
    const p = `M ${point.x} ${point.y} L ${topPoint.x} ${topPoint.y} L ${bottomPoint.x} ${bottomPoint.y}`;
    if (p.includes('Infinity')) {console.log(`Infinity computed ${point.x} ${point.y}`);}
    return p;
  }

  private toRadians(angleDeg: number): number {
    return angleDeg * Math.PI / this.PI_DEG;
  }

  updateAngle(wheelEv: WheelEvent): number {
    const oldAngle = this.angle;

    if (wheelEv.altKey) {
      this.angle = wheelEv.deltaY < 0 ? (this.angle + 1) % this.MAX_ANGLE :
        (this.angle - 1) % this.PI_DEG;
    } else {
      this.angle = wheelEv.deltaY < 0 ? (this.angle + this.OFFSET_ANGLE) % this.MAX_ANGLE :
        (this.angle - this.OFFSET_ANGLE) % this.PI_DEG;
    }

    if (this.angle < 0) {
      this.angle += this.MAX_ANGLE;
    }
    return oldAngle;
  }

  getInterpolatedPoints(initial: Point, final: Point): Point[] {
    const points = [];
    const delta = {x: final.x - initial.x, y: final.y - initial.y};
    if (Math.abs(delta.x) > Math.abs(delta.y)) {
      for (let x = Math.min(initial.x, final.x); x < Math.max(initial.x, final.x); x++) {
        if (Math.min(initial.x, final.x) === initial.x) {
          points.push(new Point(x, initial.y + 1 / delta.x));
        } else {
          points.push(new Point(x, final.y + 1 / delta.x));
        }
      }
    } else {
      for (let y = Math.min(initial.y, final.y); y < Math.max(initial.y, final.y); y++) {
        if (Math.min(initial.y, final.y) === initial.y) {
          points.push(new Point(initial.x + 1 / delta.y, y));
        } else {
          points.push(new Point(final.x + 1 / delta.y, y));
        }
      }
    }
    return points;
  }

  interpolate(oldAngle: number, newAngle: number, point: Point, up: boolean): string {
    let path = '';
    let angles: number[] = [];

    if (up) {
      if (oldAngle < newAngle) {
        angles = this.angles.slice(oldAngle, newAngle);
      } else {
        const after = this.angles.slice(oldAngle);
        angles = this.angles.slice(1, newAngle);
        after.forEach((angle) => angles.push(angle));
      }
    } else {
      if (oldAngle < newAngle) {
        const before = this.angles.slice(1, oldAngle);
        angles = this.angles.slice(newAngle, this.angles.length);
        before.forEach((angle) => angles.push(angle));
      } else {
        angles = this.angles.slice(newAngle, oldAngle);
      }
    }

    for (const angle of angles) {
      this.angle = angle;
      path += this.pathCentered(point);
    }
    this.angle = newAngle;
    return path;
  }
}
