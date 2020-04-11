import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Overlay } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LocalStorageHandlerService } from './auto-save/local-storage-handler.service';
import { MaterialModule } from './material.module';
import { DocumentationComponent } from './overlay/pages/documentation/documentation.component';
import { ExportComponent } from './overlay/pages/export/export.component';
import { GalleryCardComponent } from './overlay/pages/gallery/gallery-card/gallery-card.component';
import { GalleryComponent } from './overlay/pages/gallery/gallery.component';
import { TagsFilterComponent } from './overlay/pages/gallery/tags-filter/tags-filter.component';
import { HomeComponent } from './overlay/pages/home/home.component';
import { NewDrawComponent } from './overlay/pages/new-draw/new-draw.component';
import { SaveComponent } from './overlay/pages/save/save.component';
import { PanelComponent } from './panel/panel.component';
import { ShortcutHandlerService } from './shortcut-handler/shortcut-handler.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SvgShape } from './svg/svg-shape';
import { SvgService } from './svg/svg.service';
import { ColorBoxComponent } from './tool/color/color-box/color-box.component';
import { ColorPanelComponent } from './tool/color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from './tool/color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from './tool/color/color-panel/color-picker-item/color-picker-item.component';
import { PencilPanelComponent } from './tool/drawing-instruments/pencil/pencil-panel/pencil-panel.component';
import { ToolSelectorService } from './tool/tool-selector/tool-selector.service';
import { UndoRedoService } from './undo-redo/undo-redo.service';

// tslint:disable: no-string-literal no-any no-magic-numbers
describe('AppComponent', () => {

  let component: AppComponent;
  let svgService: SvgService;
  let autoSave: LocalStorageHandlerService;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ColorBoxComponent,
        ColorPanelComponent,
        ColorPickerContentComponent,
        ColorPickerItemComponent,
        DocumentationComponent,
        ExportComponent,
        GalleryComponent,
        GalleryCardComponent,
        HomeComponent,
        NewDrawComponent,
        PanelComponent,
        PencilPanelComponent,
        SaveComponent,
        SidebarComponent,
        TagsFilterComponent
      ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
      ],
      providers: [
        SvgService,
        UndoRedoService,
        ToolSelectorService,
        Overlay,
        MatDialog,
        ShortcutHandlerService,
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
      ],
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          ColorBoxComponent,
          HomeComponent,
          NewDrawComponent,
          DocumentationComponent,
          PencilPanelComponent,
          GalleryComponent,
          ExportComponent,
          SaveComponent,
        ]
      }
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);

    component = fixture.componentInstance;

    svgService = TestBed.get(SvgService);

    // autoSave = TestBed.get(LocalStorageHandlerService);

    svgService.structure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    svgService.structure.root.appendChild(svgService.structure.defsZone);
    svgService.structure.root.appendChild(svgService.structure.drawZone);
    svgService.structure.root.appendChild(svgService.structure.temporaryZone);
    svgService.structure.root.appendChild(svgService.structure.endZone);

    (TestBed.get(UndoRedoService) as UndoRedoService).intialise(svgService.structure);

    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngAfterviewInit should call getDrawing '
      + 'when there is a draw saved', fakeAsync(() => {
    const spy = spyOn<any>(component['autoSave'], 'getDrawing').and.callThrough();
    const element: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const apath: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    apath.setAttribute('id', 'thepath11');
    element.setAttribute('id', 'test11');
    element.appendChild(apath);
    autoSave.saveState(element);
    const shape: SvgShape = { width: 500, height: 500, color: 'red'};
    autoSave.saveShape(shape);
    component.ngAfterViewInit();
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    }, 500);
    tick(500);
    localStorage.clear();
  }));

});
