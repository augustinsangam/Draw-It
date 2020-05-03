import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { OverlayPages } from 'src/app/overlay/overlay-pages';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { PaletteDialogComponent } from './palette-dialog.component';
import { ScreenService, ScreenSize } from './sreen-service/screen.service';

export interface DialogData {
  drawInProgress: boolean;
}

export interface DialogRefs {
  palette: MatDialogRef<PaletteDialogComponent>;
  confirm: MatDialogRef<ConfirmationDialogComponent>;
}

@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss']
})
export class NewDrawComponent implements OnInit, AfterViewInit, OnDestroy {

  private static readonly START_COLOR: string = '#FFFFFF';
  private static readonly MIN_DIMENSION: number = 1;
  private static readonly MAX_DIMENSION: number = 65535;

  private startColor: string;
  private form: FormGroup;
  private maxWidth: number;
  private maxHeight: number;
  private screenSize: Subscription;
  private userChangeSizeMannually: boolean;
  private dialogRefs: DialogRefs;

  @ViewChild('palette', {
    static: false,
  }) private palette: ElementRef<HTMLElement>;

  @ViewChild('button', {
    static: false,
    read: ElementRef
  }) private button: ElementRef;

  static validatorInteger(formControl: AbstractControl): null | { valid: boolean } {
    return Number.isInteger(formControl.value) ? null : {
      valid: true
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private screenService: ScreenService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<NewDrawComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {
    this.startColor = NewDrawComponent.START_COLOR;
    this.userChangeSizeMannually = false;
    const screenSize: ScreenSize = this.screenService.getCurrentSize();
    this.maxWidth = screenSize.width;
    this.maxHeight = screenSize.height;
    this.form = this.formBuilder.group({
      width: [
        '',
        [
          Validators.required,
          Validators.min(NewDrawComponent.MIN_DIMENSION),
          Validators.max(NewDrawComponent.MAX_DIMENSION),
          NewDrawComponent.validatorInteger
        ]
      ],
      height: [
        '',
        [
          Validators.required,
          Validators.min(NewDrawComponent.MIN_DIMENSION),
          Validators.max(NewDrawComponent.MAX_DIMENSION),
          NewDrawComponent.validatorInteger
        ]
      ],
      color: ['', []]
    });
    this.dialogRefs = {
      palette: (undefined as unknown) as MatDialogRef<PaletteDialogComponent>,
      confirm: (undefined as unknown) as
        MatDialogRef<ConfirmationDialogComponent>
    };
  }

  ngOnInit(): void {
    const screenSize = this.screenService.getCurrentSize();
    this.updateFormSize(screenSize);
    this.screenSize = this.screenService.size.subscribe((screenSizeParam) =>
      this.updateFormSize(screenSizeParam)
    );
  }

  ngOnDestroy(): void {
    this.screenSize.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.patchValue({ color: this.startColor });
    }, 0);
    if (this.palette == null) {
      return;
    }
    this.renderer.listen(this.palette.nativeElement, 'click', () => {
      this.dialogRefs.palette = this.dialog.open(PaletteDialogComponent);
      this.dialogRefs.palette
        .afterClosed()
        .subscribe(this.paletteCloseHandler);
    });
  }

  private paletteCloseHandler = (colorPicked: string | undefined): void => {
    this.closePaletteDialog(colorPicked);
  }

  private closePaletteDialog(colorPicked: string | undefined): void {
    if (colorPicked !== undefined) {
      this.renderer.setStyle(this.palette.nativeElement,
        'background-color', colorPicked);
      this.form.patchValue({ color: colorPicked });
    }
    this.button.nativeElement.focus();
  }

  private updateFormSize(screenSize: ScreenSize): void {
    this.maxWidth = screenSize.width;
    this.maxHeight = screenSize.height;
    if (this.userChangeSizeMannually) {
      return;
    }
    this.form.patchValue({
      width: this.maxWidth,
      height: this.maxHeight
    });
  }

  protected onDimensionsChangedByUser(): void {
    this.userChangeSizeMannually = true;
  }

  protected onSubmit(): void  {
    if (!this.data.drawInProgress) {
      this.dialogRef.close(this.form.value);
      return;
    }

    this.dialogRefs.confirm = this.dialog.open(ConfirmationDialogComponent);
    this.dialogRefs.confirm.disableClose = true;
    this.dialogRefs.confirm.afterClosed().subscribe(this.onSubmitHandler);
  }

  private onSubmitHandler = (result: boolean): void => {
    this.closeDialog(result);
  }

  private closeDialog(result: boolean): void {
    this.dialogRef.close(result ? this.form.value : OverlayPages.HOME as string);
  }

  protected onReturn(): void {
    this.dialogRef.close(OverlayPages.HOME as string);
  }
}
