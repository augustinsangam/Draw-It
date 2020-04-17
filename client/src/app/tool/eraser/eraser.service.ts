import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EraserService {

  private static readonly DEFAULT_SIZE: number = 10;
  size: number;

  constructor() {
    this.size = EraserService.DEFAULT_SIZE;
  }

}
