
export class Matrix {

  data: number[][];

  constructor(private rows: number, private columns: number, data?: number[][]) {
    this.data = !!data ? data : this.identity(rows, columns);
  }

  private identity(rows: number, columns: number): number[][] {
    const data = new Array<number[]>(rows);
    for (let row = 0; row < rows; row++) {
      data[row] = new Array(columns);
    }
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        data[row][column] = row === column ? 1 : 0;
      }
    }
    return data;
  }

  multiply(matrix: Matrix): Matrix {
    const result = new Matrix(this.rows, matrix.columns);
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < matrix.columns; column++) {
        result.data[row][column] = 0;
        for (let i = 0; i < this.columns; i++) {
          result.data[row][column] += this.data[row][i] * matrix.data[i][column];
        }
      }
    }
    return result;
  }

}
