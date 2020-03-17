import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {FormBuilder, FormsModule} from '@angular/forms';
import {PencilService} from '../pencil.service';
import { PencilPanelComponent } from './pencil-panel.component';

// TODO : Ask the chargé de lab
// tslint:disable: no-string-literal
describe('PencilPanelComponent', () => {
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

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it ('pencilForm have been created correctly', () => {
    expect(component['pencilForm']).toBeTruthy();
  });

  it ('onThicknessCahange should call patchValue', () => {
    const spy = spyOn(component['pencilForm'], 'patchValue');
    component['onThicknessChange']();
    expect(spy).toHaveBeenCalled();
  });

});
