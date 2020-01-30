import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild,
  ViewChildren } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { ColorService } from '../color.service';
import { ColorPicklerItemComponent } from './color-pickler-item/color-pickler-item.component';

@Component({
  selector: 'app-color-panel',
  templateUrl: './color-panel.component.html',
  styleUrls: ['./color-panel.component.scss']
})
export class ColorPanelComponent extends ToolPanelComponent implements OnInit, AfterViewInit {

  constructor(elementRef: ElementRef<HTMLElement>,
              private colorService: ColorService,
              private eventManager: EventManager) {
    super(elementRef);
  }

  colorOption = 'PRIMARY';
  recentColors: string[];
  showPolatte = false;

  @ViewChild('colorPreviewPrimary', {
    read : ColorPicklerItemComponent,
    static : false
  }) colorPreviewPrimary: ColorPicklerItemComponent;

  @ViewChild('colorPreviewSecondary', {
    read : ColorPicklerItemComponent,
    static : false
  }) colorPreviewSecondary: ColorPicklerItemComponent;

  @ViewChildren(ColorPicklerItemComponent)
  colorsItems: QueryList<ColorPicklerItemComponent>;

  colorsItemsArray: ColorPicklerItemComponent[];

  ngOnInit() {
    this.recentColors = this.colorService.recentColors;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.updatePreviewColors();
    this.colorsItemsArray = this.colorsItems.toArray().slice(2);

    this.addEvents();
    // Ajouter les couleurs au cercle
    this.updateRecentColors();
  }

  addEvents() {
    for (let i = 0; i < this.recentColors.length; i++) {
      this.eventManager.addEventListener(this.colorsItemsArray[i].button.nativeElement, 'click', ($event: MouseEvent) => {
        this.colorPreviewPrimary.updateColor(this.colorsItemsArray[i].color);
        this.colorService.primaryColor = this.colorsItemsArray[i].color;
        this.colorService.promote(i);
        // Ajouter les couleurs au cercle
        this.updateRecentColors();
      });
      this.eventManager.addEventListener(this.colorsItemsArray[i].button.nativeElement, 'contextmenu', ($event: MouseEvent) => {
        $event.preventDefault();
        this.colorPreviewSecondary.updateColor(this.colorsItemsArray[i].color);
        this.colorService.secondaryColor = this.colorsItemsArray[i].color;
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
    if (this.colorOption === 'PRIMARY') {
      this.colorPreviewPrimary.updateColor(data);
      this.colorService.selectPrimaryColor(data);
    } else {
      this.colorPreviewSecondary.updateColor(data);
      this.colorService.selectSecondaryColor(data);
    }
    // Reafficher
    this.updateRecentColors();
    this.showPolatte = false;
  }

  updatePreviewColors() {
    this.colorPreviewPrimary.updateColor(this.colorService.primaryColor);
    this.colorPreviewSecondary.updateColor(this.colorService.secondaryColor);
  }

  onShowPalette() {
    this.showPolatte = !this.showPolatte ;
  }

}
