import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgToCanvas } from 'src/app/svg-to-canvas/svg-to-canvas';
import { Point } from '../../shape/common/point';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { BucketLogicComponent } from './bucket-logic.component';

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
      height: 1000,
      width: 1000,
      color: 'rgba(255, 255, 255, 1)'
    };

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component.svgStructure);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const createRectangle = (x: string, y: string, width: string, height: string) => {
    const renderer = component['renderer'];
    const rect = renderer.createElement('rect', 'http://www.w3.org/2000/svg') as SVGElement;
    renderer.setAttribute(rect, 'fill-opacity', '1');
    renderer.setAttribute(rect, 'fill', 'rgba(230, 25, 75, 1)');
    renderer.setAttribute(rect, 'stroke', 'rgba(110, 25, 75, 1)');
    renderer.setAttribute(rect, 'stroke-width', '4');
    renderer.setAttribute(rect, 'x', x);
    renderer.setAttribute(rect, 'y', y);
    renderer.setAttribute(rect, 'width', width);
    renderer.setAttribute(rect, 'height', height);
    return rect;
  };

  it('all the svg is colorized when the tolerance is at 100%', (done: DoneFn) => {

    component.svgStructure.drawZone.appendChild(
      createRectangle('100', '100', '500', '500')
    );
    component['service'].tolerance = 100;
    component['colorService'].primaryColor = 'rgba(0, 0, 255, 1)';
    component['onMouseClick'](
      {offsetX: 5, offsetY: 5} as unknown as MouseEvent
    ).then(() => {
      let allPixelsAreBlue = true;
      new SvgToCanvas(component['svgStructure'].root,
        component['svgShape'],
        component['renderer']
      ).getCanvas().then((canvas) => {
        const width = component['svgShape'].width;
        const height = component['svgShape'].height;
        const imageData = (canvas.getContext('2d') as CanvasRenderingContext2D)
          .getImageData(0, 0, width, height);
        for (let i = 0; i < width * height * 4; i += 4) {
          if (imageData.data[i] !== 0
            || imageData.data[i + 1] !== 0
            || imageData.data[i + 2] !== 255
            || imageData.data[i + 3] !== 255) {
            allPixelsAreBlue = false;
            break;
          }
        }
        expect(allPixelsAreBlue).toEqual(true);
        done();
      });
    });
  });

  it('Outside shapes should not be colorized when the tolerance is at 0%',
     (done: DoneFn) => {

    /*
    Creating this form and clicking two
    times inside the triangle
    **************************************
    *                                    *
    *                                    *
    *                *                   *
    *               * *                  *
    *              *   *                 *
    *             *     *                *
    *            *       *               *
    *           ***********              *
    *                                    *
    *                                    *
    **************************************
    */
    component.svgStructure.drawZone.appendChild(
      createRectangle('10', '10', '600', '600')
    );
    component.svgStructure.drawZone.innerHTML +=
      '<polygon fill-opacity="1"'
              + 'fill="rgba(230, 25, 75, 1)"'
              + 'stroke-width="2"'
              + 'stroke="rgba(240, 50, 230, 1)"'
              + 'points="157 279 361 279 259 102 "'
    + '></polygon>';
    component['service'].tolerance = 0;
    component['colorService'].primaryColor = 'rgba(255, 255, 25, 1)';

    component['onMouseClick'](
      { offsetX: 275, offsetY: 250 } as unknown as MouseEvent
    ).then(() => {
      component['onMouseClick'](
        { offsetX: 275, offsetY: 250 } as unknown as MouseEvent
      ).then(() => {
        new SvgToCanvas(component['svgStructure'].root,
          component['svgShape'],
          component['renderer']
        ).getCanvas().then((canvas) => {
          const width = component['svgShape'].width;
          const height = component['svgShape'].height;
          const imageData = (canvas.getContext('2d') as CanvasRenderingContext2D)
            .getImageData(0, 0, width, height);
          let point = new Point(275, 200);
          let position = (point.y * width + point.x) * 4;
          expect(
            imageData.data[position] === 255
            && imageData.data[position + 1] === 255
            && imageData.data[position + 2] === 25
            && imageData.data[position + 3] === 255
          ).toBeTruthy();
          point = new Point(20, 20);
          position = (point.y * width + point.x) * 4;
          expect(
            imageData.data[position] === 255
            && imageData.data[position + 1] === 255
            && imageData.data[position + 2] === 25
            && imageData.data[position + 3] === 255
          ).toBeFalsy();
          done();
        });
      });
    });
  });

  it('#onMouseClick should be call when a click is performed on the svg', async(() => {
    const event = new MouseEvent('click', {
      offsetX: 10,
      offsetY: 30,
      button: 0
    } as MouseEventInit);
    // tslint:disable-next-line: no-any
    const spy = spyOn<any>(component, 'onMouseClick');
    component.svgStructure.root.dispatchEvent(event);
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
    }, 20);
  }));

});
