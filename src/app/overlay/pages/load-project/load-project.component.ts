import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ImageFile } from 'src/app/image-file';
import { DialogData } from '../home/home.component';
import { ConfirmationDialogComponent } from '../new-draw/confirmation-dialog.component';

@Component({
  selector: 'app-load-project',
  templateUrl: './load-project.component.html',
  styleUrls: ['./load-project.component.scss']
})
export class LoadProjectComponent {

  protected onDrag: boolean;
  protected fileSelected: boolean;
  protected fileValid: boolean;
  protected readOnProgress: boolean;
  protected imageFile: ImageFile;
  protected allListeners: (() => void)[];

  constructor(@Optional() protected dialogRef: MatDialogRef<LoadProjectComponent>,
              private matDialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data: DialogData) {
    this.onDrag = false;
    this.fileSelected = false;
    this.fileValid = false;
    this.readOnProgress = false;
    // TODO : Initialise imageFile later
    this.allListeners = [];
  }

  getFileName(fileInput: HTMLInputElement): string {
    return (fileInput.files === null || fileInput.files[0] === undefined) ?
      'Sélectionner un fichier' : fileInput.files[0].name;
  }

  onChange(input: HTMLInputElement): void {
    const fileSelected = input.files !== null && input.files[0] !== undefined;
    if (!fileSelected) {
      this.fileSelected = false;
      return ;
    }
    this.fileSelected = true;
    let dataString: string;
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = (e.target as FileReader).result;
      dataString = (typeof contents === 'string') ? contents as string : '';
      try {
        this.imageFile = JSON.parse(dataString);
        this.fileValid = true;
      } catch (error) {
        this.fileValid = false;
      }
      this.readOnProgress = false;
    };
    this.readOnProgress = true;
    reader.readAsText((input.files as FileList)[0]);
  }

  onLoad(): void {
    if (!this.data.drawInProgress) {
      this.dialogRef.close(this.imageFile);
      return;
    }
    const confirmDialog = this.matDialog.open(ConfirmationDialogComponent);
    confirmDialog.disableClose = true;
    confirmDialog.afterClosed().subscribe((result: boolean) => {
      this.dialogRef.close(result ? this.imageFile : undefined);
    });

  }

}
