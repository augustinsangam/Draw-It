import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { EventManager } from '@angular/platform-browser';
import { ColorService, RGBColor } from '../../color.service';
import { ColorPickerItemComponent } from '../color-picker-item/color-picker-item.component';

@Component({
  selector: 'app-color-picker-content',
  templateUrl: './color-picker-content.component.html',
  styleUrls: ['./color-picker-content.component.scss']
})
export class ColorPickerContentComponent implements AfterViewInit {

  @Input() startColor: string;

  @Output() colorChange = new EventEmitter();

  private baseColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                '#FFFF00', '#FF00FF', '#00FFFF', '#FF6600', '#FF6699'];

  @ViewChild('canvas', {
    read: ElementRef,
    static: false
  }) private canvas: ElementRef;

  @ViewChild('actualColor', {
    read: ColorPickerItemComponent,
    static: false
  }) private actualColor: ColorPickerItemComponent;

  @ViewChildren(ColorPickerItemComponent)
  private baseColorsCircles: QueryList<ColorPickerItemComponent>;

  private context: CanvasRenderingContext2D;

  private colorForm: FormGroup;

  static ValidatorHex(formControl: AbstractControl) {
    if (/^[0-9A-F]{6}$/i.test(formControl.value)) {
      return null;
    }
    return {
      valid: true,
    }
  }

  static ValidatorInteger(formControl: AbstractControl) {
    if (Number.isInteger(formControl.value)) {
      return null;
    }
    return {
      valid: true,
    }
  }

  constructor(private formBuilder: FormBuilder, private eventManager: EventManager, private colorService: ColorService) {
    this.colorForm = this.formBuilder.group({
      r: ['', [Validators.required, ColorPickerContentComponent.ValidatorInteger]],
      g: ['', [Validators.required, ColorPickerContentComponent.ValidatorInteger]],
      b: ['', [Validators.required, ColorPickerContentComponent.ValidatorInteger]],
      a: ['', [Validators.required, ColorPickerContentComponent.ValidatorInteger]],
      slider: [''],
      hex: ['', [Validators.required, ColorPickerContentComponent.ValidatorHex]]
    });
  }

  ngAfterViewInit() {

    this.initialiseStartingColor();

    this.baseColorsCircles.toArray().slice(0, this.baseColors.length)
    .forEach((circle: ColorPickerItemComponent) => {
      this.eventManager.addEventListener(circle.button.nativeElement, 'click', () => {
        this.startColor = circle.color;
        this.initialiseStartingColor();
      })
    });

  }

  initialiseStartingColor(): void {
    this.context = this.canvas.nativeElement.getContext('2d');

    const startColor = this.colorService.hexToRgb(this.startColor);

    setTimeout(() => {
      this.colorForm.patchValue({ r: startColor.r });
      this.buildCanvas(startColor.r);
    }, 0);

    setTimeout(() => {
      this.placeSlider(startColor.r);
    }, 0);

    setTimeout(() => {
      this.colorForm.patchValue({
        b: startColor.b,
        g: startColor.g,
        a: 100,
        hex: this.startColor.substring(1, 7)
      });
      this.drawTracker(startColor.b, startColor.g);
    }, 0);

    this.eventManager.addEventListener(this.canvas.nativeElement, 'click', ($event: MouseEvent) => {
      this.buildCanvas(this.colorForm.controls.r.value);

      const boundingClient = this.canvas.nativeElement.getBoundingClientRect();
      const blue = Math.round($event.clientX - boundingClient.left);
      const green = Math.round($event.clientY - boundingClient.top);

      this.colorForm.patchValue({
        b: blue,
        g: green
      });

      this.drawTracker(blue, green);
      this.updateHex();
    });
  }

  private buildCanvas(redValue: number): void {

    const allPixels = this.context.createImageData(256, 256);
    let i = 0;
    for (let g = 0; g < 256; ++g) {
      for (let b = 0; b < 256; ++b) {
        allPixels.data[i] = redValue;
        allPixels.data[i + 1] = g;
        allPixels.data[i + 2] = b;
        allPixels.data[i + 3] = 255;  // Alpha stay the max value.
        i += 4;
      }
    }
    this.context.putImageData(allPixels, 0, 0);
  }

  protected onSlide($event: MatSliderChange): void {
    this.buildCanvas(Number($event.value));
    this.colorForm.patchValue({ r: Number($event.value) });
    this.drawTracker(this.colorForm.controls.b.value, this.colorForm.controls.g.value);
    this.updateHex();
  }

  private placeSlider(value: number): void {
    this.colorForm.patchValue({ slider: value });
    this.buildCanvas(value);
  }

  protected onChangeR(): void {
    if (this.colorForm.controls.r.value < 0) {
      this.colorForm.patchValue({ r: 0 });
      return;
    } else if (this.colorForm.controls.r.value > 255) {
      this.colorForm.patchValue({ r: 255 });
      return;
    }
    this.placeSlider(this.colorForm.controls.r.value);
    this.reDrawTracker();
    this.updateHex();
  }

  protected onChangeG(): void {
    if (this.colorForm.controls.g.value < 0) {
      this.colorForm.patchValue({ g: 0 });
      return;
    } else if (this.colorForm.controls.g.value > 255) {
      this.colorForm.patchValue({ g: 255 });
      return;
    }
    this.reDrawTracker();
    this.updateHex();
  }

  protected onChangeB(): void {
    if (this.colorForm.controls.b.value < 0) {
      this.colorForm.patchValue({ b: 0 });
      return;
    } else if (this.colorForm.controls.b.value > 255) {
      this.colorForm.patchValue({ b: 255 });
      return;
    }
    this.reDrawTracker();
    this.updateHex();
  }

  protected onChangeA(): void {
    if (this.colorForm.controls.a.value < 0) {
      this.colorForm.patchValue({ a: 0 });
      return;
    } else if (this.colorForm.controls.a.value > 100) {
      this.colorForm.patchValue({ a: 100 });
      return;
    }
    this.actualColor.updateColor(this.getActualRgba());
  }

  protected onChangeHex(): void {
    if (/^[0-9A-F]{6}$/i.test(this.colorForm.controls.hex.value)) {
      const rgb: RGBColor = this.colorService.hexToRgb(this.colorForm.controls.hex.value);
      this.colorForm.patchValue({
        r: rgb.r,
        g: rgb.g,
        b: rgb.b
      });
    }
    this.placeSlider(this.colorForm.controls.r.value);
    this.reDrawTracker();
  }

  private drawTracker(blue: number, green: number): void {
    this.context.beginPath();
    this.context.arc(blue, green, 7, 0, 2 * Math.PI);
    this.context.stroke();
    this.actualColor.updateColor(this.getActualRgba());
  }

  private reDrawTracker(): void {
    this.buildCanvas(this.colorForm.controls.r.value);
    this.drawTracker(this.colorForm.controls.b.value, this.colorForm.controls.g.value);
  }

  private updateHex(): void {
    const hexValue = this.colorService.rgbToHex({
      r : this.colorForm.controls.r.value,
      g : this.colorForm.controls.g.value,
      b : this.colorForm.controls.b.value,
    });
    this.colorForm.patchValue({ hex: hexValue });
  }

  private getActualRgba(): string {
    return `rgba(${this.colorForm.controls.r.value}, ` +
    `${this.colorForm.controls.g.value}, ` +
    `${this.colorForm.controls.b.value}, ` +
    `${this.colorForm.controls.a.value / 100})`;
  }

  protected onConfirm(): void {
    this.colorChange.emit(this.getActualRgba());
  }

}
