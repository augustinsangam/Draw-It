import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Overlay } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { OverlayService } from './overlay/overlay.service';
import { DocumentationComponent } from './overlay/pages/documentation/documentation.component';
import { ExportComponent } from './overlay/pages/export/export.component';
import { GalleryCardComponent } from './overlay/pages/gallery/gallery-card/gallery-card.component';
import { GalleryComponent, GalleryDraw } from './overlay/pages/gallery/gallery.component';
import { TagsFilterComponent } from './overlay/pages/gallery/tags-filter/tags-filter.component';
import { HomeComponent } from './overlay/pages/home/home.component';
import { NewDrawComponent } from './overlay/pages/new-draw/new-draw.component';
import { SaveComponent } from './overlay/pages/save/save.component';
import { PanelComponent } from './panel/panel.component';
import { Shortcut } from './shortcut-handler/shortcut';
import {
  ShortcutHandlerService
} from './shortcut-handler/shortcut-handler.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SvgShape } from './svg/svg-shape';
import { SvgService } from './svg/svg.service';
import { ColorBoxComponent } from './tool/color/color-box/color-box.component';
import { ColorPanelComponent } from './tool/color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from './tool/color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from './tool/color/color-panel/color-picker-item/color-picker-item.component';
import { PencilPanelComponent } from './tool/drawing-instruments/pencil/pencil-panel/pencil-panel.component';
import {
  ToolSelectorService
} from './tool/tool-selector/tool-selector.service';
import { Tool } from './tool/tool.enum';
import { UndoRedoService } from './tool/undo-redo/undo-redo.service';

// tslint:disable: no-string-literal no-any no-magic-numbers
describe('AppComponent', () => {
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

    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
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
      const spy = spyOn(service['shortcutHanler'], 'desactivateAll');

      service['openDocumentationDialog'](true);

      service['dialogRefs'].documentation.close();

      expect(spy).toHaveBeenCalled();
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

  it('#openGalleryDialog should not call getCommonDialogOptions.', () => {
    const spy = spyOn<any>(service, 'getCommonDialogOptions');
    service['openGalleryDialog'](true);
    service['dialogRefs'].gallery.close();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#closeGalleryDialog should load the draw if option is not undefined', () => {
    const spy = spyOn<any>(service, 'loadDraw');
    service['closeGalleryDialog'](false, ' ' as unknown as GalleryDraw);
    expect(spy).toHaveBeenCalled();
  });

  it('#closeGalleryDialog should not load the draw if option is undefined', () => {
    const spy = spyOn<any>(service, 'loadDraw');
    service['closeGalleryDialog'](false, undefined);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#closeGalleryDialog should open home dialog when option is undefined'
    + ' and from home is set', () => {
    const spy = spyOn<any>(service, 'openHomeDialog');
    service['closeGalleryDialog'](true, undefined);
    expect(spy).toHaveBeenCalled();
  });

  it('#loadDraw append SVGElement in the DOM', (done: DoneFn) => {
    const drawElements = document.createElementNS('http://www.w3.org/2000/svg',
                                            'svg:g') as SVGGElement;
    const rec1 = document.createElementNS('http://www.w3.org/2000/svg',
                                            'svg:rect') as SVGElement;
    const rec2 = document.createElementNS('http://www.w3.org/2000/svg',
                                            'svg:rect') as SVGElement;
    drawElements.appendChild(rec1);
    drawElements.appendChild(rec2);

    const draw: GalleryDraw = {
      header : {
        name: 'Zeus',
        id: 3,
        tags: [],
      },
      shape: {
        height: 400,
        width: 400,
        color: '#FFFFFF'
      },
      svg: drawElements,
      colors: ['rgba(0, 0, 0, 1)'],
    };

    service['loadDraw'](draw);
    setTimeout(() => {
      expect(svgService.structure.drawZone.contains(rec1)).toBeTruthy();
      expect(svgService.structure.drawZone.contains(rec2)).toBeTruthy();
      done();
    }, 500);
  });

  it('#Handler for Ctrl + digit O should open new draw dialog', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'KeyO',
      ctrlKey: true,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service, 'openNewDrawDialog');
    service['initialiseShortcuts']();
    const handlerDigitO = service['shortcutHanler']['manager'].get(Shortcut.O);
    if (!!handlerDigitO) {
      handlerDigitO.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('#Handler for digit O should not cancel default action', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'KeyO',
      ctrlKey: false,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spy = spyOn(eventOWithControl, 'preventDefault');
    service['initialiseShortcuts']();
    const handlerDigitO = service['shortcutHanler']['manager'].get(Shortcut.O);
    if (!!handlerDigitO) {
      handlerDigitO.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, 500);
  });

  it('#Handler for Ctrl + digit A should cancel default action and'
    + 'selection Selection Tool', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'KeyA',
      ctrlKey: true,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spyPrevent = spyOn(eventOWithControl, 'preventDefault');
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    service['initialiseShortcuts']();
    const handlerDigitA = service['shortcutHanler']['manager'].get(Shortcut.A);
    if (!!handlerDigitA) {
      handlerDigitA.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(spyPrevent).toHaveBeenCalled();
      expect(spyTool).toHaveBeenCalledWith(Tool.Selection);
      done();
    }, 500);
  });

  it('#Handler for Digit A should select Aerosol', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'KeyA',
      ctrlKey: false,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    service['initialiseShortcuts']();
    const handlerDigitA = service['shortcutHanler']['manager'].get(Shortcut.A);
    if (!!handlerDigitA) {
      handlerDigitA.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Aerosol);
      done();
    }, 500);
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
