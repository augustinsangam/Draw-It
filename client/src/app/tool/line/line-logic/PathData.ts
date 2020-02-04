import {Point} from '../../tool-common classes/Point';
import {Circle} from './Circle'

export interface PathData {
    points: Point[],
    jonctions: Circle[],
    instructions: string[],
  }
