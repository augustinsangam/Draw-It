import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ColorPanelComponent } from '../color-panel/color-panel.component';
import { ColorPickerContentComponent } from '../color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from '../color-panel/color-picker-item/color-picker-item.component';
import { ColorBoxComponent } from './color-box.component';

describe('ColorBoxComponent', () => {
  let component: ColorBoxComponent;
  let fixture: ComponentFixture<ColorBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColorBoxComponent,
        ColorPanelComponent,
        ColorPickerContentComponent,
        ColorPickerItemComponent
      ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });
});
