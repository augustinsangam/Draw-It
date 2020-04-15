// tslint:disable: no-magic-numbers no-any no-string-literal max-file-line-count

import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialogRef, MatRadioChange} from '@angular/material';

import { MaterialModule } from 'src/app/material.module';
import { SvgShape } from 'src/app/svg/svg-shape';
import { SvgService} from 'src/app/svg/svg.service';
import { FilterService } from 'src/app/tool/drawing-instruments/brush/filter.service';
import { UndoRedoService } from 'src/app/undo-redo/undo-redo.service';
import { ExportComponent, ExportType, FilterChoice, FormatChoice } from './export.component';

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
    expect(result[0]).toEqual(FormatChoice.SVG);
    expect(result[1]).toEqual(FormatChoice.PNG);
    expect(result[2]).toEqual(FormatChoice.JPEG);
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

  it('#formatToMime should return image/svg+xml for svg format', () => {
    expect(component['formatToMime'](FormatChoice.SVG)).toEqual('image/svg+xml');
  });

  it('#formatToMime should return image/png for png format', () => {
    expect(component['formatToMime'](FormatChoice.PNG)).toEqual('image/png');
  });

  it('#formatToMime should return image/jpeg for jpeg format', () => {
    expect(component['formatToMime'](FormatChoice.JPEG)).toEqual('image/jpeg');
  });

  it('#onConfirm should close the dialogRef', async () => {
    const getImageAsURLSpy = spyOn<any>(component, 'getImageAsURL');
    getImageAsURLSpy.and.returnValue(Promise.resolve('foo'));
    spyOn<any>(component, 'downloadImage');
    component['exportType'] = ExportType.LOCAL;
    await component['onConfirm']();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('#onConfirm should close with sendEmail error', async () => {
    const spy = spyOn(component['communicationService'], 'sendEmail');
    const error = new Error('foobar');
    spy.and.callFake(() => Promise.reject(error));

    component['exportType'] = ExportType.EMAIL;

    await component['onConfirm']();

    expect(mockDialogRef.close).toHaveBeenCalledWith(error);
  });

  it('#onConfirm should close with sendEmail response', async () => {
    const spy = spyOn(component['communicationService'], 'sendEmail');
    spy.and.returnValue(Promise.resolve('foobar'));

    component['exportType'] = ExportType.EMAIL;

    await component['onConfirm']();

    expect(mockDialogRef.close).toHaveBeenCalledWith('foobar');
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

  it('#validator should not retrun an error when the input is valid', () => {
    expect(ExportComponent.validator({
      value: 'aValidName'
    } as unknown as FormControl)).toEqual(null);
  });

  it('#onExportTypeChange shoudl handle null', () => {
    const spy = spyOn(component['form'], 'get');
    spy.and.returnValue(null);
    expect(() => component['onExportTypeChange']({
      value: ExportType.LOCAL,
    } as any)).not.toThrow();
  });

  it('#onExportTypeChange shoudl handle local export', () => {
    const input = component['form'].get('email');
    if (input == null) {
      fail('input should not be null');
      return;
    }
    const spy = spyOn(input, 'disable');
    component['onExportTypeChange']({
      value: ExportType.LOCAL,
    } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('#onExportTypeChange shoudl handle email export', () => {
    const input = component['form'].get('email');
    if (input == null) {
      fail('input should not be null');
      return;
    }
    const spy = spyOn(input, 'enable');
    component['onExportTypeChange']({
      value: ExportType.EMAIL,
    } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('#getImageAsURL should return svg url', async () => {
    const spy = spyOn<any>(component, 'serializeSVG');
    spy.and.returnValue('foo');

    const url = await component['getImageAsURL'](FormatChoice.SVG);
    expect(url).toEqual('data:image/svg+xml,foo');
  });

  it('#getImageAsURL should return png url', async () => {
    component['svgService'].shape.width = 50;
    component['svgService'].shape.height = 50;

    const url = await component['getImageAsURL'](FormatChoice.PNG);
    expect(url.startsWith('data:image/png;base64,')).toBeTruthy();
  });

  it('#getImageAsBlob should return blob of type svg', async () => {
    const blob = await component['getImageAsBlob'](FormatChoice.SVG);
    expect(blob.type).toEqual('image/svg+xml');
  });

  it('#getImageAsBlob should return blob of type png', async () => {
    const blob = await component['getImageAsBlob'](FormatChoice.PNG);
    expect(blob.type).toEqual('image/png');
  });
});
