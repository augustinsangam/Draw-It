import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { Rotation } from './rotation';
import { SelectionLogicComponent } from './selection-logic.component';

// tslint:disable: no-magic-numbers no-string-literal no-any
describe('Rotation', () => {
  let component: SelectionLogicComponent;
  let fixture: ComponentFixture<SelectionLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionLogicComponent ],
      providers: [
        Renderer2
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionLogicComponent);
    component = fixture.componentInstance;
    component.svgStructure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    component.svgStructure.root.appendChild(component.svgStructure.defsZone);
    component.svgStructure.root.appendChild(component.svgStructure.drawZone);
    component.svgStructure.root.appendChild(component.svgStructure.temporaryZone);
    component.svgStructure.root.appendChild(component.svgStructure.endZone);

    const rec1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec1.setAttribute('x', '2');
    rec1.setAttribute('y', '3');
    rec1.setAttribute('width', '100');
    rec1.setAttribute('height', '100');
    rec1.setAttribute('stroke-width', '5');
    const rec2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec2.setAttribute('x', '22');
    rec2.setAttribute('y', '30');
    rec2.setAttribute('width', '100');
    rec2.setAttribute('height', '100');
    rec2.style.strokeWidth = '2';
    const rec3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec3.classList.add('filter1');
    component.svgStructure.drawZone.appendChild(rec1);
    component.svgStructure.drawZone.appendChild(rec2);
    component.svgStructure.drawZone.appendChild(rec3);

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component.svgStructure);

    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(new Rotation(component)).toBeTruthy();
  });

});
