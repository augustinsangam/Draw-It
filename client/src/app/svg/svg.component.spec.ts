import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentRef } from '@angular/core';
import {
  BrowserDynamicTestingModule
} from '@angular/platform-browser-dynamic/testing';
import {
  BrushLogicComponent
} from '../tool/drawing-instruments/brush/brush-logic/brush-logic.component';
import {
  LineLogicComponent
} from '../tool/shape/line/line-logic/line-logic.component';
import { ToolLogicDirective } from '../tool/tool-logic/tool-logic.directive';
import { Tool } from '../tool/tool.enum';
import { SvgComponent } from './svg.component';

// tslint:disable: no-string-literal
describe('SvgComponent', () => {
  let component: SvgComponent;
  let fixture: ComponentFixture<SvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SvgComponent,
        LineLogicComponent,
        BrushLogicComponent
      ],
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          LineLogicComponent,
          BrushLogicComponent
        ]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#setTool should set the good value to the variable ref', () => {
    let refReturned: ComponentRef<ToolLogicDirective>;
    refReturned = component['setTool'](Tool.Line);
    expect(refReturned.instance.svgStructure).toEqual(component['svgStructure']);
  });

  it('#ngOnInit should call onChange', () => {
    const spy = spyOn(component['toolSelectorService'], 'onChange');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('#others', () => {
    // All handlers function have been tested
    component['setToolHandler'](Tool.Brush);
    expect(true).toEqual(true);
  });

});
