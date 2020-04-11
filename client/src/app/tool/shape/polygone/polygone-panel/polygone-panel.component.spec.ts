import { CdkObserveContent } from '@angular/cdk/observers';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCard, MatCardContent, MatCardTitle, MatFormField, MatIcon, MatInput,
  MatRadioButton, MatRadioGroup, MatRipple, MatSlider, MatSlideToggle, MatSlideToggleChange
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ColorPanelComponent
} from '../../../color/color-panel/color-panel.component';
import {
  ColorPickerContentComponent
} from '../../../color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from '../../../color/color-panel/color-picker-item/color-picker-item.component';
import { PolygonePanelComponent } from './polygone-panel.component';
import { OverlayService } from 'src/app/overlay/overlay.service';

// tslint:disable: no-string-literal
describe('PolygonePanelComponent', () => {
  let component: PolygonePanelComponent;
  let fixture: ComponentFixture<PolygonePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        CdkObserveContent,
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
        MatCardTitle,
        PolygonePanelComponent
      ],
      schemas: [],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonePanelComponent);
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

  it('#onThicknessChange should call the patchValue method ' +
    'of polygoneForm', () => {
    const spy = spyOn(component['polygoneForm'], 'patchValue');
    component['onThicknessChange']();
    expect(spy).toHaveBeenCalled();
  });

  it('#onSidesChange should call the method patcHvalue ' +
    'of polygoneForm', () => {
    const spy = spyOn(component['polygoneForm'], 'patchValue');
    component['onSidesChange']();
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

  it('#showDocumentation should call openDocumentationDialog of overlay service', () => {
    const spy = spyOn(component['overlay'], 'openDocumentationDialog');
    component['showDocumentation']();
    expect(spy).toHaveBeenCalled();
  });

});
