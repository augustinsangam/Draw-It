import { async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialogRef, MatRadioChange} from '@angular/material';
import { MaterialModule } from 'src/app/material.module';
import { SvgShape } from 'src/app/svg/svg-shape';
import { SvgService} from 'src/app/svg/svg.service';
import { FilterService } from 'src/app/tool/drawing-instruments/brush/filter.service';
import { UndoRedoService } from 'src/app/tool/undo-redo/undo-redo.service';
import { ExportComponent, FilterChoice, FormatChoice } from './export.component';

// tslint:disable: no-magic-numbers no-any no-string-literal
describe('ExportComponent', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  const mockDownloadLink = {
    click: jasmine.createSpy('click')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        ExportComponent
      ],
      providers: [
        Renderer2,
        SvgService,
        FilterService,
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: HTMLAnchorElement,
          useValue: mockDownloadLink
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;

    const svgService: SvgService = TestBed.get(SvgService) as SvgService;
    svgService.structure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    const filter1 = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svgService.structure.defsZone.appendChild(filter1);
    svgService.structure.drawZone.appendChild(element1);

    svgService.structure.root.appendChild(svgService.structure.defsZone);
    svgService.structure.root.appendChild(svgService.structure.drawZone);
    svgService.structure.root.appendChild(svgService.structure.temporaryZone);
    svgService.structure.root.appendChild(svgService.structure.endZone);

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component['svgService'].structure);

    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngAfterViewInit should call createView', fakeAsync(() => {
    const spy = spyOn<any>(component, 'createView');
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('#initializeFiltersChooser should add 6 entry to the map', fakeAsync(() => {
    component['initializeFiltersChooser']();
    expect(component['filtersChooser'].size).toEqual(6);
  }));

  it('#getFormats() should return an array of FormatChoice', fakeAsync(() => {
    const result = component['getFormats']();
    expect(result[0]).toEqual(FormatChoice.Svg);
    expect(result[1]).toEqual(FormatChoice.Png);
    expect(result[2]).toEqual(FormatChoice.Jpeg);
  }));

  it('#getFilters() should return an array of FilterChoice', fakeAsync(() => {
    const result = component['getFilters']();
    expect(result[0]).toEqual(FilterChoice.None);
    expect(result[1]).toEqual(FilterChoice.Saturate);
    expect(result[2]).toEqual(FilterChoice.BlackWhite);
    expect(result[3]).toEqual(FilterChoice.Inverse);
    expect(result[4]).toEqual(FilterChoice.Sepia);
    expect(result[5]).toEqual(FilterChoice.Grey);
  }));

  it('#onConfirm should close the dialogRef', () => {
    spyOn<any>(component, 'exportDrawing');
    component['onConfirm']();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('#onOptionChange should call createView', () => {
    const spy = spyOn<any>(component, 'createView');
    const change = {} as unknown as MatRadioChange;
    component['onOptionChange'](change);
    expect(spy).toHaveBeenCalled();
  });

  it('#onCancel should close the dialogRef', () => {
    component['onCancel']();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('#InitialzeElements should set the good values to svgShape', fakeAsync(() => {
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component['svgService'].shape = svgShapeTest;
    component['initializeElements']();
    expect(component['svgShape'].color).toEqual(svgShapeTest.color);
    expect(component['svgShape'].width).toEqual(svgShapeTest.width);
    expect(component['svgShape'].height).toEqual(svgShapeTest.height);
  }));

  it('#InitialzeElements should set the good values to innerSvg', fakeAsync(() => {
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component['svgService'].shape = svgShapeTest;
    component['initializeElements']();
    expect(component['innerSVG'].getAttribute('width')).toEqual(svgShapeTest.width.toString());
    expect(component['innerSVG'].getAttribute('height')).toEqual(svgShapeTest.height.toString());
  }));

  it('#SerializeSVG is making a good serialization', fakeAsync(() => {
    component['initializeElements']();
    const serializer: XMLSerializer = new XMLSerializer();
    expect(component['serializeSVG']()).toEqual(serializer.serializeToString(component['innerSVG']));
  }));

  it('#convertSVGToBase64 is making a good conversion', fakeAsync(() => {
    component['initializeElements']();
    const expected: string = 'data:image/svg+xml;base64,' + btoa(component['serializeSVG']());
    expect(component['convertSVGToBase64']()).toEqual(expected);
  }));

  it('#convertToBlob is making a good conversion', fakeAsync(() => {
    component['initializeElements']();
    component['innerSVG'].setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const blobExpected: Blob = new Blob([component['serializeSVG']()], {type: 'image/svg+xml;charset=utf-8'});

    expect(component['convertToBlob']()).toEqual(blobExpected);
  }));

  it('#downloadImage should call the click method of the anchor', () => {
    const pictureUrl = 'url';
    const downloadLink = {
      href: pictureUrl,
      download: '',
      click: () => { return ; }
    } as unknown as HTMLAnchorElement;
    spyOn(component['renderer'], 'createElement').and.callFake(() =>  downloadLink);
    const spy = spyOn(downloadLink, 'click');
    component['downloadImage'](pictureUrl);
    expect(spy).toHaveBeenCalled();
  });

  it('#generateCanvas return a canvas with good configurations', fakeAsync(() => {
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component['svgShape'] = svgShapeTest;
    const canvas: HTMLCanvasElement =  component['generateCanvas']();
    expect(canvas.height).toEqual(svgShapeTest.height);
    expect(canvas.width).toEqual(svgShapeTest.width);
  }));

  it('#exportSvg should call our download method', fakeAsync(() => {
    const spy = spyOn<any>(component, 'downloadImage');
    component['exportSVG']();
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('#createView should add element into to the viewZone', () => {
    component['createView']('');
    const theViewZone = component['svgView'].nativeElement;
    const picture = theViewZone.lastElementChild as Element;
    expect(picture.getAttribute('id')).toEqual('pictureView');
  });

  it('#createView should add without removing when the element isnt the picture', () => {
    const theViewZone = component['svgView'].nativeElement;
    const picture = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    picture.setAttribute('id', 'test');
    theViewZone.appendChild(picture);
    const spy = spyOn<any>(theViewZone, 'removeChild');
    component['createView']('');
    expect(spy).toHaveBeenCalledTimes(0);

  });

  it('#createView should add after removing the picture', () => {
    const theViewZone = component['svgView'].nativeElement;
    const picture = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    picture.setAttribute('id', 'pictureView');
    theViewZone.appendChild(picture);
    const spy = spyOn<any>(theViewZone, 'removeChild');
    component['createView']('');
    expect(spy).toHaveBeenCalledTimes(1);

  });

  it('#exportDrawing should call exportSVG when we export as SVG', fakeAsync(() => {
    const spy = spyOn<any>(component, 'exportSVG');
    component['exportDrawing'](FormatChoice.Svg);
    expect(spy).toHaveBeenCalled();
  }));

  it('#exportDrawing shouldnt call exportSVG when we export as png', fakeAsync(() => {
    component['innerSVG'] = component['svgService'].structure.root;
    const pictureUrl = 'url';
    const image: HTMLImageElement = {
      src: pictureUrl,
    } as unknown as HTMLImageElement;
    spyOn(component['renderer'], 'setAttribute').and.callFake(() =>  image);
    const spy = spyOn<any>(component, 'exportSVG');
    setTimeout(() => {
      component['exportDrawing'](FormatChoice.Jpeg);
    }, 500);
    tick(500);
    expect(spy).toHaveBeenCalledTimes(0);
  }));

  it('#configurePicture should make good id configuration', fakeAsync(() => {
    const picture = component['renderer'].createElement('picture', 'http://www.w3.org/2000/svg');
    component['configurePicture'](picture, '');
    expect(picture.getAttribute('id')).toEqual('pictureView');
  }));

  it('#configurePicture should make good filter configuration', fakeAsync(() => {
    const picture = component['renderer'].createElement('picture', 'http://www.w3.org/2000/svg');
    component['configurePicture'](picture, '');
    expect(picture.getAttribute('filter')).toEqual('');
  }));

  it('#chooseFilter should return the good url', fakeAsync(() => {
    const urlReceived = component['filtersChooser'].get('Saturation') as string;
    expect(urlReceived).toEqual('url(#saturate)');
  }));

  it('#resetInnerSVG should set good width and height value to innerSvg', fakeAsync(() => {
    const svgShapeTest: SvgShape = {color: 'blue', width: 1345, height: 245};
    component['svgShape'] = svgShapeTest;
    component['resetInnerSVG']();
    expect(component['innerSVG'].getAttribute('width')).toEqual(svgShapeTest.width.toString());
    expect(component['innerSVG'].getAttribute('height')).toEqual(svgShapeTest.height.toString());
  }));

  it('#configureSize is making good configuration', fakeAsync(() => {
    const svgShapeTest: SvgShape = {color: 'blue', width: 1345, height: 245};
    const picture: SVGImageElement  = component['renderer'].createElement('image', 'http://www.w3.org/2000/svg');
    component['configureSize'](picture, svgShapeTest);
    expect(picture.getAttribute('width')).toEqual(svgShapeTest.width.toString());
    expect(picture.getAttribute('height')).toEqual(svgShapeTest.height.toString());
  }));

  it('#generateBackground return a good rectangle configu', fakeAsync(() => {
    const svgShapeTest: SvgShape = {color: 'blue', width: 1345, height: 245};
    component['svgShape'] = svgShapeTest;
    const background = component['generateBackground']();
    expect(background.getAttribute('width')).toEqual(svgShapeTest.width.toString());
    expect(background.getAttribute('height')).toEqual(svgShapeTest.height.toString());
    expect(background.getAttribute('fill')).toEqual(svgShapeTest.color);
  }));
});
