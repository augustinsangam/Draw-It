import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { ApplicatorLogicComponent } from './applicator-logic.component';

// TODO : Ask the chargé de lab
// tslint:disable: no-string-literal
describe('ApplicatorLogicComponent', () => {
  let component: ApplicatorLogicComponent;
  let fixture: ComponentFixture<ApplicatorLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicatorLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApplicatorLogicComponent);
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

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component.svgStructure);

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
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('right click can change the stroke color '
    + 'to the general secondary color', () => {
    const target = component.svgStructure.drawZone.children.item(0) as
      SVGElement;
    const fakeEvent = {
      target,
      preventDefault: () => { }
    } as unknown as MouseEvent;
    component['handlers'].right(fakeEvent);
    expect(target.getAttribute('stroke'))
      .toEqual(component['colorService'].secondaryColor);
  });

  it('right click should not do anything'
    + 'when the target is not a draw', () => {
    const target = component.svgStructure.endZone as
      SVGElement;
    const fakeEvent = {
      target,
      preventDefault: () => { }
    } as unknown as MouseEvent;
    const spy = spyOn(target, 'setAttribute');
    component['handlers'].right(fakeEvent);
    expect(spy).not.toHaveBeenCalled();
  });

  it('left click should not do anything'
    + 'when the target is not a draw', () => {
    const target = component.svgStructure.endZone as
      SVGElement;
    const fakeEvent = {
      target,
      preventDefault: () => { }
    } as unknown as MouseEvent;
    const spy = spyOn(target, 'setAttribute');
    component['handlers'].left(fakeEvent);
    expect(spy).not.toHaveBeenCalled();
  });

  it('left click can change the stroke color to the general'
    + ' secondary color for non path filled SVGElement', () => {
    const target = component.svgStructure.drawZone.children.item(0) as
      SVGElement;
    target.setAttribute('fill', '#FFFFFF');
    const fakeEvent = {
      target,
    } as unknown as MouseEvent;
    component['handlers'].left(fakeEvent);
    expect(target.getAttribute('fill'))
      .toEqual(component['colorService'].primaryColor);
  });

  it('left click cannot change the stroke color to the general'
    + ' secondary color for non path non-filled SVGElement', () => {
    const target = component.svgStructure.drawZone.children.item(0) as
      SVGElement;
    const fakeEvent = {
      target,
    } as unknown as MouseEvent;
    component['handlers'].left(fakeEvent);
    expect(target.getAttribute('fill'))
      .not.toEqual(component['colorService'].primaryColor);
  });

  it('left click can change the stroke color '
    + 'to the general secondary color SVGPathElement', () => {
    const target = document.createElementNS(
      'http://www.w3.org/2000/svg', 'svg:path');
    component['svgStructure'].drawZone.appendChild(target);
    const fakeEvent = {
      target,
    } as unknown as MouseEvent;
    component['handlers'].left(fakeEvent);
    expect(target.getAttribute('stroke'))
      .toEqual(component['colorService'].primaryColor);
  });

});
