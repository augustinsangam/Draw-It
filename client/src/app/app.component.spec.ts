import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import {  Overlay } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent, OverlayPages } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolSelectorService } from './tool/tool-selector/tool-selector.service';

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PanelComponent,
        SidebarComponent,
        HomeComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule
      ],
      providers: [
        ToolSelectorService,
        Overlay,
        MatDialog,
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          HomeComponent,
        ]
      }
    })

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#keyEvent should call this.toolSelectorService.set()', () => {
    // tslint:disable-next-line: no-string-literal
    component['onMainPage'] = true;

    const event = new KeyboardEvent('window:keydown', {
      code: 'KeyC',
    });

    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(component['toolSelectorService'], 'set');

    component.keyEvent(event);

    expect(spy).toHaveBeenCalled()
  });

  it('#keyEvent should call this.toolSelectorService.set()', () => {
    // tslint:disable-next-line: no-string-literal
    component['onMainPage'] = true;

    const event = new KeyboardEvent('window:keydown', {
      code: 'KeyO',
      ctrlKey: true,
    });

    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(component, 'openNewDrawDialog');

    component.keyEvent(event);

    expect(spy).toHaveBeenCalled()
  });

  // it('#keyEvent should call this.toolSelectorService.set()', () => {
  //   // tslint:disable-next-line: no-string-literal
  //   component['onMainPage'] = false;

  //   const event = new KeyboardEvent('window:keydown', {
  //     code: 'KeyX',
  //     ctrlKey: true,
  //   });

  //   // tslint:disable-next-line: no-string-literal
  //   const spy1 = spyOn(component['toolSelectorService'], 'set');

  //   // tslint:disable-next-line: no-string-literal
  //   const spy2 = spyOn(component, 'openNewDrawDialog');

  //   component.keyEvent(event);

  //   expect(spy1).toHaveBeenCalledTimes(0);
  //   expect(spy2).toHaveBeenCalledTimes(0);
  // });

  it('#ngAfterViewInit should set component.svgService.instance to component.svg', () => {
    // tslint:disable-next-line: no-string-literal
    expect(component['svgService'].instance).toBe(component.svg);
  })

  it('openHomeDialog should call openNewDrawDialog()', fakeAsync(() => {
    const spy = spyOn(component, 'openNewDrawDialog');

    component.openHomeDialog();

    console.log(component['dialogRefs'].home);

    // tslint:disable-next-line: no-string-literal
    component['dialogRefs'].home.close(OverlayPages.New);
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

});
