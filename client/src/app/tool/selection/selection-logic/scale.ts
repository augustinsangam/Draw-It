import { Point } from '../../shape/common/point';
import { Offset } from '../offset';
import { CircleType } from './circle-type';
import * as Util from './selection-logic-util';
import { SelectionLogicComponent } from './selection-logic.component';
import { Transform } from './transform';

const MINIMUM_SIZE = 5;

interface Dimensions {
  width: number;
  height: number;
}

export class Scale {

  private baseVisualisationRectangleDimension: Dimensions = { width: 0, height: 0 };
  private scaledRectangleDimension: Dimensions = { width: 0, height: 0 };
  private baseTransform: Map<SVGElement, Transform>;
  private scaleOffset: Offset;
  private inverted: Offset;

  constructor(private selectionLogic: SelectionLogicComponent) { }

  onMouseDown(): void {
    const selectionWidth = this.selectionLogic.rectangles.visualisation.getAttribute('width');
    const selectionHeight = this.selectionLogic.rectangles.visualisation.getAttribute('height');
    if (!!selectionHeight && !!selectionWidth) {
      const [width, height] = [+selectionWidth, +selectionHeight];
      this.baseVisualisationRectangleDimension = { width: Math.round(width), height: Math.round(height) };
      this.scaledRectangleDimension = { width: Math.round(width), height: Math.round(height) };
    }
    this.baseTransform = new Map();
    this.selectionLogic.service.selectedElements.forEach((element) => {
      this.baseTransform.set(element, new Transform(element, this.selectionLogic.renderer));
    });
    this.scaleOffset = { x: 0, y: 0 };
    this.inverted = { x: 1, y: 1 };
  }

  onMouseUp(): void {
    this.scaleOffset = { x: 0, y: 0 };
    this.inverted = { x: 1, y: 1 };
    this.baseTransform = new Map();
  }

  onMouseMove(previousCurrentPoint: Point): void {
    const mouseOffset: Offset = this.onResize(previousCurrentPoint);
    this.resizeVisualisationRectangle(mouseOffset);
  }

  private onResize(previousCurrentPoint: Point): Offset {
    const offsetX = +this.selectionLogic.mouse.left.selectedElement % (Util.CIRCLES.length - 1) === 0 ?
      this.selectionLogic.mouse.left.currentPoint.x - previousCurrentPoint.x : 0;
    const offsetY = +this.selectionLogic.mouse.left.selectedElement % (Util.CIRCLES.length - 1) !== 0 ?
      this.selectionLogic.mouse.left.currentPoint.y - previousCurrentPoint.y : 0;

    this.scaledRectangleDimension.width += this.selectionLogic.mouse.left.selectedElement === 0 ? -offsetX : offsetX;
    this.scaledRectangleDimension.height += this.selectionLogic.mouse.left.selectedElement === 1 ? -offsetY : offsetY;

    const mouseOffset: Offset = { x: offsetX, y: offsetY };
    this.scaleOffset = { x: this.scaleOffset.x + offsetX, y: this.scaleOffset.y + offsetY };

    const factorX = this.baseVisualisationRectangleDimension.width >= MINIMUM_SIZE ?
      this.scaledRectangleDimension.width / this.baseVisualisationRectangleDimension.width : 1;
    const factorY = this.baseVisualisationRectangleDimension.height >= MINIMUM_SIZE ?
      this.scaledRectangleDimension.height / this.baseVisualisationRectangleDimension.height : 1;

    this.resizeAll([factorX, factorY]);

    return mouseOffset;
  }

  private resizeAll(factors: [number, number]): void {
    const point = Util.SelectionLogicUtil.findElementCenter(
      this.selectionLogic.rectangles.visualisation,
      this.selectionLogic.getSvgOffset()
    );
    point.x = point.x - this.scaleOffset.x / 2;
    point.y = point.y - this.scaleOffset.y / 2;

    this.baseTransform.forEach((value) => {
      value.clone().scale(point, factors[0] * this.inverted.x, factors[1] * this.inverted.y);
    });

    if (factors[0] !== 1) {
      Transform.translateAll(this.selectionLogic.service.selectedElements, this.scaleOffset.x / 2, 0, this.selectionLogic.renderer);
    }
    if (factors[1] !== 1) {
      Transform.translateAll(this.selectionLogic.service.selectedElements, 0, this.scaleOffset.y / 2, this.selectionLogic.renderer);
    }
  }

  private resizeVisualisationRectangle(mouseOffset: Offset): void {
    const x = this.selectionLogic.rectangles.visualisation.getAttribute('x');
    const y = this.selectionLogic.rectangles.visualisation.getAttribute('y');
    const width = this.selectionLogic.rectangles.visualisation.getAttribute('width');
    const height = this.selectionLogic.rectangles.visualisation.getAttribute('height');
    let [refPoint1, refPoint2] = [new Point(0, 0), new Point(0, 0)];
    let splitedOffset: [Offset, Offset];
    if (!!x && !!y && !!width && !!height) {
      [refPoint1.x, refPoint1.y] = [+x, +y];
      [refPoint2.x, refPoint2.y] = [+x + Math.round(+width), +y + Math.round(+height)];
      splitedOffset = this.preventResizeOverflow(mouseOffset, [refPoint1, refPoint2]);
      [refPoint1, refPoint2] = this.drawVisualisationResising(splitedOffset[0], [refPoint1, refPoint2]);
      this.switchControlPoint([refPoint1, refPoint2], splitedOffset);
      this.drawVisualisationResising(splitedOffset[1], [refPoint1, refPoint2]);
    }
  }

  private switchControlPoint(
    refPoints: [Point, Point],
    splitedOffset: [Offset, Offset])
    : void {
    let switched = false;
    const refPoint1 = refPoints[0];
    const refPoint2 = refPoints[1];

    if (refPoint2.x - refPoint1.x <= 1 && splitedOffset[0].x !== 0) {
      if (splitedOffset[0].x < 0 && this.selectionLogic.mouse.left.selectedElement !== CircleType.LEFT_CIRCLE) {
        this.selectionLogic.mouse.left.selectedElement = CircleType.LEFT_CIRCLE;
        switched = true;
      } else if (splitedOffset[0].x > 0 && this.selectionLogic.mouse.left.selectedElement !== CircleType.RIGHT_CIRCLE) {
        this.selectionLogic.mouse.left.selectedElement = CircleType.RIGHT_CIRCLE;
        switched = true;
      }
      if (switched) {
        this.inverted.x = -this.inverted.x;
      }
    }
    switched = false;
    if (refPoint2.y - refPoint1.y <= 1 && splitedOffset[0].y !== 0) {
      if (splitedOffset[0].y < 0 && this.selectionLogic.mouse.left.selectedElement !== CircleType.TOP_CIRCLE) {
        this.selectionLogic.mouse.left.selectedElement = CircleType.TOP_CIRCLE;
        switched = true;
      } else if (splitedOffset[0].y > 0 && this.selectionLogic.mouse.left.selectedElement !== CircleType.BOTTOM_CIRCLE) {
        this.selectionLogic.mouse.left.selectedElement = CircleType.BOTTOM_CIRCLE;
        switched = true;
      }
      if (switched) {
        this.inverted.y = -this.inverted.y;
      }
    }
  }

  private preventResizeOverflow(
    mouseOffset: Offset,
    pointRef: [Point, Point])
    : [Offset, Offset] {

    let offset1: Offset = { x: 0, y: 0 };
    let offset2: Offset = { x: 0, y: 0 };

    switch (this.selectionLogic.mouse.left.selectedElement) {
      case CircleType.LEFT_CIRCLE: {
        const splitedOffset = pointRef[0].x + mouseOffset.x > pointRef[1].x ? pointRef[1].x - pointRef[0].x : mouseOffset.x;
        offset1 = { x: splitedOffset, y: 0 };
        offset2 = { x: -(mouseOffset.x - splitedOffset), y: 0 };
        break;
      }
      case CircleType.TOP_CIRCLE: {
        const splitedOffset = pointRef[0].y + mouseOffset.y > pointRef[1].y ? pointRef[1].y - pointRef[0].y : mouseOffset.y;
        offset1 = { x: 0, y: splitedOffset };
        offset2 = {x: 0, y: -(mouseOffset.y - splitedOffset)};
        break;
      }
      case CircleType.BOTTOM_CIRCLE: {
        const splitedOffset = pointRef[1].y + mouseOffset.y < pointRef[0].y ? pointRef[0].y - pointRef[1].y : mouseOffset.y;
        offset1 = { x: 0, y: splitedOffset };
        offset2 = { x: 0, y: -(mouseOffset.y - splitedOffset) };
        break;
      }
      case CircleType.RIGHT_CIRCLE: {
        const splitedOffset = pointRef[1].x + mouseOffset.x < pointRef[0].x ? pointRef[0].x - pointRef[1].x : mouseOffset.x;
        offset1 = { x: splitedOffset, y: 0 };
        offset2 = { x: -(mouseOffset.x - splitedOffset), y: 0 };
        break;
      }
      default:
        break;
    }
    return [offset1, offset2];
  }

  private drawVisualisationResising(mouseOffset: Offset, refPoint: Point[]): Point[] {
    const p1 = new Point(
      refPoint[0].x + ((this.selectionLogic.mouse.left.selectedElement === CircleType.LEFT_CIRCLE) ? mouseOffset.x : 0),
      refPoint[0].y + ((this.selectionLogic.mouse.left.selectedElement === CircleType.TOP_CIRCLE) ? mouseOffset.y : 0),
    );
    const p2 = new Point(
      refPoint[1].x + ((this.selectionLogic.mouse.left.selectedElement === CircleType.RIGHT_CIRCLE) ? mouseOffset.x : 0),
      refPoint[1].y + ((this.selectionLogic.mouse.left.selectedElement === CircleType.BOTTOM_CIRCLE) ? mouseOffset.y : 0),
    );
    this.selectionLogic.drawVisualisation(p1, p2);
    return [p1, p2];
  }
}
