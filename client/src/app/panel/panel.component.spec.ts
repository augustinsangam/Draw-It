import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelComponent } from './panel.component';
// import { Tool } from '../tool/tool.enum';

fdescribe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('#setTool should change component to tool', () => {
  //   const tool: Tool = Tool.Brush;

  //   const spy = spyOn(component, 'setTool')
  // })
});
