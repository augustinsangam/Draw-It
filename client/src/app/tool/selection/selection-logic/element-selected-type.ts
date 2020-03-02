import { CircleType } from './selection-logic-util';

export enum BasicSelectionType {
  NOTHING,
  DRAW_ELEMENT,
}

export type ElementSelectedType = CircleType | BasicSelectionType;
