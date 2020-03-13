import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from 'src/app/material.module';
import { GalleryCardComponent } from './gallery-card.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('GalleryCardComponent', () => {
  let component: GalleryCardComponent;
  let fixture: ComponentFixture<GalleryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GalleryCardComponent,
      ],
      imports: [
        MaterialModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryCardComponent);
    component = fixture.componentInstance;
    component.draw = {
      header: {
        id: 0,
        name: '',
        tags: [],
      },
      shape: {
        height: 0,
        width: 0,
        color: '#FFFFFF'
      },
      svg: document.createElementNS('http://www.w3.org/2000/svg',
        'svg:g') as SVGGElement
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngAfterViewInit should set the width of svgRef.nativeElement to 300 if it is the most limiting dimension', () => {
    component.draw.shape.width = 400;
    component.draw.shape.height = 100;

    component.ngAfterViewInit();

    expect(component.svgRef.nativeElement.clientWidth).toEqual(300);
  });

  it('#ngAfterViewInit should set the height of svgRef.nativeElement to 170 if it is the most limiting dimension', () => {
    component.draw.shape.width = 300;
    component.draw.shape.height = 200;

    component.ngAfterViewInit();

    expect(component.svgRef.nativeElement.clientHeight).toEqual(170);
  });

  it('#onLoad should call load.next()', () => {
    const spy = spyOn(component.load, 'next');

    component['onLoad']();

    expect(spy).toHaveBeenCalled();
  });

  it('#onDelete should call delete.next()', () => {
    const spy = spyOn(component.delete, 'next');

    component['onDelete']();

    expect(spy).toHaveBeenCalled();
  });

  it('#onClick should call tagClick.next() with "tag"', () => {
    const spy = spyOn(component.tagClick, 'next');

    component['onClick']('test1');

    expect(spy).toHaveBeenCalledWith('test1');
  });
});
