import { Injectable } from '@angular/core';
import {ToolService} from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class FeatherpenService extends ToolService {

  readonly MIN_LENGTH: number = 20;
  readonly MAX_LENGTH: number = 60;
  readonly MAX_ANGLE: number = 359;
  readonly MIN_ANGLE: number = 0;

  length: number;
  angle: number;

  constructor() {
    super();
    this.length = this.MIN_LENGTH;
    this.angle = 0;
  }

  previewCentered(): string {
    this.angle = this.angle * Math.PI / 180;
    return `M 160 100 L ${160 - this.length * Math.sin(this.angle)} ${100 - this.length * Math.cos(this.angle)} L 160 100
    L ${160 + this.length * Math.cos(this.angle)} ${100 + this.length * Math.sin(this.angle)}`;
  }
}
