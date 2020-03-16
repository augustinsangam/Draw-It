// tslint:disable:no-string-literal

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BrowserDynamicTestingModule
} from '@angular/platform-browser-dynamic/testing';

import { MaterialModule } from '../material.module';
import { ColorBoxComponent } from '../tool/color/color-box/color-box.component';
import {
  ColorPanelComponent } from '../tool/color/color-panel/color-panel.component';
import {
  ColorPickerContentComponent
} from '../tool/color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from '../tool/color/color-panel/color-picker-item/color-picker-item.component';
import {
  LinePanelComponent
} from '../tool/shape/line/line-panel/line-panel.component';
import { Tool } from '../tool/tool.enum';
import { PanelComponent } from './panel.component';

// tslint:disable: no-any no-magic-numbers
describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColorBoxComponent,
        ColorPanelComponent,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        LinePanelComponent,
        PanelComponent,
      ],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          LinePanelComponent,
          ColorBoxComponent
        ],
      },
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle panel on same tool', () => {
    const spy = spyOn<any>(component, 'toggle');
    component.ngOnInit();
    component['toolSelectorService'].set(Tool._None);
    expect(spy).toHaveBeenCalled();
  });

  it('should toggle panel on change tool', () => {
    spyOn<any>(component, 'setTool').and.callFake(
      (tool: Tool) => expect(tool).toBe(Tool.Line));
    component.ngOnInit();
    component['toolSelectorService'].set(Tool.Line);
  });

  it('should open panel', () => {
    component['childWidth'] = 42;
    component['toggle']();
    expect(component['hostWidth']).toBe(42);
  });

  it('should close panel', () => {
    component['hostWidth'] = 42;
    component['toggle']();
    expect(component['hostWidth']).toBe(0);
  });

  it('should do nothing when tool is none on setTool', () => {
    const spy = spyOn(component['viewContainerRef'], 'clear').and.callThrough();
    component['setTool'](Tool._None);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should clear ViewContainerRef', () => {
    const spy = spyOn(component['viewContainerRef'], 'clear').and.callThrough();
    component['setTool'](Tool.Line);
    expect(spy).toHaveBeenCalled();
  });

  it('should set width', () => {
    component['setWidthOfChild'](42);
    expect(component['hostWidth']).toBe(42);
    expect(component['childWidth']).toBe(42);
  });

  it('should set width from setTool', () => {
    const refOrNull = component['setTool'](Tool.Line);
    if (!!refOrNull) {
      spyOn<any>(component, 'setWidthOfChild').and.callFake(
        (w: number) => expect(w).toBe(42));
      refOrNull.instance.width.emit(42);
    }
  });
});
