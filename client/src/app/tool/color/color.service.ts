import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RGBColor } from './rgb-color';
import { RGBAColor } from './rgba-color';

const HEXADECIMAL_BASE = 16;

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  recentColors: string[];
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  change: Subject<null>;

  constructor() {
    this.recentColors = [
      'rgba(230, 25, 75, 1)',
      'rgba(255, 225, 25, 1)',
      'rgba(245, 130, 49, 1)',
      'rgba(70, 240, 240, 1)',
      'rgba(240, 50, 230, 1)',
      'rgba(250, 190, 190, 1)',
      'rgba(0, 128, 128, 1)',
      'rgba(154, 99, 36, 1)',
      'rgba(255, 250, 200, 1)',
      'rgba(128, 0, 0, 1)'
    ];

    this.primaryColor = 'rgba(230, 25, 75, 1)';
    this.secondaryColor = 'rgba(240, 50, 230, 1)';
    this.backgroundColor = 'rgba(255, 255, 255, 1)';
    this.change = new Subject<null>();
  }

  promote(index: number): void {
    const colorToPromote = this.recentColors[index];
    this.recentColors.splice(index, 1);
    this.recentColors.unshift(colorToPromote);
  }

  pushColor(color: string): void {
    const rgbToMatch = this.rgbFormRgba(color);
    for (let i = 0; i < this.recentColors.length; ++i) {
      if (this.rgbEqual(rgbToMatch, this.rgbFormRgba(this.recentColors[i]))) {
        this.promote(i);
        this.change.next();
        return;
      }
    }
    this.recentColors.unshift(color);
    this.recentColors.pop();
    this.change.next();
  }

  selectPrimaryColor(color: string): void {
    this.primaryColor = color;
    this.pushColor(color);
  }

  selectSecondaryColor(color: string): void {
    this.secondaryColor = color;
    this.pushColor(color);
  }

  selectBackgroundColor(color: string): void {
    this.backgroundColor = color;
    this.pushColor(color);
  }

  hexToRgb(hex: string): RGBColor {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1], HEXADECIMAL_BASE),
        g: parseInt(result[2], HEXADECIMAL_BASE),
        b: parseInt(result[1 + 2], HEXADECIMAL_BASE)
      };
    }
    return {
      r: -1,
      g: -1,
      b: -1
    };
  }

  rgbToHex(rgb: RGBColor): string {
    const valueToHex = (value: number) => {
      const hex = value.toString(HEXADECIMAL_BASE);
      return hex.length === 1 ? `0${hex}` : hex;
    };
    return (
      valueToHex(rgb.r) +
      valueToHex(rgb.g) +
      valueToHex(rgb.b)
    ).toUpperCase();
  }

  rgbFormRgba(rgba: string): RGBColor {
    const result = rgba.match(
      /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/i
    );
    if (result) {
      return {
        r: Number(result[1]),
        g: Number(result[2]),
        // tslint:disable-next-line: no-magic-numbers
        b: Number(result[3])
      };
    }
    return {
      r: -1,
      g: -1,
      b: -1
    };
  }

  hexFormRgba(rgba: string): string {
    return `#${this.rgbToHex(this.rgbFormRgba(rgba))}`;
  }

  rgbaFromString(rgba: string): RGBAColor {
    const result = rgba.match(
      /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/i
    );
    if (result) {
      return {
        r: Number(result[1]),
        g: Number(result[2]),
        // tslint:disable-next-line: no-magic-numbers
        b: Number(result[3]),
        // tslint:disable-next-line: no-magic-numbers
        a: Number(result[4])
      };
    }
    return {
      r: -1,
      g: -1,
      b: -1,
      a: -1
    };
  }

  private rgbEqual(rgb1: RGBColor, rgb2: RGBColor): boolean {
    return rgb1.r === rgb2.r && rgb1.g === rgb2.g && rgb1.b === rgb2.b;
  }

}
