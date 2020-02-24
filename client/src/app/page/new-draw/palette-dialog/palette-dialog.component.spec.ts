import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteDialogComponent } from './palette-dialog.component';

describe('PaletteDialogComponent', () => {
  let component: PaletteDialogComponent;
  let fixture: ComponentFixture<PaletteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaletteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
