import { Injectable } from '@angular/core';
import { RGBAColor } from '../color/rgba-color';

@Injectable({
  providedIn: 'root'
})
export class BucketService {

  private static readonly DEFAULT_TOLERANCE: number = 0;
  // tslint:disable-next-line: no-magic-numbers
  private static readonly MAX_DIFFERENCE: number = (255 * 255) * 4;
  private static readonly MAX_TOLERANCE: number = 100;
  private static readonly EXPONENT: number = 3;
  tolerance: number;

  constructor() {
    this.tolerance = BucketService.DEFAULT_TOLERANCE;
  }

  getRelativeTolerance(): number {
    return Math.pow(
      this.tolerance / BucketService.MAX_TOLERANCE,
      BucketService.EXPONENT
    );
  }

  isSameColor(color1: RGBAColor, color2: RGBAColor): boolean {
    const differenceNormalized = this.difference(color1, color2) / BucketService.MAX_DIFFERENCE;
    return differenceNormalized  <= this.getRelativeTolerance();
  }

  private difference(color1: RGBAColor, color2: RGBAColor): number {
    return Math.pow(color1.r - color2.r, 2)
         + Math.pow(color1.g - color2.g, 2)
         + Math.pow(color1.b - color2.b, 2)
         + Math.pow(color1.a - color2.a, 2);
  }

}
