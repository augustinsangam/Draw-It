import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipetteLogicComponent } from './pipette-logic.component';

describe('PipetteLogicComponent', () => {
  let component: PipetteLogicComponent;
  let fixture: ComponentFixture<PipetteLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipetteLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipetteLogicComponent);
    component = fixture.componentInstance;
    const testSvgStructure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    testSvgStructure.root.appendChild(component.svgStructure.defsZone);
    testSvgStructure.root.appendChild(component.svgStructure.drawZone);
    testSvgStructure.root.appendChild(component.svgStructure.temporaryZone);
    testSvgStructure.root.appendChild(component.svgStructure.endZone);

    component.svgStructure = testSvgStructure;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
