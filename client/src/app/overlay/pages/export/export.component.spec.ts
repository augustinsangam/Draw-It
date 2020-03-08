import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SvgService, SvgShape } from 'src/app/svg/svg.service';
import { FilterService } from 'src/app/tool/drawing-instruments/brush/filter.service';
import { UndoRedoService } from 'src/app/tool/undo-redo/undo-redo.service';
import { ExportComponent } from './export.component';

fdescribe('ExportComponent', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        ExportComponent
      ],
      providers: [
        Renderer2,
        SvgService,
        FilterService
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
    svgService.structure.root.appendChild(svgService.structure.defsZone);
    svgService.structure.root.appendChild(svgService.structure.drawZone);
    svgService.structure.root.appendChild(svgService.structure.temporaryZone);
    svgService.structure.root.appendChild(svgService.structure.endZone);

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component['svgService'].structure);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#InitialzeElements should set the good values to svgShape', fakeAsync(() => {
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component['svgService'].shape = svgShapeTest;
    component.initializeElements();
    expect(component.svgShape.color).toEqual(svgShapeTest.color);
    expect(component.svgShape.width).toEqual(svgShapeTest.width);
    expect(component.svgShape.height).toEqual(svgShapeTest.height);
  }));

  it('#InitialzeElements should set the good values to innerSvg', fakeAsync(() => {
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component['svgService'].shape = svgShapeTest;
    component.initializeElements();
    expect(component.innerSVG.getAttribute('width')).toEqual(svgShapeTest.width.toString());
    expect(component.innerSVG.getAttribute('height')).toEqual(svgShapeTest.height.toString());
  }));

  it('#SerializeSVG is making a good serialization', fakeAsync(() => {
    component.initializeElements();
    const serializer: XMLSerializer = new XMLSerializer();
    expect(component.serializeSVG()).toEqual(serializer.serializeToString(component.innerSVG));
  }));

  it('#convertSVGToBase64 is making a good conversion', fakeAsync(() => {
    component.initializeElements();
    const expected: string = 'data:image/svg+xml;base64,' + btoa(component.serializeSVG());
    expect(component.convertSVGToBase64()).toEqual(expected);
  }));

  it('#convertToBlob is making a good conversion', fakeAsync(() => {
    component.initializeElements();
    component.innerSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const blobExpected: Blob = new Blob([component.serializeSVG()], {type: 'image/svg+xml;charset=utf-8'});

    expect(component.convertToBlob()).toEqual(blobExpected);
  }));

  it('#generateCanvas return a canvas with good configurations', fakeAsync(() => {
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component.svgShape = svgShapeTest;
    const canvas: HTMLCanvasElement =  component.generateCanvas();
    expect(canvas.height).toEqual(svgShapeTest.height);
    expect(canvas.width).toEqual(svgShapeTest.width);
  }));

  it('#createView return true when the viewZone exist', fakeAsync(() => {
    const creationResult = component.createView('');
    expect(creationResult).toBeTruthy();
  }));

  // à revoir
  // it('#createView return false when the viewZone didnt exist', fakeAsync(() => {
  //   component['svgView'].nativeElement = null;
  //   const creationResult = component.createView('');
  //   expect(creationResult).toBeTruthy();
  // }));

  it('#configurePicture should make good id configuration', fakeAsync(() => {
    const picture = component['renderer'].createElement('picture', 'http://www.w3.org/2000/svg');
    component.configurePicture(picture, '');
    expect(picture.getAttribute('id')).toEqual('pictureView');
  }));

  it('#configurePicture should make good filter configuration', fakeAsync(() => {
    const picture = component['renderer'].createElement('picture', 'http://www.w3.org/2000/svg');
    component.configurePicture(picture, '');
    expect(picture.getAttribute('filter')).toEqual('');
  }));

  it('#configurePicture should make good width and height configuration', fakeAsync(() => {
    const picture = component['renderer'].createElement('picture', 'http://www.w3.org/2000/svg');
    const svgShapeTest: SvgShape = {color: 'blue', width: 1345, height: 245};
    component.svgShape = svgShapeTest;
    component.configurePicture(picture, '');
    expect(picture.getAttribute('width')).toEqual(svgShapeTest.width);
    expect(picture.getAttribute('height')).toEqual(svgShapeTest.height);
  }));
});
