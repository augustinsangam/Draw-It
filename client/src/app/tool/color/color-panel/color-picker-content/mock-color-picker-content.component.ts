import {
  Component, ElementRef, EventEmitter, Input, Output, QueryList
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import {
  ColorPickerItemComponent
} from '../color-picker-item/color-picker-item.component';

@Component({
  selector: 'app-color-picker-content',
  template: '',
})
export class MockColorPickerContentComponent {

  @Input()
  startColor: string;

  @Output()
  colorChange: EventEmitter<string>;

  baseColors: string[];

  canvas: ElementRef;

  actualColor: ColorPickerItemComponent;

  baseColorsCircles: QueryList<ColorPickerItemComponent>;

  context: CanvasRenderingContext2D;

  colorForm: FormGroup;

  static ValidatorHex(formControl: AbstractControl): null | { valid: boolean } {
    return null;
  }

  static ValidatorInteger(formControl: AbstractControl): null | { valid: boolean } {
    return null;
  }

  constructor() {
    this.colorChange = new EventEmitter();
    this.baseColors = [];
  }

  initialiseStartingColor(): void { }

  buildCanvas(redValue: number): void { }

  onSlide($event: MatSliderChange): void { }

  placeSlider(value: number): void { }

  onChangeR($event: Event): void { }

  onChangeG($event: Event): void { }

  onChangeB($event: Event): void { }

  onChangeA($event: Event): void { }

  onChangeHex($event: Event): void { }

  drawTracker(blue: number, green: number): void { }

  reDrawTracker(): void { }

  updateHex(): void { }

  getActualRgba(): void { }

  onConfirm(): void { }

}
