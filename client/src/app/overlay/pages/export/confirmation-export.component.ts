import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ExportType } from './export-type';
import { ExportHeader } from './export.component';

@Component({
  templateUrl: 'confirmation-export.component.html'
})
export class ConfirmationExportComponent {

  protected ExportType: typeof ExportType = ExportType;

  constructor(@Inject(MAT_DIALOG_DATA) protected data: ExportHeader,
              @Optional() protected dialogRef: MatDialogRef<ConfirmationExportComponent>) {

  }

}
