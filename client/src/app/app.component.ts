import { ComponentType } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  HostListener,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { DrawConfig } from './constants/constants';
import {
  DocumentationComponent
} from './page/documentation/documentation.component';
import { HomeComponent } from './page/home/home.component';
import { NewDrawComponent } from './page/new-draw/new-draw.component';
import { Page } from './page/page';
import { SaveComponent } from './page/save/save.component';
import {
  Shortcut,
  ShortcutHandlerService,
} from './shortcut-handler/shortcut-handler.service';
import { SvgComponent } from './svg/svg.component';

@Component({
  selector: 'app-root',
  styleUrls: [
    './app.component.css',
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('container', {
    read: ViewContainerRef,
    static: true,
  })
  private readonly viewContainerRef: ViewContainerRef;

  private drawInProgress: boolean;
  private readonly pageToDialog: Map<Page, (fromHome?: boolean) => void>;

  private svgComponentRef?: ComponentRef<SvgComponent>;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly dialog: MatDialog,
    private readonly shortcutHandlerService: ShortcutHandlerService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.drawInProgress = false;
    this.pageToDialog = new Map();
    this.pageToDialog.set(Page.DOCUMENTATION, this.openDocumentationDialog);
    // this.pages.set(Page.EXPORT, …);
    // this.pages.set(Page.GALLERY, …);
    this.pageToDialog.set(Page.HOME, this.openHomeDialog);
    this.pageToDialog.set(Page.NEW_DRAW, this.openNewDrawDialog);
    this.pageToDialog.set(Page.SAVE, this.openSaveDialog);
    shortcutHandlerService.set(Shortcut.CTRL_O, (keyEv) => {
      keyEv.preventDefault();
      this.openPage(Page.NEW_DRAW, false);
    });
    shortcutHandlerService.set(Shortcut.CTRL_S, (keyEv) => {
      keyEv.preventDefault();
      this.openPage(Page.SAVE, false);
    });
  }

  @HostListener('window:keydown', [
    '$event',
  ])
  keyEvent(keyEv: KeyboardEvent): void {
    this.shortcutHandlerService.emit(keyEv);
  }

  ngAfterViewInit(): void {
    this.openPage(Page.HOME, true);
  }

  private dialogConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    // Do not focus the first element, but rather the host
    dialogConfig.autoFocus = false;
    dialogConfig.height = '90%';
    // See style.css
    dialogConfig.panelClass = 'no-padding';
    dialogConfig.width = '650px';
    return dialogConfig;
  }

  private openDialog<T>(dialog: ComponentType<T>, config: MatDialogConfig):
    Observable<any> {
    return this.dialog.open(dialog, config).afterClosed();
  }

  private openHomeDialog(fromHome: boolean): void {
    if (!fromHome) {
      this.shortcutHandlerService.activateAll();
      return;
    }
    const dialogConfig = this.dialogConfig();
    dialogConfig.data = {
      drawInProgress: this.drawInProgress,
    };
    dialogConfig.disableClose = true;
    this.openDialog(HomeComponent, dialogConfig).subscribe(
      (page: Page) => {
        this.shortcutHandlerService.activateAll();
        this.openPage(page, true);
      }
    );
  }

  private createNewDraw(drawConfig: DrawConfig): void {
    this.viewContainerRef.clear();
    const componentFactory = this.componentFactoryResolver
      .resolveComponentFactory(SvgComponent);
    const componentRef = this.viewContainerRef
      .createComponent(componentFactory);
    componentRef.instance.config = drawConfig;
    this.svgComponentRef = componentRef;
  }

  private openNewDrawDialog(fromHome: boolean): void {
    const dialogConfig = this.dialogConfig();
    dialogConfig.data = {
      drawInProgress: this.drawInProgress,
    };
    dialogConfig.disableClose = true;
    this.openDialog(NewDrawComponent, dialogConfig).subscribe(
      (config?: DrawConfig) => {
        this.shortcutHandlerService.activateAll();
        if (!!config) {
          this.createNewDraw(config);
        } else {
          this.openPage(Page.HOME, fromHome);
        }
    });
  }

  private openDocumentationDialog(fromHome: boolean): void {
    const dialogConfig = this.dialogConfig();
    dialogConfig.height = '90vh';
    this.openDialog(DocumentationComponent, dialogConfig).subscribe(() => {
      this.shortcutHandlerService.activateAll();
      this.openPage(Page.HOME, fromHome);
    });
  }

  private openSaveDialog(): void {
    const dialogConfig = this.dialogConfig();
    dialogConfig.data = this.svgComponentRef?.instance.config;
    this.openDialog(SaveComponent, dialogConfig).subscribe(
      (err?: string) => {
        this.shortcutHandlerService.activateAll();
        this.snackBar.open(err ? err : 'Succès', 'ok', {
          duration: err ? 3000 : 1000,
        });
      });
  }

  // Must be public
  openPage(page: Page, fromHome: boolean): void {
    const cb = this.pageToDialog.get(page);
    if (!!cb) {
      this.shortcutHandlerService.desactivateAll();
      cb.bind(this)(fromHome);
    }
  }
}
