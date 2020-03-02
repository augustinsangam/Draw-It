import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Overlay } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import {
  ShortcutHandlerService
} from './shortcut-handler/shortcut-handler.service';
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
      ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        ToolSelectorService,
        Overlay,
        MatDialog,
        ShortcutHandlerService,
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
      ],
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

});
