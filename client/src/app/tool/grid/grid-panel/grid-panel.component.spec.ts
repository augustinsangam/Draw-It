import { CdkObserveContent } from '@angular/cdk/observers';
import { Overlay } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  MatSnackBar
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayService } from 'src/app/overlay/overlay.service';
import { PanelComponent } from '../../../panel/panel.component';
import { ColorPanelComponent } from '../../color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from '../../color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from '../../color/color-panel/color-picker-item/color-picker-item.component';
import { GridPanelComponent } from './grid-panel.component';

// tslint:disable:no-string-literal
fdescribe('GridPanelComponent', () => {
  let component: GridPanelComponent;
  let fixture: ComponentFixture<GridPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridPanelComponent,
        ColorPanelComponent,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        PanelComponent,
        MatInput,
        MatFormField,
        MatSlideToggle,
        MatSlider,
        MatIcon,
        MatRadioButton,
        MatRadioGroup,
        MatCard,
        MatCardTitle,
        MatCardContent,
        CdkObserveContent,
        MatRipple,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        MatSnackBar,
        Overlay
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPanelComponent);
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

  it('#onSquareSizeChange should call the pacthValue and handleGrid methods', () => {
    component['squareSizeSlider'] = { value: 5 } as unknown as MatSlider;
    const spyOnHandle = spyOn(component['service'], 'handleGrid');
    const spyOnPatch = spyOn(component['gridForm'], 'patchValue');
    component['onSquareSizeChange']();
    expect(spyOnHandle).toHaveBeenCalled();
    expect(spyOnPatch).toHaveBeenCalled();
  });

  it('#onOpacityChange should call the patchValue and handleGrid methods', () => {
    component['opacitySlider'] = { value: 5 } as unknown as MatSlider;
    const spyOnHandle = spyOn(component['service'], 'handleGrid');
    const spyOnPatch = spyOn(component['gridForm'], 'patchValue');
    component['onOpacityChange']();
    expect(spyOnHandle).toHaveBeenCalled();
    expect(spyOnPatch).toHaveBeenCalled();
  });

  it('#onActiveChange should call the patchValue and handleGrid methods', () => {
    component['activeToggleRef'] = { checked: true } as unknown as MatSlideToggle;
    const spyOnHandle = spyOn(component['service'], 'handleGrid');
    const spyOnPatch = spyOn(component['gridForm'], 'patchValue');
    component['onActiveChange']();
    expect(spyOnHandle).toHaveBeenCalled();
    expect(spyOnPatch).toHaveBeenCalled();
  });

  it('#showDocumentation should call openDocumentationDialog of overlay service', () => {
    const spy = spyOn(component['overlay'], 'openDocumentationDialog');
    component['showDocumentation']();
    expect(spy).toHaveBeenCalled();
  });
});
