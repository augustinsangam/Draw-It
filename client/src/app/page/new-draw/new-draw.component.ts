import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import {
  ColorPickerItemComponent,
} from '../../tool/color/color-picker-item/color-picker-item.component';
import {
  ConfirmationDialogComponent,
} from './confirmation-dialog/confirmation-dialog.component';
import {
  PaletteDialogComponent,
} from './palette-dialog/palette-dialog.component';
import {
  ScreenSize,
  ScreenSizeService,
} from './screen-size/screen-size.service';

interface DialogData {
  drawInProgress: boolean;
}

interface DialogRefs {
  palette: MatDialogRef<PaletteDialogComponent>;
  confirm: MatDialogRef<ConfirmationDialogComponent>;
}

@Component({
  selector: 'app-new-draw',
  styleUrls: [
    './new-draw.component.css',
  ],
  templateUrl: './new-draw.component.html',
})
export class NewDrawComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('palette', {
    read: ColorPickerItemComponent,
    static: false,
  })
  private palette: ColorPickerItemComponent;

  @ViewChild('button', {
    read: ElementRef,
    static: false,
  })
  private button: ElementRef;

  private startColor: string;
  // Must be public
  form: FormGroup;
  // Must be public
  maxHeight: number;
  // Must be public
  maxWidth: number;
  private screenSize: Subscription;
  private userChangeSizeMannually = false;
  private dialogRefs: DialogRefs;

  static validatorInteger(formControl: AbstractControl) {
    if (Number.isInteger(formControl.value)) {
      return null;
    }
    return {
      valid: true,
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private screenService: ScreenSizeService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<NewDrawComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.startColor = '#FFFFFF';
    const screenSize = this.screenService.getCurrentSize();
    this.maxWidth = screenSize.width;
    this.maxHeight = screenSize.height;
    this.form = this.formBuilder.group({
      width: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(1000000),
          NewDrawComponent.validatorInteger
        ]
      ],
      height: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(1000000),
          NewDrawComponent.validatorInteger
        ]
      ],
      color: ['', []]
    });
    this.dialogRefs = {
      palette: (undefined as unknown) as MatDialogRef<PaletteDialogComponent>,
      confirm: (undefined as unknown) as MatDialogRef<
        ConfirmationDialogComponent
      >
    };
  }

  ngAfterViewInit() {
    // Simuler l'asynchronisité
    setTimeout(() => {
      this.form.patchValue({ color: this.startColor });
    }, 0);

    if (!!this.palette) {
      this.renderer.listen(this.palette.button.nativeElement, 'click', () => {
        this.dialogRefs.palette = this.dialog.open(PaletteDialogComponent);
        this.dialogRefs.palette
          .afterClosed()
          .subscribe(this.paletteCloseHandler);
      });
    }
  }

  ngOnDestroy() {
    this.screenSize.unsubscribe();
  }

  ngOnInit() {
    const screenSize = this.screenService.getCurrentSize();
    this.updateFormSize(screenSize);
    this.screenSize = this.screenService.size.subscribe(
      (screenSizeParam) => this.updateFormSize(screenSizeParam));
  }

  private paletteCloseHandler = (colorPicked: string | undefined): void => {
    this.closePaletteDialog(colorPicked);
  }

  private closePaletteDialog(colorPicked: string | undefined): void {
    if (colorPicked !== undefined) {
      this.palette.updateColor(colorPicked);
      this.form.patchValue({ color: colorPicked });
    }
    this.button.nativeElement.focus();
  }

  private updateFormSize(screenSize: ScreenSize): void {
    this.maxWidth = screenSize.width;
    this.maxHeight = screenSize.height;
    if (!this.userChangeSizeMannually) {
      this.form.patchValue({
        width: this.maxWidth,
        height: this.maxHeight
      });
    }
  }

  // Must be public
  onDimensionsChangedByUser(): void {
    this.userChangeSizeMannually = true;
  }

  // Must be public
  onSubmit(): void  {
    if (this.data.drawInProgress) {
      this.dialogRefs.confirm = this.dialog.open(ConfirmationDialogComponent);
      this.dialogRefs.confirm.disableClose = true;
      this.dialogRefs.confirm.afterClosed().subscribe(this.onSubmitHandler);
    } else {
      this.dialogRef.close(this.form.value);
    }
  }

  private onSubmitHandler = (result: boolean): void => {
    this.closeDialog(result);
  }

  private closeDialog(result: boolean): void {
    if (result) {
      this.dialogRef.close(this.form.value);
    } else {
      this.dialogRef.close();
    }
  }

  // Must be public
  onReturn(): void {
    this.dialogRef.close();
  }
}
