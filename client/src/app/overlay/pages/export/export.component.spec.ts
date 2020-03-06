import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SvgService, SvgShape } from 'src/app/svg/svg.service';
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

});
