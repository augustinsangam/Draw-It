import { Injectable } from '@angular/core';

const DEFAULT_SIZE = 10;

@Injectable({
  providedIn: 'root'
})
export class EraserService {

  size: number;

  constructor() {
    this.size = DEFAULT_SIZE;
  }

}
