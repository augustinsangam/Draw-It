import { CircleType } from './circle-type';

export enum BasicSelectionType {
  NOTHING = 'NOTHING',
  DRAW_ELEMENT = 'DRAW_ELEMENT'
}

export type ElementSelectedType = CircleType | BasicSelectionType;
