import { CdkObserveContent } from '@angular/cdk/observers';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle, MatFormField, MatIcon, MatInput,
  MatRadioButton, MatRadioGroup, MatRipple, MatSlider, MatSlideToggle } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPanelComponent } from '../../color/color-panel/color-panel.component';
import { ColorPicklerContentComponent } from '../../color/color-panel/color-pickler-content/color-pickler-content.component';
import { ColorPicklerItemComponent } from '../../color/color-panel/color-pickler-item/color-pickler-item.component';
import { RectanglePanelComponent } from './rectangle-panel.component';

describe('RectanglePanelComponent', () => {
  let component: RectanglePanelComponent;
  let fixture: ComponentFixture<RectanglePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        CdkObserveContent,
        RectanglePanelComponent,
        MatInput,
        MatFormField,
        ColorPanelComponent,
        MatSlider,
        MatSlideToggle,
        MatRadioButton,
        ColorPicklerItemComponent,
        ColorPicklerContentComponent,
        MatIcon,
        MatRadioGroup,
        MatRipple,
        MatCard,
        MatCardContent,
        MatCardTitle
      ],
      schemas: [],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectanglePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
