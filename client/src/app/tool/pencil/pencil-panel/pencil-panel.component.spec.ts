import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {FormBuilder, FormsModule} from '@angular/forms';
import {PencilService} from '../pencil.service';
import { PencilPanelComponent } from './pencil-panel.component';

fdescribe('PencilPanelComponent', () => {
  let component: PencilPanelComponent;
  let fixture: ComponentFixture<PencilPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencilPanelComponent ],
      providers: [
        FormsModule,
        PencilService,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
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
