import { TestBed } from '@angular/core/testing';

import { OverlayService } from './overlay.service';

describe('OverlayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverlayService = TestBed.get(OverlayService);
    expect(service).toBeTruthy();
  });

  // From the old app component

  // it('#openHomeDialog should call openSelectedDialog()', () => {
  //   component['dialogRefs'].home.disableClose = false;

  //   component['openHomeDialog']();

  //   component['dialogRefs'].home.close();

  //   expect(component['dialogRefs'].home.disableClose).toBe(true);
  // });

  // it('#openSelectedDialog should call openNewDrawDialog', () => {
  //   const spy = spyOn<any>(component, 'openNewDrawDialog');

  //   component['openSelectedDialog']('new');

  //   expect(spy).toHaveBeenCalled();
  // });

  // it('#openSelectedDialog should call openDocumentationDialog', () => {
  //   const spy = spyOn<any>(component, 'openDocumentationDialog');

  //   component['openSelectedDialog']('documentation');

  //   expect(spy).toHaveBeenCalled();
  // });

  // it('#openSelectedDialog should not call openNewDrawDialog '
  //   + 'and openDocumentationDialog', () => {
  //     const spy1 = spyOn<any>(component, 'openNewDrawDialog');
  //     const spy2 = spyOn<any>(component, 'openDocumentationDialog');

  //     component['openSelectedDialog']('library');

  //     expect(spy1).toHaveBeenCalledTimes(0);
  //     expect(spy2).toHaveBeenCalledTimes(0);
  //   });

  // it('#openSelectedDialog should not call openNewDrawDialog'
  //   + 'and openDocumentationDialog', () => {
  //     const spy1 = spyOn<any>(component, 'openNewDrawDialog');
  //     const spy2 = spyOn<any>(component, 'openDocumentationDialog');

  //     component['openSelectedDialog']('home');

  //     expect(spy1).toHaveBeenCalledTimes(0);
  //     expect(spy2).toHaveBeenCalledTimes(0);
  //   });

  // it('#openNewDrawDialog should call getCommomDialogOptions.', () => {
  //   const spy = spyOn<any>(component, 'getCommomDialogOptions');

  //   component['openNewDrawDialog']();

  //   component['dialogRefs'].newDraw.close();

  //   expect(spy).toHaveBeenCalled();
  // });

  // it('#closeNewDrawDialog should call openHomeDialog if option '
  //   + 'is "home".', () => {
  //     const spy = spyOn<any>(component, 'openHomeDialog');

  //     component['closeNewDrawDialog']('home');

  //     expect(spy).toHaveBeenCalled();
  //   });

  // it('#closeNewDrawDialog should call createNewDraw if option is a'
  //   + ' NewDrawOtion type.', () => {
  //     const spy = spyOn<any>(component, 'createNewDraw');

  //     const option: NewDrawOptions = {
  //       width: 2,
  //       height: 2,
  //       color: '#FFFFFF'
  //     };

  //     component['closeNewDrawDialog'](option);

  //     expect(spy).toHaveBeenCalled();
  //   });

  // it('#closeNewDrawDialog should not call openHomeDialog and'
  //   + 'createNewDraw if option null.', () => {
  //     const spy1 = spyOn<any>(component, 'openHomeDialog');
  //     const spy2 = spyOn<any>(component, 'createNewDraw');

  //     const option = (null as unknown) as NewDrawOptions;

  //     component['closeNewDrawDialog'](option);

  //     expect(spy1).toHaveBeenCalledTimes(0);
  //     expect(spy2).toHaveBeenCalledTimes(0);
  //   });

  // it('#closeDocumentationDialog should call openHomeDialog if fromHome'
  //   + '(arg) is true', () => {
  //     const spy = spyOn<any>(component, 'openHomeDialog');

  //     component['closeDocumentationDialog'](true);

  //     expect(spy).toHaveBeenCalled();
  //   });

  // it('#closeDocumentationDialog should not call openHomeDialog'
  //   + 'if fromHome (arg) is false', () => {
  //     const spy = spyOn<any>(component, 'openHomeDialog');

  //     component['closeDocumentationDialog'](false);

  //     expect(spy).not.toHaveBeenCalled();
  //   });

  // it('#openDocumentationDialog should set '
  //   + 'dialogRefs.documentation.disableClose to false', () => {
  //     const spy = spyOn(component['shortcutHanler'], 'desactivateAll');

  //     component['openDocumentationDialog'](true);

  //     component['dialogRefs'].documentation.close();

  //     expect(spy).toHaveBeenCalled();
  //   });

  // it('#createNewDraw should set drawInProgress to true', () => {
  //   const option: NewDrawOptions = {
  //     width: 2,
  //     height: 2,
  //     color: '#FFFFFF'
  //   };

  //   component['drawInProgress'] = false;

  //   component.svg.nativeElement.appendChild(document.createElement('circle'));

  //   component['createNewDraw'](option);

  //   expect(component['drawInProgress']).toBeTruthy();
  // });

  // it('#Handlers works for C, L, W, digit 1 and digit 2', () => {
  //   const spy = spyOn(component['toolSelectorService'], 'set');
  //   (component['handlersFunc'].get(Shortcut.C) as ShortcutCallBack)();
  //   (component['handlersFunc'].get(Shortcut.L) as ShortcutCallBack)();
  //   (component['handlersFunc'].get(Shortcut.W) as ShortcutCallBack)();
  //   (component['handlersFunc'].get(Shortcut.Digit1) as ShortcutCallBack)();
  //   (component['handlersFunc'].get(Shortcut.Digit2) as ShortcutCallBack)();
  //   expect(spy).toHaveBeenCalledTimes(5);
  // });

  // it('#Handler works for digit O', () => {
  //   const spy = spyOn<any>(component, 'openNewDrawDialog');
  //   const eventOWithoutControl = new KeyboardEvent('window:keydown', {
  //     code: 'KeyO',
  //     ctrlKey: false
  //   });
  //   (component['handlersFunc'].get(Shortcut.O) as
  //     ShortcutCallBack)(eventOWithoutControl);
  //   const eventOWithControl = new KeyboardEvent('window:keydown', {
  //     code: 'KeyO',
  //     ctrlKey: true,
  //   });
  //   (component['handlersFunc'].get(Shortcut.O) as
  //     ShortcutCallBack)(eventOWithControl);
  //   expect(spy).toHaveBeenCalledTimes(1);
  // })


});
