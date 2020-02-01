import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/material.module';
import { ColorPicklerItemComponent } from '../color-pickler-item/color-pickler-item.component';
import { ColorPicklerContentComponent } from './color-pickler-content.component';

describe('ColorPicklerContentComponent', () => {
  let component: ColorPicklerContentComponent;
  let fixture: ComponentFixture<ColorPicklerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPicklerContentComponent, ColorPicklerItemComponent ],
      imports: [MaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPicklerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
