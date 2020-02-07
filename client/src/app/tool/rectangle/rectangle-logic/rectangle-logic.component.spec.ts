import { ElementRef, Renderer2 } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ColorService } from '../../color/color.service';
import {Point} from '../../tool-common classes/Point'
import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { RectangleService } from '../rectangle.service';
import { RectangleLogicComponent } from './rectangle-logic.component';

describe('RectangleLogicComponent', () => {
  let component: RectangleLogicComponent;
  let fixture: ComponentFixture<RectangleLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleLogicComponent, ToolLogicComponent ],
      providers: [Renderer2, ColorService, RectangleService ]
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

  it('#currentPoint should be equal to the mouse coordinates', fakeAsync(() => {
    const mouseEv: MouseEvent = new MouseEvent('mousedown', { offsetX: 10, offsetY: 30, button: 0 } as MouseEventInit);
    const pointExpected: Point = {x: mouseEv.offsetX, y: mouseEv.offsetY};
    component.initRectangle(mouseEv);
    expect(component['currentPoint']).toEqual(pointExpected);
  }));
});
