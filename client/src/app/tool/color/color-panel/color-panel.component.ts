import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { EventManager } from '@angular/platform-browser';

import { Subscription } from 'rxjs';
import { SvgService } from 'src/app/svg/svg.service';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';
import { ColorService } from '../color.service';
import {
  ColorPickerContentComponent
} from './color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from './color-picker-item/color-picker-item.component';

export enum ColorOption {
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY',
  Background = 'BACKGROUND'
}

@Component({
  selector: 'app-color-panel',
  templateUrl: './color-panel.component.html',
  styleUrls: ['./color-panel.component.scss']
})
export class ColorPanelComponent extends ToolPanelDirective
  implements OnInit, AfterViewInit, OnDestroy {

  protected colorOptionEnum: typeof ColorOption = ColorOption;

  private colorOption: ColorOption;
  private recentColors: string[];
  private showPalette: boolean;
  private colorChange: Subscription;

  @ViewChild('colorPreviewPrimary', {
    read: ColorPickerItemComponent,
    static: false
  })
  private colorPreviewPrimary: ColorPickerItemComponent;

  @ViewChild('colorPreviewSecondary', {
    read: ColorPickerItemComponent,
    static: false
  })
  private colorPreviewSecondary: ColorPickerItemComponent;

  @ViewChild('colorPreviewBackground', {
    read: ColorPickerItemComponent,
    static: false
  })
  private colorPreviewBackground: ColorPickerItemComponent;

  @ViewChildren(ColorPickerItemComponent)
  private colorsItems: QueryList<ColorPickerItemComponent>;

  @ViewChild('colorPalette', {
    static: false,
    read: ColorPickerContentComponent
  })
  private colorPalette: ColorPickerContentComponent;

  protected colorsItemsArray: ColorPickerItemComponent[];

  constructor(
    elementRef: ElementRef<HTMLElement>,
    public colorService: ColorService,
    public eventManager: EventManager,
    public svgService: SvgService
  ) {
    super(elementRef);
    this.colorOption = ColorOption.Primary;
    this.showPalette = false;

    this.colorChange = this.colorService.change.subscribe(() => {
      this.ngOnInit();
      this.ngAfterViewInit();
    });
  }

  ngOnInit(): void {
    this.recentColors = this.colorService.recentColors;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updatePreviewColors();
    this.colorsItemsArray = this.colorsItems.toArray().slice(3);

    this.addEvents();
    this.updateRecentColors();
  }

  private addEvents(): void {
    for (let i = 0; i < this.recentColors.length; i++) {
      this.eventManager.addEventListener(
        this.colorsItemsArray[i].button.nativeElement,
        'click',
        () => {
          this.colorPreviewPrimary.updateColor(this.colorsItemsArray[i].color);
          this.colorService.primaryColor = this.colorsItemsArray[i].color;
          if (this.colorPalette) {
            this.colorPalette.startColor = this.colorService.hexFormRgba(
              this.colorsItemsArray[i].color
            );
            this.colorPalette.initialiseStartingColor();
          }
          this.colorService.promote(i);
          this.updateRecentColors();
        }
      );
      this.eventManager.addEventListener(
        this.colorsItemsArray[i].button.nativeElement,
        'contextmenu',
        ($event: MouseEvent) => {
          $event.preventDefault();
          this.colorPreviewSecondary.updateColor(
            this.colorsItemsArray[i].color
          );
          this.colorService.secondaryColor = this.colorsItemsArray[i].color;
          if (this.colorPalette) {
            this.colorPalette.startColor = this.colorService.hexFormRgba(
              this.colorsItemsArray[i].color
            );
            this.colorPalette.initialiseStartingColor();
          }
          this.colorService.promote(i);
          this.updateRecentColors();
        }
      );
    }
  }

  private updateRecentColors(): void {
    for (let i = 0; i < this.recentColors.length; i++) {
      this.colorsItemsArray[i].color = this.colorService.recentColors[i];
      this.colorsItemsArray[i].updateColor(this.colorService.recentColors[i]);
    }
  }

  protected swapColors(): void {
    [this.colorService.primaryColor, this.colorService.secondaryColor] = [
      this.colorService.secondaryColor,
      this.colorService.primaryColor
    ];
    this.updatePreviewColors();
  }

  protected onColorPicked(data: string): void {
    if (this.colorOption === ColorOption.Primary) {
      this.colorPreviewPrimary.updateColor(data);
      this.colorService.selectPrimaryColor(data);
    } else if (this.colorOption === ColorOption.Secondary) {
      this.colorPreviewSecondary.updateColor(data);
      this.colorService.selectSecondaryColor(data);
    } else {
      this.colorPreviewBackground.updateColor(data);
      this.colorService.selectBackgroundColor(data);
      this.svgService.changeBackgroundColor(data);
    }
    this.updateRecentColors();
    this.showPalette = false;
  }

  private updatePreviewColors(): void {
    this.colorPreviewPrimary.updateColor(this.colorService.primaryColor);
    this.colorPreviewSecondary.updateColor(this.colorService.secondaryColor);
    this.colorPreviewBackground.updateColor(this.colorService.backgroundColor);
  }

  protected onShowPalette(): void {
    this.showPalette = !this.showPalette;
  }

  protected getStartColor(): string {
    if (this.colorOption === ColorOption.Primary) {
      return this.colorService.hexFormRgba(this.colorService.primaryColor);
    }
    if (this.colorOption === ColorOption.Secondary) {
      return this.colorService.hexFormRgba(this.colorService.secondaryColor);
    }
    return this.colorService.hexFormRgba(this.colorService.backgroundColor);
  }

  ngOnDestroy(): void {
    this.colorChange.unsubscribe();
  }

}
