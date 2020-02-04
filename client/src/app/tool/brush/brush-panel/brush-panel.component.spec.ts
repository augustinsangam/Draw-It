import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrushPanelComponent } from './brush-panel.component';
import { MatSlider, MatFormField, MatRadioButton, MatRadioGroup, MatRipple, MatIcon, MatCardTitle,
  MatCardContent, MatCard, MatDialogClose, MatGridList, MatInput } from '@angular/material';
import { ColorPanelComponent } from '../../color/color-panel/color-panel.component';
import { CdkObserveContent } from '@angular/cdk/observers';
import { ColorPicklerItemComponent } from '../../color/color-panel/color-pickler-item/color-pickler-item.component';
import { ColorPicklerContentComponent } from '../../color/color-panel/color-pickler-content/color-pickler-content.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SidebarComponent } from 'src/app/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('BrushPanelComponent', () => {
  let component: BrushPanelComponent;
  let fixture: ComponentFixture<BrushPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        BrushPanelComponent,
        CdkObserveContent,
        ColorPanelComponent,
        ColorPicklerItemComponent,
        ColorPicklerContentComponent,
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
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
