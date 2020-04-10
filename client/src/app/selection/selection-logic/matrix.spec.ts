import { Matrix } from './matrix';

// tslint:disable: no-magic-numbers no-string-literal
describe('Matrix', () => {

  it('#should create', () => {
    expect(new Matrix(1, 1)).toBeTruthy();
  });

  it('#contructor should return identity matrix when data is not provided', () => {
    const matrix = new Matrix(2, 3);
    expect(matrix['rows']).toEqual(2);
    expect(matrix['columns']).toEqual(3);
    expect(matrix['data']).toEqual(
        [[1, 0, 0],
         [0, 1, 0]]
    );
  });

  it('#multiply works', () => {
      const matrix1 = new Matrix(3, 2, [[2, 2], [2, 2], [2, 2]]);

      const matrix2 = new Matrix(2, 3, [[2, 2, 2], [2, 2, 2]]);

      const expectedMatrix = new Matrix(3, 3, [[8, 8, 8], [8, 8, 8], [8, 8, 8]]);

      expect(matrix1.multiply(matrix2)).toEqual(expectedMatrix);
  });

});
