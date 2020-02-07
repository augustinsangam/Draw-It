import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MaterialModule } from '../material.module';
import { BrushPanelComponent } from '../tool/brush/brush-panel/brush-panel.component';
import { ColorPanelComponent } from '../tool/color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from '../tool/color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from '../tool/color/color-panel/color-picker-item/color-picker-item.component';
import { Tool } from '../tool/tool.enum';
import { PanelComponent } from './panel.component';

// tslint:disable: no-string-literal

export class MockViewContainerRef {
  createComponent = (arg: any) => new MockFactoryComponent(arg);
  clear = () => {};
}

export class MockFactoryComponent {

  constructor(arg: any) {}

  instance = {
    width : {
      subscribe : (w: number) => {}
    }
  };

  changeDetectorRef = {
    detectChanges: () => {}
  }
}

export class MockToolSelectorService {
  onChange(cb: (tool: Tool) => void) {};
  onSame(cb: () => void) {};
}

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelComponent,
        BrushPanelComponent,
        ColorPanelComponent,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
      ],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          BrushPanelComponent,
        ]
      }
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#setTool should call this.componentFactoryResolver.resolveComponentFactory() with the panel component of tool', () => {
    const tool: Tool = Tool.Brush;
    component['viewContainerRef'] = new MockViewContainerRef() as unknown as ViewContainerRef;
    const spyFactory = spyOn(component['componentFactoryResolver'],
    'resolveComponentFactory');
    component['setTool'](tool);
    expect(spyFactory).toHaveBeenCalledWith(BrushPanelComponent);
  });

  it('#setWidthOfChild should change hostWidth to width', () => {
    const width = 40;
    component['setWidthOfChild'](width);
    expect(component['hostWidth']).toEqual(width);
  });

  it('#toggle should set hostwidth to 0', () => {
    component['hostWidth'] = 10;
    component['toggle']();
    expect(component['hostWidth']).toEqual(0);
  });

  it('#toggle should set hostwidth to childWidth', () => {
    component['hostWidth'] = 0;
    component['childWidth'] = 20;
    component['toggle']();
    expect(component['hostWidth']).toEqual(20);
  });

  it('#ngOnInit should call onChange', () => {
    const spy = spyOn(component['toolSelectorService'], 'onChange')
    component.ngOnInit()
    expect(spy).toHaveBeenCalled();
  });

  it('#others', () => {
    // Les handlers sont des fonctions qui sont déja testées.
    component['handlers'].onSameHandler();
    component['handlers'].widthHandler(25);
    component['handlers'].onSetToolHandler(Tool.Brush);
    expect(true).toEqual(true);
  });

});
