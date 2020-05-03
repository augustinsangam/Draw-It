import { Point } from './point';

// tslint:disable: no-magic-numbers
describe('Point', () => {

  it('#Point can be instanciate', () => {
    const point = new Point(5 , 10);
    expect(point).toBeTruthy();
  });

  it('#Equal should return true only when the two coordinates match', () => {
    const targetPoint = new Point(5 , 10);
    expect(targetPoint).toBeTruthy();
    const testCases: [Point, boolean][] = [
      [new Point(0, 0),   false],
      [new Point(0, 10),  false],
      [new Point(5, 0),   false],
      [new Point(5, 10),  true],
    ];
    testCases.forEach((test) => {
      expect(targetPoint.equals(test[0])).toEqual(test[1]);
    });
  });

  it('#freeze should return a string description of the point '
    + 'in the format `x y`', () => {
      expect(new Point(10, 20).freeze()).toEqual('10 20');
  });

  it('#unfreeze should return a point description of freezed point', () => {
      expect(Point.unfreeze('10 20')).toEqual(new Point(10, 20));
  });

  it('#squareDistanceTo should return the square distance between two point', () => {
    expect(new Point(0, 0).squareDistanceTo(new Point(1, 1))).toEqual(2);
    expect(new Point(0, 0).squareDistanceTo(new Point(-1, 1))).toEqual(2);
    expect(new Point(0, 0).squareDistanceTo(new Point(-1, -1))).toEqual(2);
  });

});
