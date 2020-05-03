import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {
  ColorPickerContentComponent
} from 'src/app/tool/color/color-panel/color-picker-content/color-picker-content.component';
import { ColorService } from 'src/app/tool/color/color.service';

@Component({
  templateUrl: 'palette-dialog.component.html'
})
export class PaletteDialogComponent {

  @ViewChild('palette', { static: false})
  private palette: ColorPickerContentComponent;

  constructor(public dialogRef: MatDialogRef<PaletteDialogComponent>,
              private colorService: ColorService) { }

  onPickColor($color: string): void {
    this.dialogRef.close(this.colorService.hexFormRgba($color));
  }

  @HostListener('document:keydown.enter', ['$event'])
  protected onKeydownHandler(event: KeyboardEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.palette.onConfirm();
  }

}
