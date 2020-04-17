import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BucketService {

  private static readonly DEFAULT_TOLERANCE: number = 0;
  tolerance: number;

  constructor() {
    this.tolerance = BucketService.DEFAULT_TOLERANCE;
  }

}
