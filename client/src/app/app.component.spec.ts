import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {  Overlay } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
  MatDialog,
  MatDialogModule
} from '@angular/material';
import {
  BrowserDynamicTestingModule
} from '@angular/platform-browser-dynamic/testing';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { AppComponent, NewDrawOptions } from './app.component';
import { MaterialModule } from './material.module';
import {
  DocumentationComponent
} from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { PanelComponent } from './panel/panel.component';
import {
  ShortcutCallBack, Shortcut, ShortcutHandlerService
} from './shortcut-handler.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import {
  ColorPanelComponent
} from './tool/color/color-panel/color-panel.component';
import {
  ColorPickerContentComponent
// tslint:disable-next-line: max-line-length
} from './tool/color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from './tool/color/color-panel/color-picker-item/color-picker-item.component';
import {
  PencilPanelComponent
} from './tool/drawing-instruments/pencil/pencil-panel/pencil-panel.component';
import {
  ToolSelectorService
} from './tool/tool-selector/tool-selector.service';

// tslint:disable: no-string-literal
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PanelComponent,
        SidebarComponent,
        HomeComponent,
        NewDrawComponent,
        DocumentationComponent,
        ColorPickerItemComponent,
        PencilPanelComponent,
        ColorPanelComponent,
        ColorPickerContentComponent,

      ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule
      ],
      providers: [
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
          HomeComponent,
          NewDrawComponent,
          DocumentationComponent,
          PencilPanelComponent
        ]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
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

  it('#ngAfterViewInit should set component.svgService.instance'
   + 'to component.svg', () => {
    expect(component['svgService'].instance).toBe(component.svg);
  });

  it('#openHomeDialog should call openSelectedDialog()', () => {
    component['dialogRefs'].home.disableClose = false;

    component['openHomeDialog']();

    component['dialogRefs'].home.close();

    expect(component['dialogRefs'].home.disableClose).toBe(true);
  });

  it('#openSelectedDialog should call openNewDrawDialog', () => {
    const spy = spyOn<any>(component, 'openNewDrawDialog');

    component['openSelectedDialog']('new');

    expect(spy).toHaveBeenCalled();
  });

  it('#openSelectedDialog should call openDocumentationDialog', () => {
    const spy = spyOn<any>(component, 'openDocumentationDialog');

    component['openSelectedDialog']('documentation');

    expect(spy).toHaveBeenCalled();
  });

  it('#openSelectedDialog should not call openNewDrawDialog '
   + 'and openDocumentationDialog', () => {
    const spy1 = spyOn<any>(component, 'openNewDrawDialog');
    const spy2 = spyOn<any>(component, 'openDocumentationDialog');

    component['openSelectedDialog']('library');

    expect(spy1).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(0);
  });

  it('#openSelectedDialog should not call openNewDrawDialog'
  +  'and openDocumentationDialog', () => {
    const spy1 = spyOn<any>(component, 'openNewDrawDialog');
    const spy2 = spyOn<any>(component, 'openDocumentationDialog');

    component['openSelectedDialog']('home');

    expect(spy1).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(0);
  });

  it('#openNewDrawDialog should call getCommomDialogOptions.', () => {
    const spy = spyOn<any>(component, 'getCommomDialogOptions');

    component['openNewDrawDialog']();

    component['dialogRefs'].newDraw.close();

    expect(spy).toHaveBeenCalled();
  });

  it('#closeNewDrawDialog should call openHomeDialog if option '
   + 'is "home".', () => {
    const spy = spyOn<any>(component, 'openHomeDialog');

    component['closeNewDrawDialog']('home');

    expect(spy).toHaveBeenCalled();
  });

  it('#closeNewDrawDialog should call createNewDraw if option is a'
  + ' NewDrawOtion type.', () => {
    const spy = spyOn<any>(component, 'createNewDraw');

    const option: NewDrawOptions = {
      width: 2,
      height: 2,
      color: '#FFFFFF'
    };

    component['closeNewDrawDialog'](option);

    expect(spy).toHaveBeenCalled();
  });

  it('#closeNewDrawDialog should not call openHomeDialog and'
   + 'createNewDraw if option null.', () => {
    const spy1 = spyOn<any>(component, 'openHomeDialog');
    const spy2 = spyOn<any>(component, 'createNewDraw');

    const option = (null as unknown) as NewDrawOptions;

    component['closeNewDrawDialog'](option);

    expect(spy1).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(0);
  });

  it('#closeDocumentationDialog should call openHomeDialog if fromHome'
   + '(arg) is true', () => {
    const spy = spyOn<any>(component, 'openHomeDialog');

    component['closeDocumentationDialog'](true);

    expect(spy).toHaveBeenCalled();
  });

  it('#closeDocumentationDialog should not call openHomeDialog'
   + 'if fromHome (arg) is false', () => {
    const spy = spyOn<any>(component, 'openHomeDialog');

    component['closeDocumentationDialog'](false);

    expect(spy).not.toHaveBeenCalled();
  });

  it('#openDocumentationDialog should set '
    + 'dialogRefs.documentation.disableClose to false', () => {
    const spy = spyOn(component['shortcutHanler'], 'desactivateAll');

    component['openDocumentationDialog'](true);

    component['dialogRefs'].documentation.close();

    expect(spy).toHaveBeenCalled();
  });

  it('#createNewDraw should set drawInProgress to true', () => {
    const option: NewDrawOptions = {
      width: 2,
      height: 2,
      color: '#FFFFFF'
    };

    component['drawInProgress'] = false;

    component.svg.nativeElement.appendChild(document.createElement('circle'));

    component['createNewDraw'](option);

    expect(component['drawInProgress']).toBeTruthy();
  });

  it('#Handlers works for C, L, W and digit 1', () => {
    const spy = spyOn(component['toolSelectorService'], 'set');
    (component['handlersFunc'].get(Shortcut.C) as ShortcutCallBack)();
    (component['handlersFunc'].get(Shortcut.L) as ShortcutCallBack)();
    (component['handlersFunc'].get(Shortcut.W) as ShortcutCallBack)();
    (component['handlersFunc'].get(Shortcut.Digit1) as ShortcutCallBack)();
    expect(spy).toHaveBeenCalledTimes(4);
  })

  it('#Handler works for digit O', () => {
    const spy = spyOn<any>(component, 'openNewDrawDialog');
    const eventOWithoutControl = new KeyboardEvent('window:keydown', {
      code: 'KeyO',
      ctrlKey: false
    });
    (component['handlersFunc'].get(Shortcut.O) as
    ShortcutCallBack)(eventOWithoutControl);
    const eventOWithControl = new KeyboardEvent('window:keydown', {
      code: 'KeyO',
      ctrlKey: true,
    });
    (component['handlersFunc'].get(Shortcut.O) as
      ShortcutCallBack)(eventOWithControl);
    expect(spy).toHaveBeenCalledTimes(1);
  })
});
