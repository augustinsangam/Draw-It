import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//import { /*FormBuilder, */Form/*, Validators */} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { BrushPanelComponent } from './brush-panel.component';

describe('BrushPanelComponent', () => {
  let component: BrushPanelComponent;
  let fixture: ComponentFixture<BrushPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushPanelComponent ],
      imports: [MaterialModule]
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
