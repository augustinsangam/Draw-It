import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EraserService {

  size: number;

  constructor() {
    this.size = 10;
  }

}
