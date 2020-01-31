import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { ScreenService, ScreenSize } from '../../services/sreen/screen.service';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

export interface DialogData {
  drawInProgress: boolean;
}

@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss']
})
export class NewDrawComponent implements OnInit, AfterViewInit, OnDestroy {

  startColor = '#FFFFFF';
  baseColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FF6600', '#FF6699'];
  form: FormGroup;
  maxWidth: number;
  maxHeight: number;
  screenSize: Subscription;
  userChangeSizeMannually = false;

  static validatorInteger(formControl: AbstractControl) {
    if (Number.isInteger(formControl.value)) {
      return null;
    }
    return {
      valid: true,
    }
  }

  constructor(private formBuilder: FormBuilder,
              private screenService: ScreenService,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<NewDrawComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    const screenSize: ScreenSize = this.screenService.getCurrentSize();
    this.maxWidth = screenSize.width;
    this.maxHeight = screenSize.height;
    this.form = this.formBuilder.group({
      width: ['', [
        Validators.required,
        Validators.min(1),
        NewDrawComponent.validatorInteger]],
        height: ['', [
          Validators.required,
          Validators.min(1),
          NewDrawComponent.validatorInteger]],
          color: ['', []]
    });
  }

  ngOnInit() {
    const screenSize = this.screenService.getCurrentSize();
    this.updateFormSize(screenSize);

    this.screenSize = this.screenService.getSize().subscribe(
        screenSizeParam => this.updateFormSize(screenSizeParam));
  }

  ngOnDestroy() {
    this.screenSize.unsubscribe();
  }

  ngAfterViewInit() {
    // Pour eviter une erreur spécifique.
    // On laisse le temps à la vue de s'initialiser
    // FIXME: Erreur de chargement
    setTimeout(() => {
      this.form.patchValue({color: this.startColor});
    }, 0);
  }

  updateFormSize(screenSize: ScreenSize) {
    this.maxWidth = screenSize.width;
    this.maxHeight = screenSize.height;
    if (!this.userChangeSizeMannually) {
      this.form.patchValue({
        width: this.maxWidth,
        height: this.maxHeight,
      });
    }
  }

  onDimensionsChangedByUser($event: Event) {
    this.userChangeSizeMannually = true;
  }

  onSubmit() {
    if (this.data.drawInProgress) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.dialogRef.close(this.form.value);
        } else {
          this.dialogRef.close('home');
        }
      });
    } else {
      this.dialogRef.close(this.form.value);
    }
  }

  onReturn() {
    this.dialogRef.close('home');
  }
}
