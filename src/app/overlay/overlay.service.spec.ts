import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Overlay } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from '../app.component';
import { MaterialModule } from '../material.module';
import { PanelComponent } from '../panel/panel.component';
import { ShortcutHandlerService } from '../shortcut-handler/shortcut-handler.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SvgShape } from '../svg/svg-shape';
import { SvgService } from '../svg/svg.service';
import { ColorBoxComponent } from '../tool/color/color-box/color-box.component';
import { ColorPanelComponent } from '../tool/color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from '../tool/color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from '../tool/color/color-panel/color-picker-item/color-picker-item.component';
import { PencilPanelComponent } from '../tool/drawing-instruments/pencil/pencil-panel/pencil-panel.component';
import { ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { OverlayService } from './overlay.service';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { ExportComponent } from './pages/export/export.component';
import { HomeComponent } from './pages/home/home.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { SaveComponent } from './pages/save/save.component';

// tslint:disable: no-string-literal no-any no-magic-numbers
describe('Overlay', () => {
  let component: AppComponent;
  let service: OverlayService;
  let svgService: SvgService;
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
        HomeComponent,
        NewDrawComponent,
        PanelComponent,
        PencilPanelComponent,
        SaveComponent,
        SidebarComponent,
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
          ExportComponent,
          SaveComponent,
        ]
      }
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);

    component = fixture.componentInstance;

    service = component['overlayService'];

    svgService = TestBed.get(SvgService);

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
    localStorage.clear();

    fixture.detectChanges();
  });

  afterEach(() => {
    component['dialog']['matDialog'].closeAll();
  });

  it('#should create', () => {
    expect(service).toBeTruthy();
  });

  it('#keyEvent should call this.shortcutHanler.execute()', () => {
    const event = new KeyboardEvent('window:keydown', {
      code: 'KeyC'
    });

    const spy = spyOn(component['shortcutHanler'], 'execute');

    component.keyEvent(event);

    expect(spy).toHaveBeenCalled();
  });

  it('#openHomeDialog should call openSelectedDialog()', () => {
    service['dialogRefs'].home.disableClose = false;

    service['openHomeDialog']();

    service['dialogRefs'].home.close();

    expect(service['dialogRefs'].home.disableClose).toBe(true);
  });

  it('#openSelectedDialog should call openNewDrawDialog', () => {
    const spy = spyOn<any>(service, 'openNewDrawDialog');

    service['openSelectedDialog']('new');

    expect(spy).toHaveBeenCalled();
  });

  it('#openSelectedDialog should call openDocumentationDialog', () => {
    const spy = spyOn<any>(service, 'openDocumentationDialog');

    service['openSelectedDialog']('documentation');

    expect(spy).toHaveBeenCalled();
  });

  it('#openSelectedDialog should not call openNewDrawDialog '
    + 'and openDocumentationDialog', () => {
      const spy1 = spyOn<any>(service, 'openNewDrawDialog');
      const spy2 = spyOn<any>(service, 'openDocumentationDialog');

      service['openSelectedDialog']('library');

      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
    });

  it('#openSelectedDialog should not call openNewDrawDialog'
    + 'and openDocumentationDialog', () => {
      const spy1 = spyOn<any>(service, 'openNewDrawDialog');
      const spy2 = spyOn<any>(service, 'openDocumentationDialog');

      service['openSelectedDialog']('home');

      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
    });

  it('#openNewDrawDialog should call getCommonDialogOptions.', () => {
    const spy = spyOn<any>(service, 'getCommonDialogOptions').and.callThrough();

    service['openNewDrawDialog']();

    service['dialogRefs'].newDraw.close();

    expect(spy).toHaveBeenCalled();
  });

  it('#closeNewDrawDialog should call openHomeDialog if option '
    + 'is "home".', () => {
      const spy = spyOn<any>(service, 'openHomeDialog');

      service['closeNewDrawDialog']('home');

      expect(spy).toHaveBeenCalled();
    });

  it('#closeNewDrawDialog should call createNewDraw if option is a'
    + ' NewDrawOtion type.', () => {
      const spy = spyOn<any>(service, 'createNewDraw');

      const option: SvgShape = {
        width: 2,
        height: 2,
        color: '#FFFFFF'
      };

      service['closeNewDrawDialog'](option);

      expect(spy).toHaveBeenCalled();
    });

  it('#closeNewDrawDialog should not call openHomeDialog and'
    + 'createNewDraw if option null.', () => {
      const spy1 = spyOn<any>(service, 'openHomeDialog');
      const spy2 = spyOn<any>(service, 'createNewDraw');

      const option = (null as unknown) as SvgShape;

      service['closeNewDrawDialog'](option);

      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
    });

  it('#closeDocumentationDialog should call openHomeDialog if fromHome'
    + '(arg) is true', () => {
      const spy = spyOn<any>(service, 'openHomeDialog');

      service['closeDocumentationDialog'](true);

      expect(spy).toHaveBeenCalled();
    });

  it('#closeDocumentationDialog should not call openHomeDialog'
    + 'if fromHome (arg) is false', () => {
      const spy = spyOn<any>(service, 'openHomeDialog');

      service['closeDocumentationDialog'](false);

      expect(spy).not.toHaveBeenCalled();
    });

  it('#openDocumentationDialog should set '
    + 'dialogRefs.documentation.disableClose to false', () => {

      service['openDocumentationDialog'](true);

      service['dialogRefs'].documentation.close();

      expect(service['dialogRefs'].documentation.disableClose).toBeFalsy();
    });

  it('#createNewDraw should clear the DOM', () => {
    const option: SvgShape = {
      width: 2,
      height: 2,
      color: '#FFFFFF'
    };
    const spy = spyOn(service['svgService'], 'clearDom');
    service['createNewDraw'](option);
    expect(spy).toHaveBeenCalled();
  });

  it('#openSaveDialog and #openExportDialog should not call getCommonDialogOptions.', () => {
    const spy = spyOn<any>(service, 'getCommonDialogOptions');
    service['openSaveDialog']();
    service['dialogRefs'].save.close();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#openExportDialog should not call getCommonDialogOptions.', () => {
    const spy = spyOn<any>(service, 'getCommonDialogOptions');
    service['openExportDialog']();
    service['dialogRefs'].export.close();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#closeSaveDialog works well when error undefined', () => {
    const spy = spyOn<any>(service['snackBar'], 'open').and.callThrough();
    service['closeSaveDialog'](undefined as unknown as string);
    expect(spy).toHaveBeenCalled();
  });

  it('#closeSaveDialog works well when error undefined', () => {
    const spy = spyOn<any>(service['snackBar'], 'open').and.callThrough();
    service['closeSaveDialog']('Success');
    expect(spy).toHaveBeenCalled();
  });

});
// tslint:disable-next-line: max-file-line-count
