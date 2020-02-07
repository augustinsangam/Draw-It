import { Point } from '../../common/Point';
import { Circle } from './Circle'

export interface PathData {
    points: Point[],
    jonctions: Circle[],
    instructions: string[],
  }
