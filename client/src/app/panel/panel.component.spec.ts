import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MaterialModule } from '../material.module';
import { BrushPanelComponent } from '../tool/brush/brush-panel/brush-panel.component';
import { ColorPanelComponent } from '../tool/color/color-panel/color-panel.component';
import { ColorPicklerContentComponent } from '../tool/color/color-panel/color-pickler-content/color-pickler-content.component';
import { ColorPicklerItemComponent } from '../tool/color/color-panel/color-pickler-item/color-pickler-item.component';
import { Tool } from '../tool/tool.enum';
import { PanelComponent } from './panel.component';
// import { ViewContainerRef } from '@angular/core';
// import { ComponentFactory } from '@angular/core';
// import { ToolPanelComponent } from '../tool/tool-panel/tool-panel.component';

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
        ColorPicklerItemComponent,
        ColorPicklerContentComponent,
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
    // tslint:disable-next-line: no-string-literal
    component['viewContainerRef'] = new MockViewContainerRef() as unknown as ViewContainerRef;

    // Cet attribut est privé, mais est utile pour vérifier l'exécution de la méthode.
    // tslint:disable-next-line: no-string-literal
    const spyFactory = spyOn(component['componentFactoryResolver'],
    'resolveComponentFactory');

    // const spy = spyOn(component['viewContainerRef'], 'createComponent');
    // tslint:disable-next-line: no-string-literal
    // console.log(spy);
    // const sypref
    // Méthode privée. Impossible de tester autrement.
    // tslint:disable-next-line: no-string-literal
    component['setTool'](tool);

    expect(spyFactory).toHaveBeenCalledWith(BrushPanelComponent);
  });

  it('#setWidthOfChild should change hostWidth to width', () => {
    const width = 40;

    // Méthode privée.
    // tslint:disable-next-line: no-string-literal
    component['setWidthOfChild'](width);

    // tslint:disable-next-line: no-string-literal
    expect(component['hostWidth']).toEqual(width);
  });

  it('#toggle should set hostwidth to 0', () => {

    // tslint:disable-next-line: no-string-literal
    component['hostWidth'] = 10;

    // Méthode privée.
    // tslint:disable-next-line: no-string-literal
    component['toggle']();

    // tslint:disable-next-line: no-string-literal
    expect(component['hostWidth']).toEqual(0);
  });

  it('#toggle should set hostwidth to childWidth', () => {

    // tslint:disable-next-line: no-string-literal
    component['hostWidth'] = 0;

    // Attribut privé.
    // tslint:disable-next-line: no-string-literal
    component['childWidth'] = 20;

    // Méthode privée.
    // tslint:disable-next-line: no-string-literal
    component['toggle']();

    // tslint:disable-next-line: no-string-literal
    expect(component['hostWidth']).toEqual(20);
  });

  it('#ngOnInit should call onChange', () => {

    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(component['toolSelectorService'], 'onChange')

    component.ngOnInit()

    expect(spy).toHaveBeenCalled();
  })
});
