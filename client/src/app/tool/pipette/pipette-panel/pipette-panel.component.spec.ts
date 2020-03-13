import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material.module';
import {PanelComponent} from '../../../panel/panel.component';
import {ColorPanelComponent} from '../../color/color-panel/color-panel.component';
import {ColorPickerContentComponent} from '../../color/color-panel/color-picker-content/color-picker-content.component';
import {ColorPickerItemComponent} from '../../color/color-panel/color-picker-item/color-picker-item.component';
import { PipettePanelComponent } from './pipette-panel.component';

fdescribe('PipettePanelComponent', () => {
  let component: PipettePanelComponent;
  let fixture: ComponentFixture<PipettePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PipettePanelComponent,
        PanelComponent,
        ColorPanelComponent,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
      ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipettePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
