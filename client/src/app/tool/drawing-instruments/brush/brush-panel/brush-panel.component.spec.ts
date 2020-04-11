import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkObserveContent } from '@angular/cdk/observers';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCard,
  MatCardContent,
  MatCardTitle,
  MatDialogClose,
  MatFormField,
  MatGridList,
  MatIcon,
  MatInput,
  MatRadioButton,
  MatRadioGroup,
  MatRipple,
  MatSlider
} from '@angular/material';
import { MatRadioChange } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from 'src/app/sidebar/sidebar.component';
import {
  ColorPanelComponent
} from '../../../color/color-panel/color-panel.component';
import {
  ColorPickerContentComponent
} from '../../../color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from '../../../color/color-panel/color-picker-item/color-picker-item.component';
import { BrushPanelComponent } from './brush-panel.component';
import { OverlayService } from 'src/app/overlay/overlay.service';

// On a besoin des string-literal pour accéder aux attributs privés
// tslint:disable: no-string-literal
fdescribe('BrushPanelComponent', () => {
  let component: BrushPanelComponent;
  let fixture: ComponentFixture<BrushPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [
        BrushPanelComponent,
        CdkObserveContent,
        ColorPanelComponent,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        MatCard,
        MatCardTitle,
        MatCardContent,
        MatFormField,
        MatIcon,
        MatRadioButton,
        MatRadioGroup,
        MatRipple,
        MatSlider,
        MatDialogClose,
        MatGridList,
        SidebarComponent,
        MatInput
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushPanelComponent);
    component = fixture.componentInstance;
    // tslint:disable-next-line: no-string-literal
    component['overlay'] = {
      openDocumentationDialog: () => { return ; }
    } as unknown as OverlayService;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onThicknessChange should call the method'
    + 'patchValue of brushForm', () => {
      const spy = spyOn(component['brushForm'], 'patchValue');
      component['onThicknessChange']();
      expect(spy).toHaveBeenCalled();
    });

  it('#onOptionChange should change the texture value in the service',
    () => {
      component['onOptionChange'](
        new MatRadioChange(component['radioChoice'], 'filter2')
      );
      expect(component['service'].texture).toEqual('filter2');
    });
});
