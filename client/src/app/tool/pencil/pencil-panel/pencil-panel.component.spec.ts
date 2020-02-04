import { CdkObserveContent } from '@angular/cdk/observers';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatSlider } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PencilPanelComponent } from './pencil-panel.component';

describe('PencilPanelComponent', () => {
  let component: PencilPanelComponent;
  let fixture: ComponentFixture<PencilPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PencilPanelComponent,
        MatSlider,
        MatInput,
        MatFormField,
        CdkObserveContent,

      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
