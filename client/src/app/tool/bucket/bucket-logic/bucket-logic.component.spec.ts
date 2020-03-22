import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgToCanvas } from 'src/app/svg-to-canvas/svg-to-canvas';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { BucketLogicComponent } from './bucket-logic.component';
import { Point } from '../../shape/common/point';

// tslint:disable: no-string-literal no-magic-numbers
fdescribe('BucketLogicComponent', () => {
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

  it('all the svg is colorized when the tolerance is at 100%', async(() => {

    component.svgStructure.drawZone.appendChild(
      createRectangle('100', '100', '500', '500')
    );

    component['service'].tolerance = 100;
    component['colorService'].primaryColor = 'rgba(0, 0, 255, 1)';
    component['onMouseClick']({offsetX: 5, offsetY: 5} as unknown as MouseEvent);

    let allPixelsAreBlue = true;

    setTimeout(() => {
      new SvgToCanvas(component['svgStructure'].root,
        component['svgShape'],
        component['renderer']
      ).getCanvas().then((canvas) => {
        document.body.appendChild(canvas);
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
            console.log(`${imageData.data[i]} ${imageData.data[i + 1]} ${imageData.data[i + 2]} ${imageData.data[i + 3]}`)
            console.log(`Breaked at ${i / 4}`);
            break;
          }
        }
        expect(allPixelsAreBlue).toEqual(true);
      });
    }, 200);

  }));

  it('Inside shapes should not be colorized when the tolerance is at 0%',
      async(() => {

    // Creating this form
    /*
    **************************************
    *                                    *
    *   *****   ************      *****  *
    *   *   *   *          *      *   *  *
    *   *   *   ************      *   *  *
    *   *   *                     *   *  *
    *   *   *   ****************  *   *  *
    *   *   *   *              *  *   *  *
    *   *   *   ****************  *   *  *
    *   *****                     *****  *
    **************************************
    */
    component.svgStructure.drawZone.appendChild(
      createRectangle('0', '0', '990', '990')
    );
    component.svgStructure.drawZone.appendChild(
      createRectangle('100', '100', '100', '600')
    );
    component.svgStructure.drawZone.appendChild(
      createRectangle('250', '100', '400', '200')
    );
    component.svgStructure.drawZone.appendChild(
      createRectangle('250', '400', '500', '200')
    );
    component.svgStructure.drawZone.appendChild(
      createRectangle('760', '200', '190', '600')
    );
    component['service'].tolerance = 0;
    component['colorService'].primaryColor = 'rgba(0, 0, 255, 1)';
    component['onMouseClick']({offsetX: 10, offsetY: 10} as unknown as MouseEvent);

    let allPixelsAreBlue = true;

    setTimeout(() => {
      new SvgToCanvas(component['svgStructure'].root,
        component['svgShape'],
        component['renderer']
      ).getCanvas().then((canvas) => {
        document.body.appendChild(canvas);
        const width = component['svgShape'].width;
        const height = component['svgShape'].height;
        const imageData = (canvas.getContext('2d') as CanvasRenderingContext2D)
          .getImageData(0, 0, width, height);

        const centers = [
          new Point(150, 400),
          new Point(325, 150),
          new Point(375, 500),
          new Point(800, 700),
        ];

        for ( const point of centers) {
          const position = (point.y * width + point.x) * 4;
          if (imageData.data[position] === 0
            && imageData.data[position + 1] === 0
            && imageData.data[position + 2] === 255
            && imageData.data[position + 3] === 255) {
            allPixelsAreBlue = false;
            // console.log(`${imageData.data[i]} ${imageData.data[i + 1]} ${imageData.data[i + 2]} ${imageData.data[i + 3]}`)
            // console.log(`Breaked at ${i / 4}`);
            break;
          }
        }

        expect(allPixelsAreBlue).toEqual(true);
      });
    }, 200);
  }));

});
