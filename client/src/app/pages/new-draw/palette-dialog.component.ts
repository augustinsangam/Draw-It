import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ColorService } from 'src/app/tool/color/color.service';

@Component({
  templateUrl: 'palette-dialog.component.html'
})
export class PaletteDialogComponent {

  constructor(public dialogRef: MatDialogRef<PaletteDialogComponent>,
              private colorService: ColorService) { }

  onPickColor($event: string) {
    this.dialogRef.close(`#${this.colorService.rgbToHex(this.colorService.rgbFormRgba($event))}`);
  }

}
