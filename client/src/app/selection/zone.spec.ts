import { Point } from '../tool/shape/common/point';
import { Zone } from './zone';

// tslint:disable: no-magic-numbers
describe('Zone', () => {
  let instance: Zone;
  beforeEach(() => {
    instance = new Zone(5, 10, 5, 10);
  });

  it('#should be created', () => {
    expect(instance).toBeTruthy();
  });

  it('#intercept works well !', () => {
    let intersection = instance.intersection(new Zone(0, 4, 0, 4));
    expect(intersection[0]).toBe(false);

    intersection = instance.intersection(new Zone(0, 5, 0, 4));
    expect(intersection[0]).toBe(false);

    intersection = instance.intersection(new Zone(0, 6, 0, 6));
    expect(intersection[0]).toBe(true);
    expect(intersection[1]).toEqual(new Zone(5, 6, 5, 6));

    intersection = instance.intersection(new Zone(6, 9, 6, 9));
    expect(intersection[0]).toBe(true);
    expect(intersection[1]).toEqual(new Zone(6, 9, 6, 9));
  });

  it('#union works well !', () => {
    let union = instance.union(new Zone(0, 4, 0, 4));
    expect(union).toEqual(new Zone(0, 10, 0, 10));

    union = instance.union(new Zone(0, 5, 0, 4));
    expect(union).toEqual(new Zone(0, 10, 0, 10));

    union = instance.union(new Zone(11, 20, 11, 30));
    expect(union).toEqual(new Zone(5, 20, 5, 30));
  });

  it('#getPoints woks well !', () => {
    expect(instance.getPoints()).toEqual([new Point(5, 5), new Point(10, 10)]);
  });

});
