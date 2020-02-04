import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkObserveContent } from '@angular/cdk/observers';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle, MatDialogClose, MatFormField, MatGridList, MatIcon,
  MatInput, MatRadioButton, MatRadioGroup, MatRipple, MatSlider } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from 'src/app/sidebar/sidebar.component';
import { ColorPanelComponent } from '../../color/color-panel/color-panel.component';
import { ColorPicklerContentComponent } from '../../color/color-panel/color-pickler-content/color-pickler-content.component';
import { ColorPicklerItemComponent } from '../../color/color-panel/color-pickler-item/color-pickler-item.component';
import { BrushPanelComponent } from './brush-panel.component';

describe('BrushPanelComponent', () => {
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
