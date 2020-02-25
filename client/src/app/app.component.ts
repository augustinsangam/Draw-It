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
import { SharedService } from './shared/shared.service';
import {
  Shortcut,
  ShortcutHandlerService,
} from './shortcut-handler/shortcut-handler.service';
import { SvgComponent } from './svg/svg.component';
import { ToolSelectorService } from './tool-selector/tool-selector.service';
import { Tool } from './tool/tool.enum';
import { UndoRedoService } from './undo-redo/undo-redo.service';

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
    sharedService: SharedService,
    private readonly shortcutHandlerService: ShortcutHandlerService,
    private readonly snackBar: MatSnackBar,
    toolSelectorService: ToolSelectorService,
    undoRedoService: UndoRedoService,
  ) {
    this.drawInProgress = false;
    this.pageToDialog = new Map();
    this.pageToDialog.set(Page.DOCUMENTATION, this.openDocumentationDialog);
    // this.pages.set(Page.EXPORT, …);
    // this.pages.set(Page.GALLERY, …);
    this.pageToDialog.set(Page.HOME, this.openHomeDialog);
    this.pageToDialog.set(Page.NEW_DRAW, this.openNewDrawDialog);
    this.pageToDialog.set(Page.SAVE, this.openSaveDialog);
    for (let tool = Tool._Len; --tool; ) {
      const shortcut = sharedService.toolShortcuts[tool];
      if (!!shortcut) {
        shortcutHandlerService.set(shortcut,
          () => toolSelectorService.set(tool));
      }
    }
    shortcutHandlerService.set(Shortcut.A, (keyEv) => {
      toolSelectorService.set(keyEv.ctrlKey ? Tool.Selection : Tool.Aerosol);
      if (keyEv.ctrlKey) {
        keyEv.preventDefault();
        // TODO: this.svgService.selectAllElements.emit(null);
      }
    });
    shortcutHandlerService.set(Shortcut.O, (keyEv) => {
      if (keyEv.ctrlKey) {
        keyEv.preventDefault();
        this.openPage(Page.NEW_DRAW, false);
      }
    });
    shortcutHandlerService.set(Shortcut.S, (keyEv) => {
      if (keyEv.ctrlKey) {
        keyEv.preventDefault();
        this.openPage(Page.SAVE, false);
      }
    });
    shortcutHandlerService.set(Shortcut.Z, (keyEv) => {
      if (keyEv.ctrlKey) {
        keyEv.preventDefault();
        undoRedoService.do(keyEv.shiftKey);
      }
    });
  }

  @HostListener('window:keydown', [
    '$event',
  ])
  keyEvent(keyEv: KeyboardEvent): void {
    this.shortcutHandlerService.execute(keyEv);
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
