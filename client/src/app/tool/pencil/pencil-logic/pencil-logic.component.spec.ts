import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilLogicComponent } from './pencil-logic.component';
import { Renderer2, ElementRef } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { PencilService } from '../pencil.service';

fdescribe('PencilLogicComponent', () => {
  let component: PencilLogicComponent;
  let fixture: ComponentFixture<PencilLogicComponent>;
  let renderer: Renderer2;
  let colorService: ColorService;
  let pencilService: PencilService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencilLogicComponent ],
      providers: [Renderer2, ColorService, PencilService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilLogicComponent);
    component = fixture.componentInstance;
    component.svgElRef = new ElementRef<SVGElement>(
      document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    );
    renderer = fixture.componentInstance.renderer;
    colorService = fixture.componentInstance.colorService;
    pencilService = fixture.componentInstance.pencilService;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
