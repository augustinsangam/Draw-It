import { Point } from '../../shape/common/point';
import { SelectionLogicUtil } from './selection-logic-util';

fdescribe('SelectionLogicUtil', () => {
  // Remaining functions tested by the selection
  it('#orderPoint works well', () => {
    const testsCases = [
      [
        [new Point(0, 0), new Point(0, 0)],
        [new Point(0, 0), new Point(0, 0)]
      ],
      [
        [new Point(0, 0), new Point(1, 1)],
        [new Point(0, 0), new Point(1, 1)]
      ],
      [
        [new Point(1, 1), new Point(0, 0)],
        [new Point(0, 0), new Point(1, 1)]
      ],
      [
        [new Point(0, 1), new Point(1, 0)],
        [new Point(0, 0), new Point(1, 1)]
      ]
    ];
    testsCases.forEach((testCase) => {
      expect(SelectionLogicUtil.orderPoint(
        testCase[0][0], testCase[0][1])
      ).toEqual(testCase[1]);
    });
  });

});
