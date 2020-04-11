import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material.module';
import {PanelComponent} from '../../../panel/panel.component';
import {ColorPanelComponent} from '../../color/color-panel/color-panel.component';
import {ColorPickerContentComponent} from '../../color/color-panel/color-picker-content/color-picker-content.component';
import {ColorPickerItemComponent} from '../../color/color-panel/color-picker-item/color-picker-item.component';
import {PipettePanelComponent} from './pipette-panel.component';
import { OverlayService } from 'src/app/overlay/overlay.service';

// tslint:disable:no-string-literal
describe('PipettePanelComponent', () => {
  let component: PipettePanelComponent;
  let fixture: ComponentFixture<PipettePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PipettePanelComponent,
        PanelComponent,
        ColorPanelComponent,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
      ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipettePanelComponent);
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

  it('#getHex should return the color of the service in Hex by calling ' +
    'the hexFromRgba method', () => {
    component['pipService'].currentColor = 'rgba(127, 127, 127, 255)';
    const spy = spyOn(component['colorService'], 'hexFormRgba').and.callThrough();
    const ret = component['getHex']();
    expect(spy).toHaveBeenCalled();
    expect(ret).toEqual('#7F7F7F');
  });

  it('#showDocumentation should call openDocumentationDialog of overlay service', () => {
    const spy = spyOn(component['overlay'], 'openDocumentationDialog');
    component['showDocumentation']();
    expect(spy).toHaveBeenCalled();
  });
});
