import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { SelectionLogicComponent } from './selection-logic.component';

// tslint:disable: no-magic-numbers no-string-literal no-any
describe('Deplacement', () => {
  let component: SelectionLogicComponent;
  let fixture: ComponentFixture<SelectionLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionLogicComponent ],
      providers: [
        Renderer2
      ]
    }).compileComponents();
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
    expect(component['deplacement']).toBeTruthy();
  });


  // it('#KeyManager should contain all keypressed', () => {
  //   let fakeKeyDownEvent = {
  //     key: 'ArrowUp',
  //     preventDefault: () => { return ; }
  //   } as unknown as KeyboardEvent;
  //   component['keyManager'].handlers.keydown(fakeKeyDownEvent);
  //   expect(component['keyManager'].keyPressed).toContain('ArrowUp');
  //   fakeKeyDownEvent = {
  //     key: 'ArrowDown',
  //     preventDefault: () => { return ; }
  //   } as unknown as KeyboardEvent;
  //   component['keyManager'].handlers.keydown(fakeKeyDownEvent);
  //   expect(component['keyManager'].keyPressed).toContain('ArrowUp');
  //   expect(component['keyManager'].keyPressed).toContain('ArrowDown');
  // });

  // it('#KeyDown manager should consider only arrows', () => {
  //   const fakeKeyDownEvent = {
  //     key: 'ArrowUppppp',
  //     preventDefault: () => { return ; }
  //   } as unknown as KeyboardEvent;
  //   const spy = spyOn(fakeKeyDownEvent, 'preventDefault');
  //   component['keyManager'].handlers.keydown(fakeKeyDownEvent);
  //   expect(spy).not.toHaveBeenCalled();
  // });

  // it('#Translate should be done only after each 100 ms', fakeAsync(() => {
  //   const spy = spyOn<any>(component, 'handleKey').and.callThrough();
  //   const fakeKeyDownEvent = {
  //     key: 'ArrowUp',
  //     preventDefault: () => { return ; }
  //   } as unknown as KeyboardEvent;
  //   component['keyManager'].handlers.keydown(fakeKeyDownEvent);
  //   expect(spy).not.toHaveBeenCalled();
  //   setTimeout(() => {
  //     component['keyManager'].handlers.keydown(fakeKeyDownEvent);
  //   }, 200);
  //   tick(200);
  //   expect(spy).toHaveBeenCalled();
  //   component['keyManager'].handlers.keydown(fakeKeyDownEvent);
  // }));

  // it('#KeyUp handler should save the state only'
  //      + ' all arrows are released', fakeAsync(() => {
  //   const spy = spyOn(component['undoRedoService'], 'saveState');
  //   const arrowUpEvent = {
  //     key: 'ArrowUp',
  //     preventDefault: () => { return ; }
  //   } as unknown as KeyboardEvent;
  //   const arrowDownEvent = {
  //     key: 'ArrowDown',
  //     preventDefault: () => { return ; }
  //   } as unknown as KeyboardEvent;
  //   component['keyManager'].handlers.keydown(arrowUpEvent);
  //   component['keyManager'].handlers.keydown(arrowDownEvent);
  //   component['keyManager'].handlers.keyup(arrowUpEvent);
  //   expect(spy).not.toHaveBeenCalled();
  //   component['keyManager'].handlers.keyup(arrowDownEvent);
  //   expect(spy).toHaveBeenCalled();
  // }));


});
