import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { BucketLogicComponent } from './bucket-logic.component';
// import { SvgToCanvas } from 'src/app/svg-to-canvas/svg-to-canvas';

// tslint:disable: no-string-literal no-magic-numbers
describe('BucketLogicComponent', () => {
  let component: BucketLogicComponent;
  let fixture: ComponentFixture<BucketLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketLogicComponent);
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

    component.svgStructure.root.setAttribute('height', '1000');
    component.svgStructure.root.setAttribute('width', '1000');
    component.svgStructure.root.style.backgroundColor = 'rgba(255, 255, 255, 1)';

    component.svgShape = {
      height: 500,
      width: 200,
      color: 'rgba(255, 255, 255, 1)'
    };

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component.svgStructure);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // const createSquare = (x: string, y: string, size: string) => {
  //   component['service'].tolerance = 100;
  //   const renderer = component['renderer'];
  //   const rect = renderer.createElement('rect') as SVGElement;
  //   renderer.setAttribute(rect, 'fill-opacity', '1');
  //   renderer.setAttribute(rect, 'fill', 'rgba(230, 25, 75, 1)');
  //   renderer.setAttribute(rect, 'stroke', 'rgba(110, 25, 75, 1)');
  //   renderer.setAttribute(rect, 'stroke-width', '4');
  //   renderer.setAttribute(rect, 'x', x);
  //   renderer.setAttribute(rect, 'y', y);
  //   renderer.setAttribute(rect, 'width', size);
  //   renderer.setAttribute(rect, 'height', size);
  //   return rect;
  // };

  // it('all the svg is colored when the tolerance is at 100%', () => {
  //   component.svgStructure.drawZone.appendChild(
  //     createSquare('100', '100', '500')
  //   );
  //   component['onMouseClick']({offsetX: 200, offsetY: 200} as unknown as MouseEvent);
  //   new SvgToCanvas(component['svgStructure'].root,
  //                   component['svgShape'],
  //                   component['renderer']
  //   ).getCanvas().then((canvas) => {
  //     const imageData = (canvas.getContext('2d') as CanvasRenderingContext2D)
  //       .getImageData(0, 0, 200, 200)
  //   });
  // });

});
