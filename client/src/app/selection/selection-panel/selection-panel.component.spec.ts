import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { OverlayService } from 'src/app/overlay/overlay.service';
import { ColorPanelComponent } from '../../tool/color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from '../../tool/color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from '../../tool/color/color-panel/color-picker-item/color-picker-item.component';
import { SelectionPanelComponent } from './selection-panel.component';

// tslint:disable:no-string-literal
describe('SelectionPanelComponent', () => {
  let component: SelectionPanelComponent;
  let fixture: ComponentFixture<SelectionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectionPanelComponent,
        ColorPanelComponent,
        ColorPickerContentComponent,
        ColorPickerItemComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionPanelComponent);
    component = fixture.componentInstance;
    component['overlay'] = {
      openDocumentationDialog: () => { return ; }
    } as unknown as OverlayService;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#a click on a circle should set the circle', (done: DoneFn) => {
    // tslint:disable-next-line: no-any
    const spy = spyOn<any>(component, 'setCircle');
    (component['circles'].nativeElement.children.item(0) as
    HTMLElement).dispatchEvent(new MouseEvent('click', {button: 0}));
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

  it('#showDocumentationSelection should call openDocumentationDialog of overlay service', () => {
    const spy = spyOn(component['overlay'], 'openDocumentationDialog');
    component['showDocumentationSelection']();
    expect(spy).toHaveBeenCalled();
  });

  it('#showDocumentationMagnetism should call openDocumentationDialog of overlay service', () => {
    const spy = spyOn(component['overlay'], 'openDocumentationDialog');
    component['showDocumentationMagnetism']();
    expect(spy).toHaveBeenCalled();
  });

});
