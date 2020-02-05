import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { RectangleLogicComponent } from './rectangle-logic.component';

describe('RectangleLogicComponent', () => {
  let component: RectangleLogicComponent;
  let fixture: ComponentFixture<RectangleLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleLogicComponent, ToolLogicDirective ],
      imports: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleLogicComponent);
    component = fixture.componentInstance;
    component.svgElRef = new ElementRef<SVGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
