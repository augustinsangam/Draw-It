import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder} from '@angular/forms';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

import {LinePanelComponent} from './line-panel.component';

fdescribe('LinePanelComponent', () => {
  let component: LinePanelComponent;
  let fixture: ComponentFixture<LinePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        LinePanelComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait changer l\'attribut withJonction du service à false', () => {
    component.service.withJonction = true;
    component.onChangeJonctionOption(new MatSlideToggleChange(component.slideToggle, false));
    expect(component.service.withJonction).toBeFalsy();
  });

  it('onThicknessChange devrait appeler la fonction patchValue', () => {
    const spy = spyOn(component.lineForm, 'patchValue');
    component.onThicknessChange();
    expect(spy).toHaveBeenCalled();
  });

  it('onRadiusChange devrait appeler la fonction patchValue', () => {
    const spy = spyOn(component.lineForm, 'patchValue');
    component.onRadiusChange();
    expect(spy).toHaveBeenCalled();
  });

});
