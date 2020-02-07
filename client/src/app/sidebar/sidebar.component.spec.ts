/* tslint:disable:no-string-literal */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
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

  it('selectTool devrait appeler la méthode set ' +
    'du service sur un appel d\'un DOMTokenListe existant', () => {
    const spy = spyOn(component['toolSelectorService'], 'set');

    const htmlElement = document.createElement('a');
    htmlElement.setAttribute('title', 'Ligne');
    htmlElement.setAttribute('style', '"background-image:url(/assets/gimp-tool-pencil.png)"');

    component.selectTool(Tool.Line, htmlElement);
    expect(spy).toHaveBeenCalled();
  });

  it('selectTool devrait appeler la méthode set ' +
    'du service sur un appel d\'un DOMTokenList non existant', () => {
    const spy = spyOn(component['toolSelectorService'], 'set');

    const htmlElement = document.createElement('a');
    htmlElement.setAttribute('title', 'Ligne');
    htmlElement.setAttribute('style', '"background-image:url(/assets/gimp-tool-pencil.png)"');

    const param = document.querySelector('a');
    // @ts-ignore
    component['selectedElDOMTokenList'] =  param.classList;
    component['selectedElDOMTokenList'].add('asdasdasdasdasdassda');

    component.selectTool(Tool.Line, htmlElement);
    expect(spy).toHaveBeenCalled();
  });

  it('selectPencil devrait appeler selectTool', () => {
    const spy = spyOn(component, 'selectTool');
    component.selectPencil({target: null} as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('selectBrush devrait appeler selectTool', () => {
    const spy = spyOn(component, 'selectTool');
    component.selectBrush({target: null} as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('selectLine devrait appeler selectTool', () => {
    const spy = spyOn(component, 'selectTool');
    component.selectLine({target: null} as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('selectLine devrait appeler selectTool', () => {
    const spy = spyOn(component, 'selectTool');
    component.selectLine({target: null} as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('selectRectangle devrait appeler selectTool', () => {
    const spy = spyOn(component, 'selectTool');
    component.selectRectangle({target: null} as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('emit de documentationClicsk devrait avoir été appelé lors de l\'appel de onClick', () => {
    const spy = spyOn(component.documentationClick, 'emit');
    component.onClick(new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });

});
