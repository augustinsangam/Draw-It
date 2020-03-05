import { TestBed } from '@angular/core/testing';
import { Point } from '../shape/common/point';
import { MathService } from './tool.math-service.service';

// TODO : Ask the chargé de lab
// tslint:disable: no-magic-numbers

describe('MathService', () => {
  let service: MathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(MathService);
  });

  it('should be created', () => {
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

  it('#getRectangleUpLeftCorner should return initialPoint.x'
  + 'and initialPoint.y + deltaY', () => {
    const initPoint = new Point(0, 0);

    const oppositePoint = new Point(69, -42);

    const result = service.getRectangleUpLeftCorner(initPoint, oppositePoint);

    expect(result).toEqual(new Point(initPoint.x, initPoint.y + (-42)));
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x + deltaX'
   + 'and initialPoint.y + deltaY', () => {
    const initPoint = new Point(0, 0);

    const oppositePoint = new Point(-69,  -42);

    const result = service.getRectangleUpLeftCorner(initPoint, oppositePoint);

    expect(result).toEqual(new Point(initPoint.x + (-69),initPoint.y + (-42)));
  });

  it('#getRectangleUpLeftCorner should return '
   + 'initialPoint.x +deltaX and initialPoint.y', () => {
    const initPoint = new Point(0, 0);

    const oppositePoint = new Point(-69, 42);

    const result = service.getRectangleUpLeftCorner(initPoint, oppositePoint);

    expect(result).toEqual(new Point(initPoint.x - 69, initPoint.y));
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x'
   + 'and initialPoint.y', () => {
    const initPoint = new Point(0, 0);

    const oppositePoint = new Point(69, 42);

    const result = service.getRectangleUpLeftCorner(initPoint, oppositePoint);

    expect(result).toEqual(new Point(initPoint.x, initPoint.y));
  });

  it('#getRectangleSize should return the width and the height' +
  'of the rectangle(neg param)', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(-69,  -42);

    const result = service.getRectangleSize(initialPoint, oppositePoint);

    expect(result).toEqual({width: 69, height: 42});
  });

  it('#getRectangleSize should return the width and the height'
    + 'of the rectangle(pos param)', () => {
    const initialPoint = new Point(0, 0);

    const oppositePoint = new Point(69, 42);

    const result = service.getRectangleSize(initialPoint, oppositePoint);

    expect(result).toEqual({width: 69, height: 42});
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

  // TODO : Fix the test
  // it('#getEllipseRadius should return half of the' +
  //   'getRectangleSize returned values', () => {
  //   const initialPoint = new Point(0, 0);

  //   const oppositePoint = new Point(42, 69);

  //   const dimensions = service.getRectangleSize(initialPoint, oppositePoint);

  //   expect(
  //     service.getEllipseRadius(initialPoint, oppositePoint)
  //   ).toEqual({
  //       rx: dimensions.width / 2,
  //       ry: dimensions.height / 2
  //   });
  // });

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

});
