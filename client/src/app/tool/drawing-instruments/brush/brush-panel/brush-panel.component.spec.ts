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
import { ColorPanelComponent } from '../../../color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from '../../../color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from '../../../color/color-panel/color-picker-item/color-picker-item.component';
import { BrushPanelComponent } from './brush-panel.component';

// On a besoin des string-literal pour accéder aux attributs privés
// tslint:disable: no-string-literal
describe('BrushPanelComponent', () => {
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onThicknessChange devrait appeler la méthode'
    + 'patchValue de brushForm', () => {
      const spy = spyOn(component['brushForm'], 'patchValue');
      component['onThicknessChange']();
      expect(spy).toHaveBeenCalled();
    });

  it('onOptionChange devrait changer la valeur de la texture du service',
    () => {
      component['onOptionChange'](
        new MatRadioChange(component['radioChoice'], 'filter2')
      );
      expect(component['service'].texture).toEqual('filter2');
    });
});
