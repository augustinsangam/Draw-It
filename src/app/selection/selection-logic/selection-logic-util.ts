import { Renderer2 } from '@angular/core';
import { Point } from '../../tool/shape/common/point';
import { Offset } from '../offset';
import { SingleSelection } from '../single-selection';
import { CircleType } from './circle-type';
import { BasicSelectionType } from './element-selected-type';
import { Mouse } from './mouse';

export const COLORS = {
  RED: 'rgba(255, 0, 0, 0.7)',
  BLUE: 'rgba(0, 0, 255, 0.7)',
  GREEN: 'rgba(0, 255, 0, 0.7)',
  GRAY: 'rgba(128, 128, 255, 1)',
  DRAK_RED: 'rgba(128, 0, 0, 1)'
};

export type MouseEventCallBack = ($event: MouseEvent) => void;
export type KeyboardPressCallback = ($event: KeyboardEvent) => void;
export type WheelEventCallback = ($event: WheelEvent) => void;

export interface SelectionRectangles {
  selection: SVGElement;
  inversion: SVGElement;
  visualisation: SVGElement;
}

export class SelectionLogicUtil {

  static readonly ANGLE: number               = 15;
  static readonly MOUSE_WHEEL_DELTA_Y: number = 53;
  static readonly PASTE_TRANSLATION: number   = 30;
  static readonly RECTANGLE_STROKE: string    = '2';
  static readonly CIRCLE_RADIUS: string       = '8';
  static readonly TIME_INTERVAL: number       = 100;
  static readonly DASH_ARRAY: string          = '10 5';
  static readonly OFFSET_TRANSLATE: number    = 3;

  static readonly CIRCLES: CircleType[] = [
    CircleType.LEFT_CIRCLE,
    CircleType.TOP_CIRCLE,
    CircleType.BOTTOM_CIRCLE,
    CircleType.RIGHT_CIRCLE
  ];

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
    SelectionLogicUtil.CIRCLES.forEach((index) => {
      const circle = renderer.createElement('circle', domain);
      const resizeType = index % (SelectionLogicUtil.CIRCLES.length - 1) === 0 ? 'col-resize' : 'ns-resize';
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
