import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayService } from 'src/app/overlay/overlay.service';
import { PencilService } from '../pencil.service';
import { PencilPanelComponent } from './pencil-panel.component';

import { Overlay } from '@angular/cdk/overlay';
import { MatSnackBar } from '@angular/material';
import { MaterialModule } from 'src/app/material.module';

// tslint:disable: no-string-literal
describe('PencilPanelComponent', () => {
  let component: PencilPanelComponent;
  let fixture: ComponentFixture<PencilPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PencilPanelComponent
      ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        FormsModule,
        PencilService,
        FormBuilder,
        Overlay,
        MatSnackBar
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilPanelComponent);
    component = fixture.componentInstance;
    // tslint:disable-next-line: no-string-literal
    component['overlay'] = {
      openDocumentationDialog: () => { return ; }
    } as unknown as OverlayService;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#showDocumentation should call openDocumentationDialog of overlay service', () => {
    const spy = spyOn(component['overlay'], 'openDocumentationDialog');
    component['showDocumentation']();
    expect(spy).toHaveBeenCalled();
  });

  it ('#pencilForm have been created correctly', () => {
    expect(component['pencilForm']).toBeTruthy();
  });

  it ('#onThicknessChange should call patchValue', () => {
    const spy = spyOn(component['pencilForm'], 'patchValue');
    component['onThicknessChange']();
    expect(spy).toHaveBeenCalled();
  });

});
