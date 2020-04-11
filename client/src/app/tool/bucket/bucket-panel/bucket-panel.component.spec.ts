import {
  CdkObserveContent
} from '@angular/cdk/observers';
import {
  async, ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatCard,
  MatCardContent,
  MatCardTitle,
  MatFormField,
  MatIcon,
  MatInput,
  MatRadioButton,
  MatRadioGroup,
  MatRipple,
  MatSlider,
  MatSlideToggle,
} from '@angular/material';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  ColorPanelComponent
} from '../../color/color-panel/color-panel.component';
import {
  ColorPickerContentComponent
} from '../../color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from '../../color/color-panel/color-picker-item/color-picker-item.component';
import {
  BucketPanelComponent
} from './bucket-panel.component';
import { OverlayService } from 'src/app/overlay/overlay.service';

describe('BucketPanelComponent', () => {
  let component: BucketPanelComponent;
  let fixture: ComponentFixture<BucketPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        BucketPanelComponent,
        MatSlider,
        MatSlideToggle,
        MatFormField,
        MatInput,
        ColorPanelComponent,
        MatRipple,
        CdkObserveContent,
        MatRadioButton,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        MatIcon,
        MatRadioGroup,
        MatCardTitle,
        MatCardContent,
        MatCard
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketPanelComponent);
    component = fixture.componentInstance;
    // tslint:disable-next-line: no-string-literal
    component['overlay'] = {
      openDocumentationDialog: () => { return ; }
    } as unknown as OverlayService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onThicknessChange should change the slider and'
    + 'update the service', () => {
    // tslint:disable: no-string-literal
    const spy = spyOn(component['bucketForm'], 'patchValue');
    const newValue = 25;
    component['toleranceSlider'].value = newValue;
    component['onToleranceChange']();
    expect(spy).toHaveBeenCalled();
    expect(component['service'].tolerance).toEqual(newValue);
  });

  it('#showDocumentation should call openDocumentationDialog of overlay service', () => {
    const spy = spyOn(component['overlay'], 'openDocumentationDialog');
    component['showDocumentation']();
    expect(spy).toHaveBeenCalled();
  });

});
