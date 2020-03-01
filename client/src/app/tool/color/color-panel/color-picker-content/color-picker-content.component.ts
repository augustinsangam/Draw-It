import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { EventManager } from '@angular/platform-browser';
import {
  ShortcutHandlerService
} from 'src/app/shortcut-handler/shortcut-handler.service';
import { ColorService, RGBColor } from '../../color.service';
import {
  ColorPickerItemComponent
} from '../color-picker-item/color-picker-item.component';

const CONSTANTS = {
  RGB_MAX : 255,
  RGB_MIN : 0,
  ALPHA_MIN : 0,
  ALPHA_MAX : 100,
  COLOR_WIDTH : 8,
  TRAKER_WIDTH : 7
};

@Component({
  selector: 'app-color-picker-content',
  templateUrl: './color-picker-content.component.html',
  styleUrls: ['./color-picker-content.component.scss']
})
export class ColorPickerContentComponent implements AfterViewInit {
  @Input() startColor: string;

  @Output() colorChange: EventEmitter<string>;

  private baseColors: string[];

  @ViewChild('canvas', {
    read: ElementRef,
    static: false
  })
  private canvas: ElementRef;

  @ViewChild('actualColor', {
    read: ColorPickerItemComponent,
    static: false
  })
  private actualColor: ColorPickerItemComponent;

  @ViewChildren(ColorPickerItemComponent)
  private baseColorsCircles: QueryList<ColorPickerItemComponent>;

  @ViewChild('rField', { static: false }) private rField: ElementRef;
  @ViewChild('gField', { static: false }) private gField: ElementRef;
  @ViewChild('bField', { static: false }) private bField: ElementRef;
  @ViewChild('aField', { static: false }) private aField: ElementRef;
  @ViewChild('hexField', { static: false }) private hexField: ElementRef;

  private context: CanvasRenderingContext2D;
  private colorForm: FormGroup;

  private focusHandlers: {
    in: () => void,
    out: () => void
  };

  static ValidatorHex(formControl: AbstractControl): null | {valid: boolean} {
    return (/^[0-9A-F]{6}$/i.test(formControl.value)) ? null : {
      valid: true,
    };
  }

  static ValidatorInteger(formControl: AbstractControl): null | {valid: boolean} {
    return (Number.isInteger(formControl.value)) ? null : {
      valid: true,
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private eventManager: EventManager,
    private colorService: ColorService,
    private shortcutHandler: ShortcutHandlerService
  ) {
    this.colorForm = this.formBuilder.group({
      r: [
        '',
        [Validators.required, ColorPickerContentComponent.ValidatorInteger]
      ],
      g: [
        '',
        [Validators.required, ColorPickerContentComponent.ValidatorInteger]
      ],
      b: [
        '',
        [Validators.required, ColorPickerContentComponent.ValidatorInteger]
      ],
      a: [
        '',
        [Validators.required, ColorPickerContentComponent.ValidatorInteger]
      ],
      slider: [''],
      hex: ['', [Validators.required, ColorPickerContentComponent.ValidatorHex]]
    });
    this.baseColors = [
      '#000000',
      '#FFFFFF',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
      '#FF00FF',
      '#00FFFF',
      '#FF6600',
      '#FF6699'
    ];
    this.colorChange = new EventEmitter();
    this.focusHandlers = {
      in : () => {
        this.shortcutHandler.push();
        this.shortcutHandler.desactivateAll();
      },
      out : () => this.shortcutHandler.pop()
    };
  }

  ngAfterViewInit(): void {
    this.initialiseStartingColor();

    this.baseColorsCircles
      .toArray()
      .slice(0, this.baseColors.length)
      .forEach((circle: ColorPickerItemComponent) => {
        this.eventManager.addEventListener(
          circle.button.nativeElement,
          'click',
          () => {
            this.startColor = circle.color;
            this.initialiseStartingColor();
          }
        );
      });

    [this.rField, this.gField, this.bField, this.aField, this.hexField]
    .forEach((field: ElementRef) => {
      this.eventManager.addEventListener(field.nativeElement, 'focus',
        this.focusHandlers.in);
      this.eventManager.addEventListener(field.nativeElement, 'focusout',
        this.focusHandlers.out);
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

    this.eventManager.addEventListener(
      this.canvas.nativeElement,
      'click',
      ($event: MouseEvent) => {
        this.buildCanvas(this.colorForm.controls.r.value);

        const boundingClient =
          this.canvas.nativeElement.getBoundingClientRect();
        const blue = Math.round($event.clientX - boundingClient.left);
        const green = Math.round($event.clientY - boundingClient.top);

        this.colorForm.patchValue({
          b: blue,
          g: green
        });

        this.drawTracker(blue, green);
        this.updateHex();
      }
    );
  }

  private buildCanvas(redValue: number): void {
    const rgbMax = CONSTANTS.RGB_MAX;
    const allPixels = this.context.createImageData(rgbMax + 1, rgbMax + 1);
    let i = 0;
    for (let g = 0; g <= rgbMax; ++g) {
      for (let b = 0; b <= rgbMax; ++b) {
        allPixels.data[i] = redValue;
        allPixels.data[i + 1] = g;
        allPixels.data[i + 2] = b;
        // TODO : Ask the chargé de lab
        allPixels.data[i + 2 + 2] = rgbMax; // Alpha stay the max value.
        i += 2 + 2;
      }
    }
    this.context.putImageData(allPixels, 0, 0);
  }

  protected onSlide($event: MatSliderChange): void {
    this.buildCanvas(Number($event.value));
    this.colorForm.patchValue({ r: Number($event.value) });
    this.drawTracker(
      this.colorForm.controls.b.value,
      this.colorForm.controls.g.value
    );
    this.updateHex();
  }

  private placeSlider(value: number): void {
    this.colorForm.patchValue({ slider: value });
    this.buildCanvas(value);
  }

  private checkValidity(name: string, min: number, max: number): void {
    if (this.colorForm.controls[name].value < min ||
        this.colorForm.controls[name].value == null ) {
      (this.colorForm.get(name) as AbstractControl).patchValue( min );
    } else if (this.colorForm.controls[name].value > max) {
      (this.colorForm.get(name) as AbstractControl).patchValue( max );
    }
  }

  protected onChangeR(): void {
    this.checkValidity('r', CONSTANTS.RGB_MIN, CONSTANTS.RGB_MAX);
    this.placeSlider(this.colorForm.controls.r.value);
    this.reDrawTracker();
    this.updateHex();
  }

  protected onChangeG(): void {
    this.checkValidity('g', CONSTANTS.RGB_MIN, CONSTANTS.RGB_MAX);
    this.reDrawTracker();
    this.updateHex();
  }

  protected onChangeB(): void {
    this.checkValidity('b', CONSTANTS.RGB_MIN, CONSTANTS.RGB_MAX);
    this.reDrawTracker(); // On aurait pu combiner ces deux actions
    this.updateHex();     // pour en faire une fonction. Mais ce ne
                          // serait pas intutif de comprendre le code.
  }

  protected onChangeA(): void {
    this.checkValidity('a', CONSTANTS.ALPHA_MIN, CONSTANTS.ALPHA_MAX);
    this.actualColor.updateColor(this.getActualRgba());
  }

  protected onChangeHex(): void {
    if (/^[0-9A-F]{6}$/i.test(this.colorForm.controls.hex.value)) {
      const rgb: RGBColor = this.colorService.hexToRgb(
        this.colorForm.controls.hex.value
      );
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
    this.context.arc(blue, green, CONSTANTS.TRAKER_WIDTH, 0, 2 * Math.PI);
    this.context.stroke();
    this.actualColor.updateColor(this.getActualRgba());
  }

  private reDrawTracker(): void {
    this.buildCanvas(this.colorForm.controls.r.value);
    this.drawTracker(
      this.colorForm.controls.b.value,
      this.colorForm.controls.g.value
    );
  }

  private updateHex(): void {
    const hexValue = this.colorService.rgbToHex({
      r: this.colorForm.controls.r.value,
      g: this.colorForm.controls.g.value,
      b: this.colorForm.controls.b.value
    });
    this.colorForm.patchValue({ hex: hexValue });
  }

  private getActualRgba(): string {
    return (
      `rgba(${this.colorForm.controls.r.value}, ` +
      `${this.colorForm.controls.g.value}, ` +
      `${this.colorForm.controls.b.value}, ` +
      `${this.colorForm.controls.a.value / CONSTANTS.ALPHA_MAX})`
    );
  }

  onConfirm(): void {
    this.colorChange.emit(this.getActualRgba());
  }
}
