import { AfterViewInit, Component, HostListener, } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OverlayService } from './overlay.service';
import {
  ShortcutHandlerManagerService
} from './shortcut-handler/shortcut-handler-manager.service';
import {
  ShortcutHandlerService
} from './shortcut-handler/shortcut-handler.service';
import { SvgService } from './svg/svg.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(
    private dialog: MatDialog,
    private svgService: SvgService,
    private shortcutHanler: ShortcutHandlerService,
    private shortcutManager: ShortcutHandlerManagerService,
    private overlaService: OverlayService
  ) {

  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.shortcutHanler.execute(event);
  }

  ngAfterViewInit() {
    this.overlaService.intialise(this.dialog, this.svgService);
    this.overlaService.start();
    this.shortcutManager.initialiseShortcuts();
  }

}
