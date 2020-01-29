import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { EventManager } from '@angular/platform-browser';
import { ColorService, RGBColor } from '../../color.service';
import { ColorPicklerItemComponent } from '../color-pickler-item/color-pickler-item.component';


@Component({
  selector: 'app-color-pickler-content',
  templateUrl: './color-pickler-content.component.html',
  styleUrls: ['./color-pickler-content.component.scss']
})
export class ColorPicklerContentComponent implements AfterViewInit {

  @Input() startColor: string;

  @Output() colorChange = new EventEmitter();

  baseColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                '#FFFF00', '#FF00FF', '#00FFFF', '#FF6600', '#FF6699'];

  @ViewChild('canvas', {
    read: ElementRef,
    static: false
  }) canvas: ElementRef;

  @ViewChild('actualColor', {
    read: ColorPicklerItemComponent,
    static: false
  }) actualColor: ColorPicklerItemComponent;

  @ViewChildren(ColorPicklerItemComponent)
  baseColorsCircles: QueryList<ColorPicklerItemComponent>;

  context: CanvasRenderingContext2D;

  colorForm: FormGroup;

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
      r: ['', [Validators.required, ColorPicklerContentComponent.ValidatorInteger]],
      g: ['', [Validators.required, ColorPicklerContentComponent.ValidatorInteger]],
      b: ['', [Validators.required, ColorPicklerContentComponent.ValidatorInteger]],
      a: ['', [Validators.required, ColorPicklerContentComponent.ValidatorInteger]],
      slider: [''],
      hex: ['', [Validators.required, ColorPicklerContentComponent.ValidatorHex]]
    });
  }

  ngAfterViewInit() {

    this.initialiseStartingColor();

    this.baseColorsCircles.toArray().slice(0, this.baseColors.length)
    .forEach((circle: ColorPicklerItemComponent) => {
      this.eventManager.addEventListener(circle.button.nativeElement, 'click', () => {
        this.startColor = circle.color;
        this.initialiseStartingColor();
      })
    });

  }

  initialiseStartingColor() {
    this.context = this.canvas.nativeElement.getContext('2d');

    const startColor = this.colorService.hexToRgb(this.startColor);

    // TODO : Remove Timeout
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

      const blue = $event.x - this.canvas.nativeElement.offsetLeft;
      const green = $event.y - this.canvas.nativeElement.offsetTop;
      this.colorForm.patchValue({
        b: blue,
        g: green
      });

      this.drawTracker(blue, green);
      this.updateHex();
    });
  }

  buildCanvas(redValue: number) {

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

  onSlide($event: MatSliderChange) {
    this.buildCanvas(Number($event.value));
    this.colorForm.patchValue({ r: Number($event.value) });
    this.drawTracker(this.colorForm.controls.b.value, this.colorForm.controls.g.value);
    this.updateHex();
  }

  placeSlider(value: number) {
    this.colorForm.patchValue({ slider: value });
    this.buildCanvas(value);
  }

  onChangeR($event: Event) {
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

  onChangeG($event: Event) {
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

  onChangeB($event: Event) {
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

  onChangeA($event: Event) {
    if (this.colorForm.controls.a.value < 0) {
      this.colorForm.patchValue({ a: 0 });
      return;
    } else if (this.colorForm.controls.a.value > 100) {
      this.colorForm.patchValue({ a: 100 });
      return;
    }
    this.actualColor.updateColor(this.getActualRgba());
  }

  onChangeHex($event: Event) {
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

  drawTracker(blue: number, green: number) {
    this.context.beginPath();
    this.context.arc(blue, green, 7, 0, 2 * Math.PI);
    this.context.stroke();
    this.actualColor.updateColor(this.getActualRgba());
  }

  reDrawTracker() {
    this.buildCanvas(this.colorForm.controls.r.value);
    this.drawTracker(this.colorForm.controls.b.value, this.colorForm.controls.g.value);
  }

  updateHex() {
    const hexValue = this.colorService.rgbToHex({
      r : this.colorForm.controls.r.value,
      g : this.colorForm.controls.g.value,
      b : this.colorForm.controls.b.value,
    });
    this.colorForm.patchValue({ hex: hexValue });
  }

  getActualRgba() {
    return `rgba(${this.colorForm.controls.r.value}, ${this.colorForm.controls.g.value},
      ${this.colorForm.controls.b.value}, ${this.colorForm.controls.a.value / 100})`
  }

  onConfirm() {
    this.colorChange.emit(this.getActualRgba());
  }

}
