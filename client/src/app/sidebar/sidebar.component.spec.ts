/* tslint:disable:no-string-literal */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA} from '@angular/core';
import {MatLabel} from '@angular/material';
import {ToolSelectorService} from '../tool/tool-selector/tool-selector.service';
import {Tool} from '../tool/tool.enum';
import {SidebarComponent} from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MatLabel,
        SidebarComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        ToolSelectorService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectTool on tool change', (done) => {
    // stackoverflow.com/a/48734437
    spyOn<any>(component, 'selectTool').and.callFake((tool: Tool) => {
      expect(tool).toBe(Tool.Line);
      done();
    });
    component.ngAfterViewInit();
    component['toolSelectorService'].set(Tool.Line);
  });

  it('selectTool with second argument null should do nothing', () => {
    const oldHtmlEl = document.createElement('a');
    oldHtmlEl.classList.add('selected');
    const oldElRef = new ElementRef(oldHtmlEl);
    component['toolToElRef'].set(Tool.Line, oldElRef);

    const newHtmlEl = document.createElement('a');
    const newElRef = new ElementRef(newHtmlEl);
    component['toolToElRef'].set(Tool.Rectangle, newElRef);

    component['selectTool'](Tool._None);
    expect(oldHtmlEl.classList.contains('selected')).toBeTruthy();
    expect(newHtmlEl.classList.contains('selected')).toBeFalsy();
  });

  it('selectTool with tools none should do nothing', () => {
    const oldHtmlEl = document.createElement('a');
    oldHtmlEl.classList.add('selected');
    const oldElRef = new ElementRef(oldHtmlEl);
    component['toolToElRef'].set(Tool.Line, oldElRef);

    const newHtmlEl = document.createElement('a');
    const newElRef = new ElementRef(newHtmlEl);
    component['toolToElRef'].set(Tool.Rectangle, newElRef);

    component['selectTool'](Tool._None, Tool._None);
    expect(oldHtmlEl.classList.contains('selected')).toBeTruthy();
    expect(newHtmlEl.classList.contains('selected')).toBeFalsy();
  });

  it('selectTool should remove .selected from old element' +
    'and append .selected to new element', () => {
    const oldHtmlEl = document.createElement('a');
    oldHtmlEl.classList.add('selected');
    const oldElRef = new ElementRef(oldHtmlEl);
    component['toolToElRef'].set(Tool.Line, oldElRef);

    const newHtmlEl = document.createElement('a');
    const newElRef = new ElementRef(newHtmlEl);
    component['toolToElRef'].set(Tool.Rectangle, newElRef);

    component['selectTool'](Tool.Rectangle, Tool.Line);
    expect(oldHtmlEl.classList.contains('selected')).toBeFalsy();
    expect(newHtmlEl.classList.contains('selected')).toBeTruthy();
  });

  it('selectLine devrait appeler ToolSelectorService.set', () => {
    const spy = spyOn(component['toolSelectorService'], 'set');
    component['selectLine']();
    expect(spy).toHaveBeenCalled();
  });

  it('selectRectangle devrait appeler ToolSelectorService.set', () => {
    const spy = spyOn(component['toolSelectorService'], 'set');
    component['selectRectangle']();
    expect(spy).toHaveBeenCalled();
  });

  it('selectPencil devrait appeler ToolSelectorService.set', () => {
    const spy = spyOn(component['toolSelectorService'], 'set');
    component['selectPencil']();
    expect(spy).toHaveBeenCalled();
  });

  it('selectBrush devrait appeler ToolSelectorService.set', () => {
    const spy = spyOn(component['toolSelectorService'], 'set');
    component['selectBrush']();
    expect(spy).toHaveBeenCalled();
  });

  // TODO
  /*it('emit de documentationClicsk devrait avoir été appelé lors de l\'appel de onClick', () => {
    const spy = spyOn(component.documentationClick, 'emit');
    component.onClick(new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });*/

});
