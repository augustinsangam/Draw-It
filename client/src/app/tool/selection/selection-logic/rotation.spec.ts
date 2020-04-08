import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { SelectionLogicComponent } from './selection-logic.component';
import { Rotation } from './rotation';
import { Transform } from './transform';

// tslint:disable: no-magic-numbers no-string-literal no-any
describe('Rotate', () => {
  let component: SelectionLogicComponent;
  let fixture: ComponentFixture<SelectionLogicComponent>;
  let rotate: Rotation;

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
    rotate = new Rotation(component);
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
    expect(rotate).toBeTruthy();
  });

  it('#onRotate should call rotateAll() when the key SHIFT is not pressed', () => {
    const spy = spyOn<any>(rotate, 'rotateAll');

    const event = {deltaY: 53} as WheelEvent;

    rotate.onRotate(event);

    expect(spy).toHaveBeenCalledWith(15);
  });

  it('#onRotate should call allSelfRotate() when the key SHIFT is not pressed', () => {
    const spy = spyOn<any>(rotate, 'allSelfRotate');

    const event = {deltaY: 53} as WheelEvent;
    component.deplacement.keyManager.shift = true;

    rotate.onRotate(event);

    expect(spy).toHaveBeenCalledWith(15);
  });

  it('#onRotate should call rotateAll() with "1" when the key SHIFT is not pressed and ALT is', () => {
    const spy = spyOn<any>(rotate, 'rotateAll');

    const event = {deltaY: 53} as WheelEvent;
    component.deplacement.keyManager.alt = true;

    rotate.onRotate(event);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('#onRotate should call saveState() when there are selected elements', () => {
    const spy = spyOn(component.undoRedoService, 'saveState');

    const event = {deltaY: 53} as WheelEvent;
    component.service.selectedElements.add(
      component.svgStructure.drawZone.children.item(0) as SVGElement
    );

    rotate.onRotate(event);

    expect(spy).toHaveBeenCalled();
  });

  it('#rotateAll should call Transform.rotateAll twice and applyMultipleSelection once', () => {
    const spyRotateAll = spyOn(Transform, 'rotateAll');

    const spySelection = spyOn(component, 'applyMultipleSelection');

    rotate['rotateAll'](42);

    expect(spyRotateAll).toHaveBeenCalledTimes(2);
    expect(spySelection).toHaveBeenCalledTimes(1);
  });

  it('#allSelfRotate should call applyMultipleSelection once', () => {
    const spySelection = spyOn(component, 'applyMultipleSelection');
    component.service.selectedElements.add(
      component.svgStructure.drawZone.children.item(0) as SVGElement
    );
    rotate['allSelfRotate'](42);

    expect(spySelection).toHaveBeenCalledTimes(1);
  });
});
