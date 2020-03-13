import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../../../material.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PanelComponent} from '../../../panel/panel.component';
import {ColorPanelComponent} from '../../color/color-panel/color-panel.component';
import {ColorPickerContentComponent} from '../../color/color-panel/color-picker-content/color-picker-content.component';
import {ColorPickerItemComponent} from '../../color/color-panel/color-picker-item/color-picker-item.component';
import { GridPanelComponent } from './grid-panel.component';

// tslint:disable:no-string-literal
describe('GridPanelComponent', () => {
  let component: GridPanelComponent;
  let fixture: ComponentFixture<GridPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
      ],
      declarations: [
        GridPanelComponent,
        ColorPanelComponent,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        PanelComponent
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('onSquareSizeChange should call the pacthValue and handleGrid methods', () => {
    const spyOnHandle = spyOn<any>(component['service'], 'handleGrid');
    const spyOnPatch = spyOn<any>(component['gridForm'], 'patchValue');
    component['onSquareSizeChange']();
    expect(spyOnHandle).toHaveBeenCalled();
    expect(spyOnPatch).toHaveBeenCalled();
  });

  it ('onOpacityChange should call the patchValue and handleGrid methods', () => {
    const spyOnHandle = spyOn<any>(component['service'], 'handleGrid');
    const spyOnPatch = spyOn<any>(component['gridForm'], 'patchValue');
    component['onSquareSizeChange']();
    expect(spyOnHandle).toHaveBeenCalled();
    expect(spyOnPatch).toHaveBeenCalled();
  });
});
