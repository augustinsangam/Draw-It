import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {FormBuilder} from '@angular/forms';
import {PencilService} from '../pencil.service';
import { PencilPanelComponent } from './pencil-panel.component';

describe('PencilPanelComponent', () => {
  let component: PencilPanelComponent;
  let fixture: ComponentFixture<PencilPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencilPanelComponent ],
      providers: [
        PencilService,
        FormBuilder
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

  it ('pencilForm devrait avoir été créé correctement', () => {
    expect(component.pencilForm).toBeTruthy();
  });

  it ('onThicknessCahange devrait appeler patchValue', () => {
    const spy = spyOn(component.pencilForm, 'patchValue');
    component.onThicknessChange();
    expect(spy).toHaveBeenCalled();
  })

});
