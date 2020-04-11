import { CdkObserveContent } from '@angular/cdk/observers';
import { Overlay } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCard, MatCardContent, MatCardTitle, MatFormField, MatIcon, MatInput,
  MatRadioButton, MatRadioGroup, MatRipple, MatSlider, MatSlideToggle, MatSnackBar
} from '@angular/material';
import { MatSlideToggleChange} from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayService } from 'src/app/overlay/overlay.service';
import {
  ColorPanelComponent
} from '../../../color/color-panel/color-panel.component';
import {
  ColorPickerContentComponent
// tslint:disable-next-line: max-line-length
} from '../../../color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
// tslint:disable-next-line: max-line-length
} from '../../../color/color-panel/color-picker-item/color-picker-item.component';
import { EllipsePanelComponent } from './ellipse-panel.component';

// tslint:disable: no-string-literal
fdescribe('EllipsePanelComponent', () => {
  let component: EllipsePanelComponent;
  let fixture: ComponentFixture<EllipsePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        CdkObserveContent,
        EllipsePanelComponent,
        MatInput,
        MatFormField,
        ColorPanelComponent,
        MatSlider,
        MatSlideToggle,
        MatRadioButton,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        MatIcon,
        MatRadioGroup,
        MatRipple,
        MatCard,
        MatCardContent,
        MatCardTitle
      ],
      providers: [
        MatSnackBar,
        Overlay
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipsePanelComponent);
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

  it('#onThicknessChange should call ' +
    'patchValue method of ellipseForm', () => {
    const spy = spyOn(component['ellipseForm'], 'patchValue');
    component['onThicknessChange']();
    expect(spy).toHaveBeenCalled();
  });

  it('#ngAfterViewChecked should have subscribed' +
    'borderOption and fillOption, and these values should ' +
    'change when MatSlideToggle changes to false',
    () => {
      component.ngAfterViewChecked();
      component['borderOptionRef'].change.emit(
        new MatSlideToggleChange(component['borderOptionRef'], false)
      );
      component['fillOptionRef'].change.emit(
        new MatSlideToggleChange(component['fillOptionRef'], false)
      );
      expect(component['service'].borderOption).toBeFalsy();
      expect(component['service'].fillOption).toBeFalsy();
    });

  it('#ngAfterViewChecked should have subscribed' +
    'borderOption and fillOption, and these values should ' +
    'change when MatSlideToggle changes to true',
    () => {
      component.ngAfterViewChecked();
      component['borderOptionRef'].change.emit(
        new MatSlideToggleChange(component['borderOptionRef'], true)
      );
      component['fillOptionRef'].change.emit(
        new MatSlideToggleChange(component['fillOptionRef'], true)
      );
      expect(component['service'].borderOption).toBeTruthy();
      expect(component['service'].fillOption).toBeTruthy();
    });

});
