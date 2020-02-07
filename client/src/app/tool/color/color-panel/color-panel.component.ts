import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild,
  ViewChildren } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

import { SvgService } from 'src/app/svg/svg.service';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';
import { ColorService } from '../color.service';
import { ColorPickerContentComponent } from './color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from './color-picker-item/color-picker-item.component';

export enum ColorOption {
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY',
  Background = 'BACKGROUND'
};

@Component({
  selector: 'app-color-panel',
  templateUrl: './color-panel.component.html',
  styleUrls: ['./color-panel.component.scss']
})
export class ColorPanelComponent extends ToolPanelDirective implements OnInit, AfterViewInit {

  constructor(elementRef: ElementRef<HTMLElement>,
              public colorService: ColorService,
              public eventManager: EventManager,
              public svgService: SvgService) {
    super(elementRef);
  }

  colorOptionEnum: typeof ColorOption = ColorOption;

  colorOption = ColorOption.Primary;
  recentColors: string[];
  showPalette = false;

  @ViewChild('colorPreviewPrimary', {
    read : ColorPickerItemComponent,
    static : false
  }) colorPreviewPrimary: ColorPickerItemComponent;

  @ViewChild('colorPreviewSecondary', {
    read : ColorPickerItemComponent,
    static : false
  }) colorPreviewSecondary: ColorPickerItemComponent;

  @ViewChild('colorPreviewBackground', {
    read : ColorPickerItemComponent,
    static : false
  }) colorPreviewBackground: ColorPickerItemComponent;

  @ViewChildren(ColorPickerItemComponent)
  colorsItems: QueryList<ColorPickerItemComponent>;

  @ViewChild('colorPalette', {
    static: false,
    read: ColorPickerContentComponent
  }) colorPalette: ColorPickerContentComponent;

  colorsItemsArray: ColorPickerItemComponent[];

  ngOnInit() {
    this.recentColors = this.colorService.recentColors;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.updatePreviewColors();
    this.colorsItemsArray = this.colorsItems.toArray().slice(3);

    this.addEvents();
    // Ajouter les couleurs au cercle
    this.updateRecentColors();
  }

  addEvents() {
    for (let i = 0; i < this.recentColors.length; i++) {
      this.eventManager.addEventListener(this.colorsItemsArray[i].button.nativeElement, 'click', ($event: MouseEvent) => {
        this.colorPreviewPrimary.updateColor(this.colorsItemsArray[i].color);
        this.colorService.primaryColor = this.colorsItemsArray[i].color;
        if (this.colorPalette) {
          this.colorPalette.startColor = this.colorService.hexFormRgba(this.colorsItemsArray[i].color);
          this.colorPalette.initialiseStartingColor();
        }
        this.colorService.promote(i);
        // Ajouter les couleurs au cercle
        this.updateRecentColors();
      });
      this.eventManager.addEventListener(this.colorsItemsArray[i].button.nativeElement, 'contextmenu', ($event: MouseEvent) => {
        $event.preventDefault();
        this.colorPreviewSecondary.updateColor(this.colorsItemsArray[i].color);
        this.colorService.secondaryColor = this.colorsItemsArray[i].color;
        if (this.colorPalette) {
          this.colorPalette.startColor = this.colorService.hexFormRgba(this.colorsItemsArray[i].color);
          this.colorPalette.initialiseStartingColor();
        }
        this.colorService.promote(i);
        // Ajouter les couleurs au cercle
        this.updateRecentColors();
      });
    }
  }

  updateRecentColors() {
    for (let i = 0; i < this.recentColors.length; i++) {
      this.colorsItemsArray[i].color = this.colorService.recentColors[i];
      this.colorsItemsArray[i].updateColor(this.colorService.recentColors[i]);
    }
  }

  swapColors() {
    [this.colorService.primaryColor, this.colorService.secondaryColor] =
      [this.colorService.secondaryColor, this.colorService.primaryColor];
    this.updatePreviewColors();
  }

  onColorPicked(data: string) {
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

  updatePreviewColors() {
    this.colorPreviewPrimary.updateColor(this.colorService.primaryColor);
    this.colorPreviewSecondary.updateColor(this.colorService.secondaryColor);
    this.colorPreviewBackground.updateColor(this.colorService.backgroundColor);
  }

  onShowPalette() {
    this.showPalette = !this.showPalette ;
  }

  getStartColor() {
    if (this.colorOption === ColorOption.Primary) {
      return this.colorService.hexFormRgba(this.colorService.primaryColor);
    } else if (this.colorOption === ColorOption.Secondary) {
      return this.colorService.hexFormRgba(this.colorService.secondaryColor);
    } else {
      return this.colorService.hexFormRgba(this.colorService.backgroundColor);
    }
  }

}
