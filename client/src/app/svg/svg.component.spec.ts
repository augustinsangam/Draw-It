import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgComponent } from './svg.component';
import {Tool} from "../tool/tool.enum";

fdescribe('CanvasComponent', () => {
  let component: SvgComponent;
  let fixture: ComponentFixture<SvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SvgComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('asddd', () => {
    const spy = spyOn(component["viewContainerRef"], 'createComponent');
    component["setTool"](Tool.Line);
    expect(spy).toHaveBeenCalled();
  })

});
