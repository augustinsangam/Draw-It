import { Point } from '../../tool/shape/common/point';
import { SelectionLogicUtil } from './selection-logic-util';

describe('SelectionLogicUtil', () => {
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

  it('#getRealTarget should consider text as one element', () => {
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    textElement.appendChild(tspan);
    expect(
      SelectionLogicUtil.getRealTarget({target: tspan} as unknown as Event)
    ).toEqual(textElement);
  });

});
