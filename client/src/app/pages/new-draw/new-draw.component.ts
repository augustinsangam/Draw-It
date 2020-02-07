import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Optional, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { ColorPicklerItemComponent } from 'src/app/tool/color/color-panel/color-pickler-item/color-pickler-item.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { PaletteDialogComponent } from './palette-dialog.component';
import { ScreenService, ScreenSize } from './sreen-service/screen.service';

export interface DialogData {
  drawInProgress: boolean;
}

export interface DialogRefs {
  palette: MatDialogRef<PaletteDialogComponent>,
  confirm: MatDialogRef<ConfirmationDialogComponent>,
};

@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss']
})
export class NewDrawComponent implements OnInit, AfterViewInit, OnDestroy {

  private startColor = '#FFFFFF';
  private form: FormGroup;
  private maxWidth: number;
  private maxHeight: number;
  private screenSize: Subscription;
  private userChangeSizeMannually = false;
  private dialogRefs: DialogRefs;

  @ViewChild('palette', {
    static: false,
    read: ColorPicklerItemComponent
  }) palette: ColorPicklerItemComponent;

  @ViewChild('button', {
    static: false,
    read: ElementRef
  }) button: ElementRef;

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
              private renderer: Renderer2,
              private dialog: MatDialog,
              @Optional() public dialogRef: MatDialogRef<NewDrawComponent>,
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
    this.dialogRefs = {
      palette: undefined as unknown as MatDialogRef<PaletteDialogComponent>,
      confirm: undefined as unknown as MatDialogRef<ConfirmationDialogComponent>,
    };
  }

  ngOnInit() {
    const screenSize = this.screenService.getCurrentSize();
    this.updateFormSize(screenSize);
    this.screenSize = this.screenService.size.subscribe(
        screenSizeParam => this.updateFormSize(screenSizeParam));
  }

  ngOnDestroy() {
    this.screenSize.unsubscribe();
  }

  ngAfterViewInit() {
    // FIX : AFTERCONTENTCHECKEDERROR
    setTimeout(() => {
      this.form.patchValue({color: this.startColor});
    }, 0);

    this.renderer.listen(this.palette.button.nativeElement, 'click', () => {
      this.dialogRefs.palette = this.dialog.open(PaletteDialogComponent);
      this.dialogRefs.palette.afterClosed().subscribe((colorPicked: string|undefined) => {
        this.closePaletteDialog(colorPicked);
      });
    });
  }

  private closePaletteDialog(colorPicked: string | undefined) {
    if (colorPicked !== undefined) {
      this.palette.updateColor(colorPicked);
      this.form.patchValue({color: colorPicked});
    }
    this.button.nativeElement.focus();
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

  onDimensionsChangedByUser() {
    this.userChangeSizeMannually = true;
  }

  onSubmit() {
    if (this.data.drawInProgress) {
      this.dialogRefs.confirm = this.dialog.open(ConfirmationDialogComponent);
      this.dialogRefs.confirm.disableClose = true;
      this.dialogRefs.confirm.afterClosed().subscribe((result: boolean) => {
        // if (result) {
        //   this.dialogRef.close(this.form.value);
        // } else {
        //   this.dialogRef.close('home');
        // }
        this.closeDialog(result);
      });
    } else {
      this.dialogRef.close(this.form.value);
    }
  }

  private closeDialog(result: boolean) {
    if (result) {
      this.dialogRef.close(this.form.value);
    } else {
      this.dialogRef.close('home');
    }
  }

  onReturn() {
    this.dialogRef.close('home');
  }

}
