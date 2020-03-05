import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObserversModule } from '@angular/cdk/observers';
import { Overlay } from '@angular/cdk/overlay';
import { Renderer2 } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {  MAT_DIALOG_DATA,  MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog,  MatDialogClose ,
   MatDialogRef,
   MatInputModule,
   MatRadioButton,
   MatRadioGroup,
   MatRippleModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SvgService } from 'src/app/svg/svg.service';
import { FilterService } from 'src/app/tool/drawing-instruments/brush/filter.service';
import { ExportComponent } from './export.component';

fdescribe('ExportComponent', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ObserversModule,
        MatRippleModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [
        ExportComponent,
        MatDialogClose,
        MatRadioButton,
        MatRadioGroup

      ],
      providers: [
        Overlay,
        Renderer2,
        FormBuilder,
        FilterService,
        SvgService,
        MatDialog,
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;

    const svgService: SvgService = TestBed.get(component['svgService']) as SvgService;
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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
