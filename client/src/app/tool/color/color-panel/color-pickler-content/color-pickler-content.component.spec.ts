import { CdkObserveContent } from '@angular/cdk/observers';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatCard, MatCardContent, MatCardTitle, MatFormField, MatInput, MatRipple, MatSlider } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPicklerItemComponent } from '../color-pickler-item/color-pickler-item.component';
import { ColorPicklerContentComponent } from './color-pickler-content.component';

describe('ColorPicklerContentComponent', () => {
  let component: ColorPicklerContentComponent;
  let fixture: ComponentFixture<ColorPicklerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColorPicklerContentComponent,
        ColorPicklerItemComponent,
        MatInput,
        MatFormField,
        MatSlider,
        MatButton,
        MatCard,
        MatCardTitle,
        MatCardContent,
        CdkObserveContent,
        MatRipple
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPicklerContentComponent);
    component = fixture.componentInstance;
    component.startColor = '#FFFFFF';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
