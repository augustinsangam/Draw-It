import { Point } from '../../shape/common/point';
import { PointSet } from './point-set';

// tslint:disable no-magic-numbers
describe('PointSet', () => {

  let pointSet: PointSet;

  beforeEach(() => {
    pointSet = new PointSet();
  });

  it('should create an instance', () => {
    expect(pointSet).toBeTruthy();
  });

  it('#has should return true if the element had been added', () => {
    pointSet.add(new Point(1, 1));
    expect(pointSet.has(new Point(1, 1))).toBeTruthy();
    expect(pointSet.has(new Point(1, 2))).toBeFalsy();
    const points = [
      new Point(0, 0),
      new Point(1, 1),
      new Point(0, 1),
      new Point(1, 0),
    ];
    points.forEach((point) => pointSet.add(point));
    points.forEach((point) => expect(pointSet.has(point)).toBeTruthy());
  });

  it('#delete can remove a present element', () => {
    pointSet.add(new Point(1, 1));
    expect(pointSet.size()).toEqual(1);
    pointSet.delete(new Point(1, 1));
    expect(pointSet.has(new Point(1, 1))).toBeFalsy();
    expect(pointSet.size()).toEqual(0);

    const points = [
      new Point(0, 0),
      new Point(1, 1),
      new Point(0, 1),
      new Point(1, 0),
    ];
    points.forEach((point) => pointSet.add(point));
    expect(pointSet.size()).toEqual(4);
    points.forEach((point) => pointSet.delete(point));
    points.forEach((point) => expect(pointSet.has(point)).toBeFalsy());
    expect(pointSet.size()).toEqual(0);
  });

  it('#randomPoint should return null where there is no point', () => {
    expect(pointSet.randomPoint()).toEqual(null);
  });

  it('#randomPoint should return a random point from the set', () => {
    const points = [
      new Point(0, 0),
      new Point(1, 1),
      new Point(0, 1),
      new Point(1, 0),
    ];
    points.forEach((point) => pointSet.add(point));
    const randomPoint = pointSet.randomPoint();
    expect(randomPoint).not.toEqual(null);
    expect(pointSet.has(randomPoint as Point)).toBeTruthy();
  });

  it('#nearestPoint should return infinity distance when the set is empty', () => {
    expect(pointSet.nearestPoint(new Point(0, 0))[1]).toEqual(Number.MAX_SAFE_INTEGER);
  });

  it('#nearestPoint should return the nearest point', () => {
    const points = [
      new Point(0, 0),
      new Point(1, 1),
      new Point(0, 1),
      new Point(1, 0),
    ];
    points.forEach((point) => pointSet.add(point));
    expect(pointSet.nearestPoint(new Point(2, 2))).toEqual([new Point(1, 1), 2]);
  });

});
