import { AfterViewInit, Component, HostListener, Renderer2, } from '@angular/core';
import { OverlayManager } from './overlay/overlay-manager';
import { OverlayService } from './overlay/overlay.service';
import {
  ShortcutHandlerManagerService
} from './shortcut-handler/shortcut-handler-manager.service';
import {
  ShortcutHandlerService
} from './shortcut-handler/shortcut-handler.service';
import { SvgService } from './svg/svg.service';
import { FilterService } from './tool/drawing-instruments/brush/filter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(private dialog: OverlayManager,
              private svgService: SvgService,
              private shortcutHanler: ShortcutHandlerService,
              private shortcutManager: ShortcutHandlerManagerService,
              private overlayService: OverlayService,
              private filterService: FilterService,
              private renderer: Renderer2
  ) { }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    this.shortcutHanler.execute(event);
  }

  ngAfterViewInit(): void {
    const svgDefsEl: SVGDefsElement = this.filterService.generateBrushFilters(this.renderer);
    this.renderer.appendChild(this.svgService.structure.defsZone, svgDefsEl);
    this.overlayService.intialise(this.dialog, this.svgService);
    this.shortcutManager.initialiseShortcuts();
    this.overlayService.start();
  }

}
