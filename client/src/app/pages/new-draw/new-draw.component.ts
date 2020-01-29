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
  baseColors = [
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF',
  ];
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
