import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from 'src/app/material.module';
import { GalleryCardComponent } from './gallery-card.component';

describe('GalleryCardComponent', () => {
  let component: GalleryCardComponent;
  let fixture: ComponentFixture<GalleryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GalleryCardComponent,
      ],
      imports: [
        MaterialModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryCardComponent);
    component = fixture.componentInstance;
    component.draw = {
      header: {
        id: 0,
        name: '',
        tags: [],
      },
      shape: {
        height: 0,
        width: 0,
        color: '#FFFFFF'
      },
      svg: new SVGGElement(),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
