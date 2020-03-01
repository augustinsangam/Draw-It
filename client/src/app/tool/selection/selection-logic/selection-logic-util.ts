import { MouseTracking } from './mouse-tracking';

export const COLORS = {
  RED: 'rgba(255, 0, 0, 0.7)',
  BLUE: 'rgba(0, 0, 255, 0.7)',
  GREEN: 'rgba(0, 255, 0, 0.7)',
  GRAY: 'rgba(128, 128, 255, 1)'
};

export const RECTANGLE_STROKE = '2';
export const CIRCLE_RADIUS = '8';
export const TIME_INTERVAL = 100;
export const DASH_ARRAY = '10 5';
export const OFFSET_TRANSLATE = 3;

export enum CircleType {
  LEFT_CIRCLE = 0,
  TOP_CIRCLE,
  BOTTOM_CIRCLE,
  RIGHT_CIRCLE
}

export const CIRCLES = [
  CircleType.LEFT_CIRCLE,
  CircleType.TOP_CIRCLE,
  CircleType.BOTTOM_CIRCLE,
  CircleType.RIGHT_CIRCLE
];

export type MouseEventCallBack = ($event: MouseEvent) => void;
export type KeyboardPressCallback = ($event: KeyboardEvent) => void;

export interface Mouse {
  left: MouseTracking;
  right: MouseTracking;
}

export interface SelectionRectangles {
  selection: SVGElement;
  inversion: SVGElement;
  visualisation: SVGElement;
}

export interface KeyManager {
  keyPressed: Set<string>;
  lastTimeCheck: number;
  handlers: {
    keydown: KeyboardPressCallback,
    keyup: KeyboardPressCallback
  };
}
