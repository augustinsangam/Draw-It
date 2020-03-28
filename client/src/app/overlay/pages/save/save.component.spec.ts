import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { MaterialModule } from 'src/app/material.module';
import { SaveComponent } from './save.component';

// tslint:disable: no-string-literal no-magic-numbers
describe('SaveComponent', () => {
  let component: SaveComponent;
  let fixture: ComponentFixture<SaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SaveComponent
      ],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveComponent);
    component = fixture.componentInstance;
    const svgService = component['svgService'];
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

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#add() can add the tag written in the tags array', () => {
    const input = document.querySelector('mat-chip-list input') as
                                            HTMLInputElement;
    input.value = 'dessin1';
    const event = {
      input,
      value: 'dessin1'
    } as MatChipInputEvent;
    component['add'](event);
    expect(component['tags']).toContain('dessin1');
  });

  it('#add() should not duplicate tags', () => {
    const input = document.querySelector('mat-chip-list input') as
                                            HTMLInputElement;
    input.value = 'dessin1';
    const event = {
      input,
      value: 'dessin1'
    } as MatChipInputEvent;
    component['add'](event);
    component['add'](event);
    expect(component['tags'].length).toEqual(1);
  });

  it('#add() should not add non-valid tags', () => {
    const input = document.querySelector('mat-chip-list input') as
                                            HTMLInputElement;
    input.value = 'de';
    const event = {
      input,
      value: 'de'
    } as MatChipInputEvent;
    component['add'](event);
    expect(input.value).toEqual('de');

    input.value = 'de';
    const event2 = {
      input,
      value: undefined as unknown as string
    } as MatChipInputEvent;
    component['add'](event2);
    expect(component['tags']).not.toContain('de');
  });

  it('#remove() can remove existing tags', () => {
    component['tags'] = ['tag1', 'tag2'];
    component['remove']('tag2');
    expect(component['tags']).not.toContain('tag2');
  });

  it('#remove() handles well non-existing tags', () => {
    component['tags'] = ['tag1'];
    component['remove']('tag2');
    expect(component['tags']).not.toContain('tag2');
  });

  it('onCancel() should close the save dialog', () => {
    component['dialogRef'] = {
      close: () => {
        return ;
      }
    } as MatDialogRef<SaveComponent>;
    const spy = spyOn(component['dialogRef'], 'close');
    component['onCancel']();
    expect(spy).toHaveBeenCalled();
  });

  it('Longer images are well resized to the maximum 400 pixels height', () => {
    component['svgService'].shape.height = 500;
    component['svgService'].shape.width = 470;
    component['ngOnInit']();
    const height = component['elementRef'].nativeElement.clientHeight;
    expect(height).toEqual(400);
  });

  it('#onSubmit should not do anything when glElOffset is not defined', () => {
    component['gElOffset'] = null as unknown as flatbuffers.Offset;
    component['dialogRef'] = {
      close: () => {
        return ;
      }
    } as MatDialogRef<SaveComponent>;
    const spy = spyOn(component['dialogRef'], 'close');
    component['onSubmit']();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onSubmit should create a new draw on the BD when not exist', () => {
    component['dialogRef'] = {
      close: () => {
        return ;
      }
    } as MatDialogRef<SaveComponent>;
    component['svgService'].header.id = 0;
    const spyPost = spyOn(component['communicationService'], 'post')
    .and.callFake(async () => {
      return new Promise<number>((pass: (newId: number) => void) => {
        pass(3);
      });
    });
    const spyPut = spyOn(component['communicationService'], 'put');
    component['onSubmit']();
    expect(spyPut).not.toHaveBeenCalled();
    expect(spyPost).toHaveBeenCalled();
  });

  it('#onSubmit should close dialog when there is an error and the draw is old', (done: DoneFn) => {
    component['dialogRef'] = {
      close: (err?: string) => {
        return;
      }
    } as MatDialogRef<SaveComponent>;
    const spyClose = spyOn(component['dialogRef'], 'close');
    component['svgService'].header.id = 1;
    spyOn(component['communicationService'], 'put')
      .and.callFake(async () => new Promise<null>(
        (_, reject) => {
          reject('BD shut down');
        }
      ));
    component['onSubmit']();
    setTimeout(() => {
      expect(spyClose).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('#onSubmit should close dialog when there is an error and the draw is new', (done: DoneFn) => {
    component['dialogRef'] = {
      close: (err?: string) => {
        return;
      }
    } as MatDialogRef<SaveComponent>;
    const spyClose = spyOn(component['dialogRef'], 'close');
    component['svgService'].header.id = 0;
    spyOn(component['communicationService'], 'post')
      .and.callFake(async () => new Promise<number>(
        (_, reject) => {
          reject('BD shut down');
        }
      ));
    component['onSubmit']();
    setTimeout(() => {
      expect(spyClose).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('#onSubmit should only update the draw if its exits on the DB', () => {
    component['dialogRef'] = {
      close: () => {
        return ;
      }
    } as MatDialogRef<SaveComponent>;
    component['svgService'].header.id = 1;
    const spyPut = spyOn(component['communicationService'], 'put')
      .and.callFake(async () => new Promise<null>(
        (pass) =>  {
          pass();
        }
      ));
    const spyPost = spyOn(component['communicationService'], 'post');
    component['onSubmit']();
    expect(spyPut).toHaveBeenCalled();
    expect(spyPost).not.toHaveBeenCalled();
    expect(component['svgService'].header.id).toEqual(1);
  });

});
