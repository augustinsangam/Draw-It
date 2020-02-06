import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentRef } from '@angular/core';
import { ToolLogicComponent } from '../tool/tool-logic/tool-logic.component';
import {Tool} from '../tool/tool.enum';
import { SvgComponent } from './svg.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { LineLogicComponent } from '../tool/line/line-logic/line-logic.component';

fdescribe('CanvasComponent', () => {
  let component: SvgComponent;
  let fixture: ComponentFixture<SvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SvgComponent,
        LineLogicComponent
      ],
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          LineLogicComponent,
        ]
      }
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#setTool should set the good value to the variable ref', () => {
    let refReturned: ComponentRef<ToolLogicComponent>;
    refReturned = component['setTool'](Tool.Line);
    expect(refReturned.instance.svgElRef).toEqual(component['elementRef']);
  });

  it('#ngOnInit should call onChange', () => {
    const spy = spyOn(component['toolSelectorService'], 'onChange');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

});
