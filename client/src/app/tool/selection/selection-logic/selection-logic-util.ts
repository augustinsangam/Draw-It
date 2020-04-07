import { Renderer2 } from '@angular/core';
import { Point } from '../../shape/common/point';
import { Offset } from '../offset';
import { SingleSelection } from '../single-selection';
import { BasicSelectionType } from './element-selected-type';
import { MouseTracking } from './mouse-tracking';

export const COLORS = {
  RED: 'rgba(255, 0, 0, 0.7)',
  BLUE: 'rgba(0, 0, 255, 0.7)',
  GREEN: 'rgba(0, 255, 0, 0.7)',
  GRAY: 'rgba(128, 128, 255, 1)'
};

export const ANGLE = 15;
export const MOUSE_WHEEL_DELTA_Y = 53;
export const PASTE_TRANSLATION = 30;
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
export type WheelEventCallback = ($event: WheelEvent) => void;

export interface Mouse {
  left: MouseTracking;
  right: MouseTracking;
  wheel?: WheelEvent;
}

export interface SelectionRectangles {
  selection: SVGElement;
  inversion: SVGElement;
  visualisation: SVGElement;
}

export interface KeyManager {
  keyPressed: Set<string>;
  shift: boolean;
  alt: boolean;
  lastTimeCheck: number;
  handlers: {
    keydown: KeyboardPressCallback,
    keyup: KeyboardPressCallback,
  };
}

export class SelectionLogicUtil {

  static initialiseMouse(): Mouse {
    const point = new Point(0, 0);
    return {
      left: {
        startPoint: point, currentPoint: point, endPoint: point,
        mouseIsDown: false, selectedElement: BasicSelectionType.NOTHING,
        onDrag: false, onResize: false
      },
      right: {
        startPoint: point, currentPoint: point, endPoint: point,
        mouseIsDown: false, selectedElement: BasicSelectionType.NOTHING,
        onDrag: false, onResize: false
      }
    };
  }

  static initialiseRectangles(renderer: Renderer2, zone: SVGGElement, domain: string): SelectionRectangles {
    const rectangles: SelectionRectangles = {
      selection: renderer.createElement('rect', domain),
      inversion: renderer.createElement('rect', domain),
      visualisation: renderer.createElement('rect', domain)
    };
    [rectangles.selection, rectangles.inversion,
    rectangles.visualisation].forEach((rectangle) => {
      renderer.appendChild(zone, rectangle);
    });
    return rectangles;
  }

  static orderPoint(p1: Point, p2: Point): [Point, Point] {
    return [
      new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
      new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y))
    ];
  }

  static initialiseCircles(renderer: Renderer2, zone: SVGGElement, domain: string): SVGElement[] {
    const circles = new Array<SVGElement>();
    CIRCLES.forEach((index) => {
      const circle = renderer.createElement('circle', domain);
      const resizeType = index % (CIRCLES.length - 1) === 0 ? 'col-resize' : 'ns-resize';
      renderer.setStyle(circle, 'cursor', resizeType);
      circles.push(circle);
      renderer.appendChild(zone, circle);
    });
    return circles;
  }

  static clone(elements: Set<SVGElement>): Set<SVGElement> {
    const set = new Set<SVGElement>();
    elements.forEach((element) => {
      set.add(element.cloneNode(true) as SVGElement);
    });
    return set;
  }

  static getRealTarget(event: Event): SVGElement {
    let element = event.target as SVGElement;
    while (element.localName === 'tspan') {
      element = element.parentNode as SVGElement;
    }
    return element;
  }

  static findElementCenter(element: SVGElement, offset: Offset): Point {
    const selection = new SingleSelection(element, offset).points();
    return new Point(
      (selection[0].x + selection[1].x) / 2,
      (selection[0].y + selection[1].y) / 2
    );
  }

}
