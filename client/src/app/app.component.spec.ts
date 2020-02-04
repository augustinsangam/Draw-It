import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Overlay } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolSelectorService } from './tool/tool-selector/tool-selector.service';

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

});
