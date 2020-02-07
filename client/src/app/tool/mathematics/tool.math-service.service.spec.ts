import { TestBed } from '@angular/core/testing';

import { Point } from '../tool-common classes/Point';
import { MathService } from './tool.math-service.service';

// tslint:disable: no-string-literal
describe('MathService', () => {
  let service: MathService;

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.get(MathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#distanceIsLessThan3Pixel should return true if distance is 0', () => {
    const point1: Point = {
      x: 42,
      y: 42,
    }

    const point2 = point1;

    const result = service['distanceIsLessThan3Pixel'](point1, point2);

    expect(result).toBeTruthy();
  });

  it('#distanceIsLessThan3Pixel should return true if distance is 0', () => {
    const point1: Point = {
      x: 42,
      y: 42,
    }

    const point2: Point = {
      x: 40,
      y: 40,
    }

    const result = service['distanceIsLessThan3Pixel'](point1, point2);

    expect(result).toBeTruthy();
  });

  it('#distanceIsLessThan3Pixel should return true if distance is 3', () => {
    const point1: Point = {
      x: 42,
      y: 42,
    }

    const point2: Point = {
      x: 39,
      y: 39,
    }

    const result = service['distanceIsLessThan3Pixel'](point1, point2);

    expect(result).toBeTruthy();
  });

  it('#distanceIsLessThan3Pixel should return false if distance is more than 3', () => {
    const point1: Point = {
      x: 42,
      y: 42,
    }

    const point2: Point = {
      x: 69,
      y: 69,
    }

    const result = service['distanceIsLessThan3Pixel'](point1, point2);

    expect(result).toBeFalsy();
  });

  it('#distanceIsLessThan3Pixel should return true if distance less than 3(with negatives)', () => {
    const point1: Point = {
      x: -1,
      y: -1,
    }

    const point2: Point = {
      x: 1,
      y: 1,
    }

    const result = service['distanceIsLessThan3Pixel'](point1, point2);

    expect(result).toBeTruthy();
  });

  it('#findAlignedSegmentPoint should return mousePosition.x and lastPoint.y', () => {
    const mousePosition: Point = {
      x: 3,
      y: 1,
    }

    const lastpoint: Point = {
      x: 0,
      y: 0,
    }

    const result = service['findAlignedSegmentPoint'](mousePosition, lastpoint);

    expect(result).toEqual({x: mousePosition.x, y: lastpoint.y});
  });

  it('#findAlignedSegmentPoint should return lastPoint.x and mousePosition.y', () => {
    const mousePosition: Point = {
      x: 1,
      y: 3,
    }

    const lastpoint: Point = {
      x: 0,
      y: 0,
    }

    const result = service['findAlignedSegmentPoint'](mousePosition, lastpoint);

    expect(result).toEqual({x: lastpoint.x, y: mousePosition.y});
  });

  it('#findAlignedSegmentPoint should return mousePosition.x and lastpoint.y + deltaX', () => {
    const mousePosition: Point = {
      x: 3,
      y: 4,
    }

    const lastpoint: Point = {
      x: 0,
      y: 0,
    }

    const result = service['findAlignedSegmentPoint'](mousePosition, lastpoint);

    expect(result).toEqual({x: mousePosition.x, y: lastpoint.y + 3});
  });

  it('#findAlignedSegmentPoint should return mousePosition.x and lastpoint.y + deltaX', () => {
    const mousePosition: Point = {
      x: -3,
      y: 4,
    }

    const lastpoint: Point = {
      x: 0,
      y: 0,
    }

    const result = service['findAlignedSegmentPoint'](mousePosition, lastpoint);

    expect(result).toEqual({x: mousePosition.x, y: lastpoint.y - -3});
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x and initialPoint.y + deltaY', () => {
    const initialPoint: Point = {
      x: 0,
      y: 0,
    }

    const oppositePoint: Point = {
      x: 69,
      y: -42,
    }

    const result = service['getRectangleUpLeftCorner'](initialPoint, oppositePoint);

    expect(result).toEqual({x: initialPoint.x, y: initialPoint.y + (-42)});
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x + deltaX and initialPoint.y + deltaY', () => {
    const initialPoint: Point = {
      x: 0,
      y: 0,
    }

    const oppositePoint: Point = {
      x: -69,
      y: -42,
    }

    const result = service['getRectangleUpLeftCorner'](initialPoint, oppositePoint);

    expect(result).toEqual({x: initialPoint.x + (-69), y: initialPoint.y + (-42)});
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x +deltaX and initialPoint.y', () => {
    const initialPoint: Point = {
      x: 0,
      y: 0,
    }

    const oppositePoint: Point = {
      x: -69,
      y: 42,
    }

    const result = service['getRectangleUpLeftCorner'](initialPoint, oppositePoint);

    expect(result).toEqual({x: initialPoint.x + (-69), y: initialPoint.y});
  });

  it('#getRectangleUpLeftCorner should return initialPoint.x and initialPoint.y', () => {
    const initialPoint: Point = {
      x: 0,
      y: 0,
    }

    const oppositePoint: Point = {
      x: 69,
      y: 42,
    }

    const result = service['getRectangleUpLeftCorner'](initialPoint, oppositePoint);

    expect(result).toEqual({x: initialPoint.x, y: initialPoint.y});
  });

  it('#getRectangleSize should return the width and the height of the rectangle(neg param)', () => {
    const initialPoint: Point = {
      x: 0,
      y: 0,
    }

    const oppositePoint: Point = {
      x: -69,
      y: -42,
    }

    const result = service['getRectangleSize'](initialPoint, oppositePoint);

    expect(result).toEqual({width: 69, height: 42});
  });

  it('#getRectangleSize should return the width and the height of the rectangle(pos param)', () => {
    const initialPoint: Point = {
      x: 0,
      y: 0,
    }

    const oppositePoint: Point = {
      x: 69,
      y: 42,
    }

    const result = service['getRectangleSize'](initialPoint, oppositePoint);

    expect(result).toEqual({width: 69, height: 42});
  });

  it('#transformRectangleToSquare should return initialPoin.x + deltaX and initialPoin.y + deltaY', () => {
    const initialPoint: Point = {
      x: 0,
      y: 0,
    }

    const oppositePoint: Point = {
      x: 69,
      y: 42,
    }

    const result = service['transformRectangleToSquare'](initialPoint, oppositePoint);

    expect(result).toEqual({x: 42, y: 42});
  });
  it('#transformRectangleToSquare should return initialPoin.x + deltaX and initialPoin.y + deltaY', () => {
    const initialPoint: Point = {
      x: 0,
      y: 0,
    }

    const oppositePoint: Point = {
      x: 42,
      y: 69,
    }

    const result = service['transformRectangleToSquare'](initialPoint, oppositePoint);

    expect(result).toEqual({x: 42, y: 42});
  });
});
