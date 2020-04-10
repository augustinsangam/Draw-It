import { MouseTracking } from './mouse-tracking';
export interface Mouse {
  left: MouseTracking;
  right: MouseTracking;
  wheel?: WheelEvent;
}
