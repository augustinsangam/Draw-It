import { Point } from './point';

// TODO : Ask the chargé de lab
// tslint:disable: no-magic-numbers
describe('Point', () => {

  it('#Point can be instanciate', () => {
    const point = new Point(5 , 10);
    expect(point).toBeTruthy();
  });

  it('Equals works well', () => {
    const targetPoint = new Point(5 , 10);
    expect(targetPoint).toBeTruthy();
    const testCases: [Point, boolean][] = [
      [new Point(0, 0),   false],
      [new Point(0, 10),  false],
      [new Point(5, 0),   false],
      [new Point(5, 10),  true],
    ]
    testCases.forEach((test) => {
      expect(targetPoint.equals(test[0])).toEqual(test[1]);
    });
  });

});
