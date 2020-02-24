import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import {
  ColorPickerContentComponent,
// tslint:disable-next-line: max-line-length
} from '../../../tool/color/color-picker-content/color-picker-content.component';
import { ColorService } from '../../../tool/color/color.service';

@Component({
  selector: 'app-palette-dialog',
  styleUrls: [
    './palette-dialog.component.css'
  ],
  templateUrl: './palette-dialog.component.html',
})
export class PaletteDialogComponent {
  @ViewChild('palette', {
    static: false,
  })
  private palette: ColorPickerContentComponent;

  constructor(
    private colorService: ColorService,
    public dialogRef: MatDialogRef<PaletteDialogComponent>,
  ) {}

  onPickColor($color: string) {
    this.dialogRef.close(this.colorService.hexFormRgba($color));
  }

  @HostListener('document:keydown.enter', ['$event'])
  protected onKeydownHandler(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.palette.onConfirm();
  }

}
