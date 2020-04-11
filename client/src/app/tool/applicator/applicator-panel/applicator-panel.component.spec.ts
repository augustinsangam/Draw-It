import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkObserveContent } from '@angular/cdk/observers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle,
  MatFormField, MatIcon, MatRadioButton,
  MatRadioGroup, MatRipple, MatSlider
} from '@angular/material';
import { ColorPanelComponent } from '../../color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from '../../color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from '../../color/color-panel/color-picker-item/color-picker-item.component';
import { ApplicatorPanelComponent } from './applicator-panel.component';
import { OverlayService } from 'src/app/overlay/overlay.service';

fdescribe('ApplicatorPanelComponent', () => {
  let component: ApplicatorPanelComponent;
  let fixture: ComponentFixture<ApplicatorPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ApplicatorPanelComponent,
        ColorPanelComponent,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        MatRadioGroup,
        MatRadioButton,
        MatIcon,
        MatCard,
        MatCardContent,
        MatCardTitle,
        MatSlider,
        MatFormField,
        MatRipple,
        CdkObserveContent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicatorPanelComponent);
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

  it('#showDocumentation should call openDocumentationDialog of overlay service', () => {
    const spy = spyOn(component['overlay'], 'openDocumentationDialog');
    // tslint:disable:next-line no-string-literal
    component['showDocumentation']();
    expect(spy).toHaveBeenCalled();
  });
});
