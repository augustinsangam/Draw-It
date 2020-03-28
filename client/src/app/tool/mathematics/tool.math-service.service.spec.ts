import { TestBed } from '@angular/core/testing';
import { Point } from '../shape/common/point';
import {CONSTANTS, Shape, ShapeConstants} from './tool.math-service-util';
import { MathService, PolygonProperties } from './tool.math-service.service';

// tslint:disable: no-magic-numbers

describe('MathService', () => {
  let service: MathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(MathService);
  });

  it('#should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#distanceIsLessThan3Pixel should return true if distance is 0', () => {
    const point1 = new Point(42, 42);

    const result = service.distanceIsLessThan3Pixel(point1, point1);

    expect(result).toBeTruthy();
  });

  it('#distanceIsLessThan3Pixel should return true if distance is 0', () => {
    const point1 = new Point(42, 42);

    const point2 = new Point(40, 40);

    const result = service.distanceIsLessThan3Pixel(point1, point2);

    expect(result).toBeTruthy();
  });

  it('#distanceIsLessThan3Pixel should return true if distance is 3', () => {
    const point1 = new Point(42, 42);

    const point2 = new Point(39, 39);

    const result = service.distanceIsLessThan3Pixel(point1, point2);

    expect(result).toBeTruthy();
  });

  it('#distanceIsLessThan3Pixel should return false if distance is more than 3'
  , () => {
    const point1 = new Point(42, 42);

    const point2 = new Point(69, 69);

    const result = service.distanceIsLessThan3Pixel(point1, point2);

    expect(result).toBeFalsy();
  });

  it('#distanceIsLessThan3Pixel should return true'
  + 'if distance less than 3(with negatives)',
   () => {
    const point1 = new Point(-1, -1);

    const point2 = new Point(1, 1);

    const result = service.distanceIsLessThan3Pixel(point1, point2);

    expect(result).toBeTruthy();
  });

  it('#findAlignedSegmentPoint should return'
   + 'mousePosition.x and lastPoint.y', () => {
    const mousePosition = new Point(3, 1);

    const lastpoint = new Point(0, 0);

    const result = service.findAlignedSegmentPoint(mousePosition, lastpoint);

    expect(result).toEqual(new Point(mousePosition.x, lastpoint.y));
  });

  it('#findAlignedSegmentPoint should return lastPoint.x'
  +  'and mousePosition.y', () => {
    const mousePosition = new Point(1, 3);

    const lastpoint = new Point(0, 0);

    const result = service.findAlignedSegmentPoint(mousePosition, lastpoint);

    expect(result).toEqual(new Point(lastpoint.x, mousePosition.y));
  });

  it('#findAlignedSegmentPoint should return mousePosition.x'
   + 'and lastpoint.y + deltaX', () => {
    const mousePosition = new Point(3, 4);

    const lastpoint = new Point(0, 0);

    const result = service.findAlignedSegmentPoint(mousePosition, lastpoint);

    expect(result).toEqual(new Point(mousePosition.x, lastpoint.y + 3));
  });

  it('#findAlignedSegmentPoint should return mousePosition.x'
   + 'and lastpoint.y + deltaX', () => {
    const mousePosition = new Point(-3, 4);

    const lastpoint = new Point(0, 0);

    const result = service.findAlignedSegmentPoint(mousePosition, lastpoint);

    expect(result).toEqual(new Point(mousePosition.x, lastpoint.y - -3));
  });

  it('#getPolygonCornersFromRectangle should call computeAllPolygonPoints', () => {
    const spy = spyOn(service, 'computeAllPolygonPoints');

    service.getPolygonCornersFromRectangle(new Point(0, 0), new Point(10, 10), {width: 10, height: 10}, 4, 0);

    expect(spy).toHaveBeenCalled();
  });

  it('#getPolygonCornersFromRectangle should call computeAllPolygonPoints', () => {
    const spy = spyOn(service, 'computeAllPolygonPoints');

    service.getPolygonCornersFromRectangle(new Point(0, 0), new Point(10, 10), {width: 10, height: 10}, 3, 0);

    expect(spy).toHaveBeenCalled();
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x'
  + 'and initialPoint.y + deltaY', () => {
    const initPoint = new Point(0, 0);

    const oppositePoint = new Point(69, -42);

    const result = service.getRectangleUpLeftCorner(initPoint, oppositePoint);

    expect(result).toEqual(new Point(initPoint.x, initPoint.y + (-42)));
  });

  it('#computePolygonRadius should compute the correct radius for every polygons when the minimun sideLenght is the height'
    , () => {
      const expectedResults = [0, 0, 0, 261.624, 198.62, 218.68000000000004, 199, 208.95000000000002, 198.9,
                              204.32164999999998, 199, 202.67399999999998, 198.99];
      const dimension = {width: 400, height: 200};
      for (let i = 3; i < 13; i++) {
        const sidesCount = i;
        const initialAngle = (sidesCount % 2 === 0) ? (Math.PI) / sidesCount : 0;
        const properties: PolygonProperties = {deltaX: 1.0, deltaY: 1.0,
          sides: sidesCount, angle: initialAngle,
          radius: 0, initialPoint: new Point(0, 0),
          deltaBorderX: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_X,
          deltaBorderY: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_Y,
          constants: CONSTANTS.get(sidesCount as Shape) as ShapeConstants};
        service.computePolygonRadius(dimension, properties);
        expect(properties.radius).toEqual(expectedResults[i]);
      }
  });

  it('#computePolygonRadius should compute the correct radius for every polygon when the maximum sideLenght is the height'
  , () => {
    const expectedResults = [0, 0, 0, 204.92999999999998, 178.62, 187.74, 179, 181.68499999999997, 178.9, 180.7395, 179, 180.487, 178.99];
    const dimension = {width: 180, height: 200};
    for (let i = 3; i < 13; i++) {
      const sidesCount = i;
      const initialAngle = (sidesCount % 2 === 0) ? (Math.PI) / sidesCount : 0;
      const properties: PolygonProperties = {deltaX: 1.0, deltaY: 1.0,
        sides: sidesCount, angle: initialAngle,
        radius: 0, initialPoint: new Point(0, 0),
        deltaBorderX: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_X,
        deltaBorderY: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_Y,
        constants: CONSTANTS.get(sidesCount as Shape) as ShapeConstants};
      service.computePolygonRadius(dimension, properties);
      expect(properties.radius).toEqual(expectedResults[i]);
    }
  });

  it('#computePolygonRadius should compute the correct radius for every polygon when the maximum sideLenght is the height'
  , () => {
    const expectedResults = [0, 0, 0, 204.92999999999998, 178.62, 187.74, 179, 181.68499999999997, 178.9, 180.7395, 179, 180.487, 178.99];
    const dimension = {width: 180, height: 200};
    for (let i = 3; i < 13; i++) {
      const sidesCount = i;
      const initialAngle = (sidesCount % 2 === 0) ? (Math.PI) / sidesCount : 0;
      const properties: PolygonProperties = {deltaX: 1.0, deltaY: 1.0,
        sides: sidesCount, angle: initialAngle,
        radius: 0, initialPoint: new Point(0, 0),
        deltaBorderX: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_X,
        deltaBorderY: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_Y,
        constants: CONSTANTS.get(sidesCount as Shape) as ShapeConstants};
      service.computePolygonRadius(dimension, properties);
      expect(properties.radius).toEqual(expectedResults[i]);
    }
  });

  it('#computePolygonRadius should compute the correct radius for every polygon when the maximum sideLenght is the height' +
     ' and we are in the transition phase', () => {
    const expectedResults = [0, 0, 0, 210.62249999999995, 178.62, 189.6174, 178.98210000000003, 
                            185.31869999999998, 178.9, 180.7395, 179, 180.487, 178.99];
    const dimension = {width: 185, height: 180};
    for (let i = 3; i < 13; i++) {
      const sidesCount = i;
      const initialAngle = (sidesCount % 2 === 0) ? (Math.PI) / sidesCount : 0;
      const properties: PolygonProperties = {deltaX: 1.0, deltaY: 1.0,
        sides: sidesCount, angle: initialAngle,
        radius: 0, initialPoint: new Point(0, 0),
        deltaBorderX: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_X,
        deltaBorderY: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_Y,
        constants: CONSTANTS.get(sidesCount as Shape) as ShapeConstants};
      service.computePolygonRadius(dimension, properties);
      expect(properties.radius).toEqual(expectedResults[i]);
    }
  });

  it('#computeInitialPointPosition should compute the correct initialPoint for every polygon when the' +
  'mouseDownPoint is the highest point of the rectangle', () => {
    const expectedResultsPointX = [0, 0, 0, 747.4019237886466, 750, 748.2366442431226, 750, 748.6983487826474,
                                   750, 748.973939570023, 750, 749.1548023294757, 750];
    const expectedResultsPointY = [0, 0, 0, 205.5, 1819.31, 206.02705098312484, 1819.5, 206.20290660370728, 1819.45,
                                   206.34407786235772, 1819.5, 206.39347892084348, 1819.495];
    const dimension = {width: 180, height: 200};
    const mouseDownPoint = new Point (300, 200);
    const upLeftCorner = new Point (300, 200);
    for (let i = 3; i < 13; i++) {
      const sidesCount = i;
      const initialAngle = (sidesCount % 2 === 0) ? (Math.PI) / sidesCount : 0;
      const properties: PolygonProperties = {deltaX: 5.0, deltaY: 9.0,
        sides: sidesCount, angle: initialAngle,
        radius: 6, initialPoint: new Point(1, 0),
        deltaBorderX: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_X,
        deltaBorderY: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_Y,
        constants: CONSTANTS.get(sidesCount as Shape) as ShapeConstants};
      service.computeInitialPointPosition(dimension, mouseDownPoint, upLeftCorner, properties);
      expect(properties.initialPoint.x).toEqual(expectedResultsPointX[i]);
      expect(properties.initialPoint.y).toEqual(expectedResultsPointY[i]);
    }
  });

  it('#computeInitialPointPosition should compute the correct initialPoint for every polygon when the' +
  'mouseDownPoint is the lowest point of the rectangle', () => {
    const expectedResultsPointX = [0, 0, 0, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410];
    const expectedResultsPointY = [0, 0, 0, 239, 239.31, 239.4, 239.5, 239.5, 239.45, 239.475, 239.5, 239.485, 239.495];
    const dimension = {width: 180, height: 200};
    const upLeftCorner = new Point (300, 200);
    const mouseDownPoint = new Point (500, 240);
    for (let i = 3; i < 13; i++) {
      const sidesCount = i;
      const initialAngle = (sidesCount % 2 === 0) ? (Math.PI) / sidesCount : 0;
      const properties: PolygonProperties = {deltaX: 1.0, deltaY: 1.0,
        sides: sidesCount, angle: initialAngle,
        radius: 0, initialPoint: new Point(0, 0),
        deltaBorderX: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_X,
        deltaBorderY: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_Y,
        constants: CONSTANTS.get(sidesCount as Shape) as ShapeConstants};
      service.computeInitialPointPosition(dimension, mouseDownPoint, upLeftCorner, properties);
      expect(properties.initialPoint.x).toEqual(expectedResultsPointX[i]);
      expect(properties.initialPoint.y).toEqual(expectedResultsPointY[i]);
    }
  });

  it('#computeAllPolygonPoints should compute all the points coords correctly', () => {
    const sidesCount = 5;
    const expectedPoints: Point[] = [new Point(0, 0), new Point(2.3511410091698925, 0), new Point(3.0776835371752536, -2.23606797749979),
                                  new Point(1.1755705045849465, -3.6180339887498953), new Point(-0.7265425280053608, -2.2360679774997907)];
    const initialAngle = (sidesCount % 2 === 0) ? (Math.PI) / sidesCount : 0;
    const properties: PolygonProperties = {deltaX: 1.0, deltaY: 1.0,
      sides: sidesCount, angle: initialAngle,
      radius: 4, initialPoint: new Point(0, 0),
      deltaBorderX: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_X,
      deltaBorderY: (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_Y,
      constants: CONSTANTS.get(sidesCount as Shape) as ShapeConstants};
    const points = service.computeAllPolygonPoints(properties);
    for (let i = 0; i < 5; i++) {
      expect(points[i].x).toEqual(expectedPoints[i].x);
      expect(points[i].y).toEqual(expectedPoints[i].y);
    }
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x + deltaX'
   + 'and initialPoint.y + deltaY', () => {
    const initPoint = new Point(0, 0);
    const oppositePoint = new Point(-69,  -42);
    const result = service.getRectangleUpLeftCorner(initPoint, oppositePoint);
    expect(result).toEqual(new Point(initPoint.x + (-69), initPoint.y + (-42)));
  });

  it('#getRectangleUpLeftCorner should return '
   + 'initialPoint.x +deltaX and initialPoint.y', () => {
    const initPoint = new Point(0, 0);

    const oppositePoint = new Point(-69, 42);

    const result = service.getRectangleUpLeftCorner(initPoint, oppositePoint, 0);

    expect(result).toEqual(new Point(initPoint.x - 69, initPoint.y));
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x'
   + 'and initialPoint.y', () => {
    const initPoint = new Point(0, 0);

    const oppositePoint = new Point(69, 42);

    const result = service.getRectangleUpLeftCorner(initPoint, oppositePoint, 0);

    expect(result).toEqual(new Point(initPoint.x, initPoint.y));
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x'
   + ' and initialPoint.y considering the border (pos oppositePoint)', () => {
    const initPoint = new Point(0, 0);

    const oppositePoint = new Point(69, 42);

    const result = service.getRectangleUpLeftCorner(initPoint, oppositePoint, 20);

    expect(result).toEqual(new Point(10, 10));
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x'
   + ' and initialPoint.y considering the border (neg oppositePoint)', () => {
    const initPoint = new Point(0, 0);

    const oppositePoint = new Point(-69, -42);

    const result = service.getRectangleUpLeftCorner(initPoint, oppositePoint, 20);

    expect(result).toEqual(new Point(-59, -32));
  });

  it('#getRectangleSize should return the width and the height' +
  'of the rectangle(neg param)', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(-69,  -42);

    const result = service.getRectangleSize(initialPoint, oppositePoint);

    expect(result).toEqual({width: 69, height: 42});
  });

  it('#getRectangleSize should return the width and the height minus the border width ' +
  'of the rectangle(neg param)', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(-69,  -42);

    const result = service.getRectangleSize(initialPoint, oppositePoint, 10);

    expect(result).toEqual({width: 59, height: 32});
  });

  it('#getRectangleSize should return 0 in the axis if the border is larger than the dimention ' +
  'of the rectangle(neg param)', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(-69,  -42);

    const result = service.getRectangleSize(initialPoint, oppositePoint, 10);

    expect(result).toEqual({width: 59, height: 32});
  });

  it('#getRectangleSize should return 0 in the axis if the border is larger than the dimention '
    + 'of the rectangle(pos param)', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(69, 42);

    const result = service.getRectangleSize(initialPoint, oppositePoint, 70);

    expect(result).toEqual({width: 0, height: 0});
  });

  it('#getRectangleSize should return 0 in the axis if the border is larger than the dimention'
    + 'of the rectangle(neg param)', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(-69, -42);

    const result = service.getRectangleSize(initialPoint, oppositePoint, 70);

    expect(result).toEqual({width: 0, height: 0});
  });

  it('#transformRectangleToSquare should return initialPoin.x + deltaX'
   + 'and initialPoin.y + deltaY', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(69, 42);

    const result = service.transformRectangleToSquare
                   (initialPoint, oppositePoint);

    expect(result).toEqual(new Point(42, 42));
  });

  it('#transformRectangleToSquare should return initialPoin.x + deltaX'
   + 'and initialPoin.y + deltaY', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(42, 69);

    const result = service.transformRectangleToSquare
                   (initialPoint, oppositePoint);

    expect(result).toEqual(new Point(42, 42));
  });

  it('#getEllipseRadius should return half of the' +
    'getRectangleSize returned values', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(42, 69);

    const dimensions = service.getRectangleSize(initialPoint, oppositePoint);

    expect(
      service.getEllipseRadius(initialPoint, oppositePoint, 0)
    ).toEqual({
        rx: dimensions.width / 2,
        ry: dimensions.height / 2
    });
  });

  it('#getEllipseRadius should return 0 in the axis if the border is larger than the dimention', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(42, 69);

    // const dimensions = service.getRectangleSize(initialPoint, oppositePoint);

    expect(
      service.getEllipseRadius(initialPoint, oppositePoint, 70)
    ).toEqual({
        rx: 0,
        ry: 0
    });
  });

  it('#getEllipseCenter should return the coordinates ' +
    'of the center of the ellipse', () => {
    const initialPoint = new Point(1, 5);

    const oppositePoint = new Point(6, 0);

    expect(
      service.getEllipseCenter(initialPoint, oppositePoint)
    ).toEqual(new Point(3.5, 2.5));
  });

  it('#getCircleCenter should return ' +
    'the center of the circle', () => {
    const initialPoint = new Point(1, 5);

    const oppositePoint = new Point(8, 0);

    const circleCenter = service.getCircleCenter(initialPoint, oppositePoint);
    expect(
      Math.sqrt(
        Math.pow(circleCenter.x, 2) + Math.pow(circleCenter.y, 2)
      ) - Math.sqrt(
        Math.pow(3.034, 2) + Math.pow(3.547, 2)
      )
    ).toBeLessThan(0.001);
  });

// tslint:disable-next-line:max-file-line-count
});
