import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Overlay } from '@angular/cdk/overlay';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Draw } from 'src/app/communication/data_generated';
import { MaterialModule } from 'src/app/material.module';
import { ConfirmationDialogComponent } from '../new-draw/confirmation-dialog.component';
import { DeleteConfirmationDialogComponent } from './deleteconfirmation-dialog.component';
import { GalleryCardComponent } from './gallery-card/gallery-card.component';
import { GalleryComponent, GalleryDraw } from './gallery.component';
import { TagsFilterComponent } from './tags-filter/tags-filter.component';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
fdescribe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  const createDraw = () => {
    const draw: GalleryDraw = {
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
    return draw;
  };

  const testDrawsTable = [createDraw(), createDraw(), createDraw()];
  testDrawsTable[1].header.id = 1;
  testDrawsTable[2].header.id = 2;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  // const mockCommunicationService = {
  //   getAll: jasmine.createSpy('getAll').and.callFake(() => {
  //     return new Promise<flatbuffers.ByteBuffer>((resolve) => {
  //       return resolve();
  //     });
  //   })
  // };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConfirmationDialogComponent,
        DeleteConfirmationDialogComponent,
        GalleryCardComponent,
        GalleryComponent,
        TagsFilterComponent,
      ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        Overlay,
        MatDialog,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          DeleteConfirmationDialogComponent,
          ConfirmationDialogComponent,
        ]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#newDraw should return tempsAllTags with added tags ad add the draw to galleryDrawTable', () => {

    const draw = {
      name: () => 'test',
      height: () => 150,
      width: () => 300,
      color: () => '#420069',
      svg: () => 'unused' as unknown as Element,
      tagsLength: () => 3,
      tags: (index: number) => ['test1', 'test2', 'test3'][index]
    } as unknown as Draw;

    const svg = document.createElementNS('http://www.w3.org/2000/svg',
    'svg:g') as SVGGElement;
    spyOn(component['communicationService'], 'decodeElementRecursively').and.callFake(() => {
      return svg;
    });

    let tempsAllTags = new Set<string>(['test1', 'test4']);

    tempsAllTags = component['newDraw'](draw, 0, tempsAllTags);

    const arrayTempsAllTags = Array.from(tempsAllTags);

    const expectedDraw: GalleryDraw = {
      header: {
        id: 0,
        name: 'test',
        tags: ['test1', 'test2', 'test3'],
      },
      shape: {
        height: 150,
        width: 300,
        color: '#420069'
      },
      svg
    };

    expect(arrayTempsAllTags).toEqual(['test1', 'test4', 'test2', 'test3']);
    expect(component['galleryDrawTable']).toContain(expectedDraw);
  });

  it('#ngAfterViewInit should call ajustImagesWidth when screenService.size changes', () => {
    const spy = spyOn<any>(component, 'ajustImagesWidth');

    component.ngAfterViewInit();

    component['screenService'].size.next({width: 400, height: 400});

    expect(spy).toHaveBeenCalled();
  });

  it('#ajustImageWidth should set the padding of cardContent to 29 when width of saved draws is less than the width', () => {
    component['renderer'].setStyle(component['cardContent'].nativeElement, 'width', '400px');
    component['filteredGalleryDrawTable'].length = 1;

    component['ajustImagesWidth']();

    expect(component['cardContent'].nativeElement.style.paddingLeft).toEqual('29px');
  });

  it('#ajustImageWidth should set the padding of cardContent to 29 when width of saved draws is more than the width', () => {
    component['renderer'].setStyle(component['cardContent'].nativeElement, 'width', '800px');
    component['filteredGalleryDrawTable'].length = 4;

    component['ajustImagesWidth']();

    expect(component['cardContent'].nativeElement.style.paddingLeft).toEqual('58px');
  });

  it('#ajustImageWidth should set the padding of cardContent to 0 when there is no draw displayed', () => {
    component['renderer'].setStyle(component['cardContent'].nativeElement, 'width', '800px');
    component['filteredGalleryDrawTable'].length = 0;

    component['ajustImagesWidth']();

    expect(component['cardContent'].nativeElement.style.paddingLeft).toEqual('0px');
  });

  it('#addTag shoul call selectedTag.next() with "tag"', () => {
    const spy = spyOn(component['selectedTag'], 'next');

    component['addTag']('test');

    expect(spy).toHaveBeenCalledWith('test');
  });

  it('#filterGalleryTable should apply an OR filter on galleryDrawTable when "searchToggle" is false', () => {
    testDrawsTable[0].header.tags = ['test1', 'test2'];
    testDrawsTable[1].header.tags = ['test1', 'test3'];
    testDrawsTable[2].header.tags = ['test3', 'test4'];

    component['galleryDrawTable'] = Array.from(testDrawsTable);

    component['filterGalleryTable']([['test1', 'test2'], false]);

    expect(component['filteredGalleryDrawTable']).toContain(testDrawsTable[0], testDrawsTable[1]);
  });

  it('#filterGalleryTable should apply an AND filter on galleryDrawTable when "searchToggle" is true', () => {
    testDrawsTable[0].header.tags = ['test1', 'test2'];
    testDrawsTable[1].header.tags = ['test1', 'test3'];
    testDrawsTable[2].header.tags = ['test3', 'test4'];

    component['galleryDrawTable'] = Array.from(testDrawsTable);

    component['filterGalleryTable']([['test1', 'test2'], true]);

    expect(component['filteredGalleryDrawTable']).toContain(testDrawsTable[0]);
  });

  it('#filterGalleryTable should apply an AND filter on galleryDrawTable when "searchToggle" is true.\nShould return nothing', () => {
    testDrawsTable[0].header.tags = ['test1', 'test2'];
    testDrawsTable[1].header.tags = ['test1', 'test3'];
    testDrawsTable[2].header.tags = ['test3', 'test4'];

    component['galleryDrawTable'] = Array.from(testDrawsTable);

    component['filterGalleryTable']([['test3', 'test2'], true]);

    expect(component['filteredGalleryDrawTable']).toEqual([]);
  });

  it('#findDraw should return the correct draw from "id"', () => {
    component['galleryDrawTable'] = Array.from(testDrawsTable);

    const draw = component['findDraw'](1);

    expect(draw.header.id).toEqual(1);
  });

  it('#deleteDraw should call deleteCloseHandler() with "id" when dialogRefs.delete is closed', () => {
    // const spy = spyOn<any>(component, 'deleteCloseHandler');

    component['deleteDraw'](0);

    component['dialogRefs'].delete.close(true);

    expect(component['dialogRefs'].delete.disableClose).toBeTruthy();
  });

  it('#deleteCloseHandler shoul call communicationService.delete() with "id" when result is true', () => {
    const spy = spyOn(component['communicationService'], 'delete').and.callFake(() => {
      return new Promise<null>((resolve) => {
        resolve();
      });
    });

    component['deleteCloseHandler'](true, 0);

    expect(spy).toHaveBeenCalledWith(0);
  });

  it('#deleteCloseHandler shoul call dialogRefs.delete.close() when result is false', () => {
    component['dialogRefs'].delete = component['dialog'].open(DeleteConfirmationDialogComponent);

    const spy = spyOn(component['dialogRefs'].delete, 'close');

    component['deleteCloseHandler'](false, 0);

    expect(spy).toHaveBeenCalled();
  });

  it('#deletePromiseHandler should call snackBar.open() when result is not null', () => {
    const spy = spyOn(component['snackBar'], 'open');

    component['deletePromiseHandler']('test', 0);

    expect(spy).toHaveBeenCalled();
  });

  it('#deletePromiseHandler should remove the draw with "id" in galleryDrawTable when result is null', () => {
    component['galleryDrawTable'] = Array.from(testDrawsTable);

    component['deletePromiseHandler'](null, 0);

    expect(component['galleryDrawTable'][0]).toEqual(testDrawsTable[1]);
    expect(component['galleryDrawTable'][1]).toEqual(testDrawsTable[2]);
    expect(component['galleryDrawTable'].length).toBe(2);
  });

  it('#loadDraw should set dialogRefs.load.disableClose to true when data.drawInProgress is true', () => {
    component.data.drawInProgress = true;

    component['loadDraw'](0);
    component['dialogRefs'].load.close(true);

    expect(component['dialogRefs'].load.disableClose).toBeTruthy();
  });

  it('#loadDraw should call loadDrawHandler() with "true" and "id" when data.drawInProgress is false', () => {
    const spy = spyOn<any>(component, 'loadDrawHandler');

    component.data.drawInProgress = false;

    component['loadDraw'](0);

    expect(spy).toHaveBeenCalledWith(true, 0);
  });

  it('#loadDrawHandler should call dialogRef.close() when result is true', () => {
    component['galleryDrawTable'] = Array.from(testDrawsTable);

    component['loadDrawHandler'](true, 0);

    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('#loadDrawHandler should call dialogRefs.load.close() when result is false', () => {
    component['dialogRefs'].load = component['dialog'].open(ConfirmationDialogComponent);

    const spy = spyOn(component['dialogRefs'].load, 'close');

    component['loadDrawHandler'](false, 0);

    expect(spy).toHaveBeenCalled();
  });
});
