import {Injectable} from '@angular/core';
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

    this.angles = new Array(this.MAX_ANGLE);
    for (let i = this.MAX_ANGLE; i--; ) {
      this.angles[i] = i;
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
    return `M ${point.x} ${point.y} L ${topPoint.x} ${topPoint.y} L ${bottomPoint.x} ${bottomPoint.y}`;
  }

  private toRadians(angleDeg: number): number {
    return angleDeg * Math.PI / this.PI_DEG;
  }

  updateAngle(wheelEv: WheelEvent): number {
    const oldAngle = this.angle;

    const delta = wheelEv.altKey ? 1 : this.OFFSET_ANGLE;
    this.angle = wheelEv.deltaY < 0 ? (this.angle + delta) % this.MAX_ANGLE
                                    : (this.angle - delta) % this.PI_DEG;

    if (this.angle < 0) {
      this.angle += this.MAX_ANGLE;
    }
    return oldAngle;
  }

  getInterpolatedPoints(initial: Point, final: Point): Point[] {
    const points = [];
    const delta = {x: final.x - initial.x, y: final.y - initial.y};

    const aXAxis = delta.y / delta.x;
    const bXAxis = initial.y - aXAxis * initial.x;
    const aYAxis = delta.x / delta.y;
    const bYAxis = initial.x - aYAxis * initial.y;

    for (let x = Math.min(initial.x, final.x); x < Math.max(initial.x, final.x); x++) {
        points.push(new Point(x, aXAxis * x + bXAxis));
    }
    for (let y = Math.min(initial.y, final.y); y < Math.max(initial.y, final.y); y++) {
        points.push(new Point(aYAxis * y + bYAxis, y));
    }
    return points;
  }

  private interpolateUp(low: number, high: number, angles: number[]): number[] {
    if (low < high) {
      angles = this.angles.slice(low, high);
    } else {
      const after = this.angles.slice(low);
      angles = this.angles.slice(1, high);
      after.forEach((angle) => angles.push(angle));
    }
    return angles;
  }

  private interpolateDown(low: number, high: number, angles: number[]): number[] {
    if (low < high) {
      const before = this.angles.slice(1, low);
      angles = this.angles.slice(high, this.angles.length);
      before.forEach((angle) => angles.push(angle));
    } else {
      angles = this.angles.slice(high, low);
    }
    return angles;
  }

  interpolate(oldAngle: number, newAngle: number, point: Point, up: boolean): string {
    let path = '';
    let angles: number[] = [];

    if (up) {
      angles = this.interpolateUp(oldAngle, newAngle, angles);
    } else {
      angles = this.interpolateDown(oldAngle, newAngle, angles);
    }

    for (const angle of angles) {
      this.angle = angle;
      path += this.pathCentered(point);
    }
    this.angle = newAngle;
    return path;
  }
}
