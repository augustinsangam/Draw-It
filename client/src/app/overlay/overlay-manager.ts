import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ShortcutHandlerService } from 'src/app/shortcut-handler/shortcut-handler.service';

@Injectable({
  providedIn: 'root'
})
export class OverlayManager {

  constructor(private matDialog: MatDialog,
              private shortcutHandler: ShortcutHandlerService) { }

  open<T>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig | undefined): MatDialogRef<T> {
    this.shortcutHandler.desactivateAll();
    const dialogRef = this.matDialog.open(componentOrTemplateRef, config);
    dialogRef.afterClosed().subscribe(() => {
      this.shortcutHandler.activateAll();
    });
    return dialogRef;
  }

}
