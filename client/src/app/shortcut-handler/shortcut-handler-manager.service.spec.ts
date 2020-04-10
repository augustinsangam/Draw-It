import { TestBed } from '@angular/core/testing';

import { MaterialModule } from '../material.module';
import { Tool } from '../tool/tool.enum';
import { Shortcut } from './shortcut';
import { ShortcutHandlerManagerService } from './shortcut-handler-manager.service';
import { Handler } from './shortcut-handler.service';

// tslint:disable: no-string-literal no-any no-empty no-magic-numbers
describe('ShortcutHandlerManagerService', () => {

  let service: ShortcutHandlerManagerService;
  const waitTime = 10;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        MaterialModule
      ]
    });
    service = TestBed.get(ShortcutHandlerManagerService);
    service.initialiseShortcuts();
  });

  it('#should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#Handler for C should select Pencil', (done: DoneFn) => {
    const event = {
      code: 'c',
      ctrlKey: false,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.C) as Handler;
    handler.handlerFunction(event);
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Pencil);
      done();
    }, waitTime);
  });

  it('#Handler for L should select Line', (done: DoneFn) => {
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.L) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Line);
      done();
    }, waitTime);
  });

  it('#Handler for W should select Brush', (done: DoneFn) => {
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.W) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Brush);
      done();
    }, waitTime);
  });

  // it('#Handler for B should select Bucket', (done: DoneFn) => {
  //   const spyTool = spyOn(service['toolSelectorService'], 'set');
  //   const handler = service['shortcutHanler']['manager'].get(Shortcut.B) as Handler;
  //   handler.handlerFunction();
  //   setTimeout(() => {
  //     expect(spyTool).toHaveBeenCalledWith(Tool.Bucket);
  //     done();
  //   }, waitTime);
  // });

  it('#Handler for R should select applicator tool', (done: DoneFn) => {
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.R) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Applicator);
      done();
    }, waitTime);
  });

  it('#Handler for Digit 1 should select Rectangle', (done: DoneFn) => {
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.DIGIT_1) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Rectangle);
      done();
    }, waitTime);
  });

  it('#Handler for Digit 2 should select Ellipse', (done: DoneFn) => {
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.DIGIT_2) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Ellipse);
      done();
    }, waitTime);
  });

  it('#Handler for Digit 3 should select Polygone', (done: DoneFn) => {
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.DIGIT_3) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Polygone);
      done();
    }, waitTime);
  });

  it('#Handler for I should select Pipette', (done: DoneFn) => {
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.I) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Pipette);
      done();
    }, waitTime);
  });

  it('#Handler for P should select FeatherPen', (done: DoneFn) => {
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.P) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.FeatherPen);
      done();
    }, waitTime);
  });

  it('#Handler for T should select Text', (done: DoneFn) => {
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.T) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Text);
      done();
    }, waitTime);
  });

  it('#Shortcut + should call grid service', (done: DoneFn) => {
    const spyTool = spyOn(service['gridService'], 'keyEvHandler');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.PLUS) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith('+');
      done();
    }, waitTime);
  });

  it('#Shortcut - should call grid service', (done: DoneFn) => {
    const spyTool = spyOn(service['gridService'], 'keyEvHandler');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.MINUS) as Handler;
    handler.handlerFunction();
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith('-');
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + E should open export dialog', (done: DoneFn) => {
    const event = {
      code: 'e',
      ctrlKey: true,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['overlayService'], 'openExportDialog');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.E);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + X should call cut', (done: DoneFn) => {
    const event = {
      code: 'x',
      ctrlKey: true,
      preventDefault: () => {}
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['selectionService'].cut, 'next');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.X);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + X should not call cut when ctrl is not pressed', (done: DoneFn) => {
    const event = {
      code: 'x',
      ctrlKey: false,
      preventDefault: () => {}
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['selectionService'].cut, 'next');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.X);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + V should call paste', (done: DoneFn) => {
    const event = {
      code: 'v',
      ctrlKey: true,
      preventDefault: () => {}
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['selectionService'].paste, 'next');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.V);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + V should not call paste without ctrl key', (done: DoneFn) => {
    const event = {
      code: 'v',
      ctrlKey: false,
      preventDefault: () => {}
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['selectionService'].paste, 'next');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.V);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + C should call copy', (done: DoneFn) => {
    const event = {
      code: 'c',
      ctrlKey: true,
      preventDefault: () => {}
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['selectionService'].copy, 'next');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.C);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + D should call duplicate', (done: DoneFn) => {
    const event = {
      code: 'd',
      ctrlKey: true,
      preventDefault: () => {}
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['selectionService'].duplicate, 'next');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.D);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + D should not call duplicate without ctrl key', (done: DoneFn) => {
    const event = {
      code: 'd',
      ctrlKey: false,
      preventDefault: () => {}
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['selectionService'].duplicate, 'next');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.D);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, waitTime);
  });

  it('#Handler for E should select eraser', (done: DoneFn) => {
    const event = {
      code: 'e',
      ctrlKey: false,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.E);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(Tool.Eraser);
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + G should open gallery dialog', (done: DoneFn) => {
    const event = {
      code: 'g',
      ctrlKey: true,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['overlayService'], 'openGalleryDialog');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.G);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, waitTime);
  });

  it('#Handler for G should call the grid service', (done: DoneFn) => {
    const event = {
      code: 'g',
      ctrlKey: false,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['gridService'], 'keyEvHandler');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.G);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith('g');
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + digit A should cancel default action', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'KeyA',
      ctrlKey: true,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spyPrevent = spyOn(eventOWithControl, 'preventDefault');
    service['initialiseShortcuts']();
    const handlerDigitA = service['shortcutHanler']['manager'].get(Shortcut.A);
    if (!!handlerDigitA) {
      handlerDigitA.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(spyPrevent).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('#Handler for Digit A should select Aerosol', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'KeyA',
      ctrlKey: false,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    service['initialiseShortcuts']();
    const handlerDigitA = service['shortcutHanler']['manager'].get(Shortcut.A);
    if (!!handlerDigitA) {
      handlerDigitA.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Aerosol);
      done();
    }, 500);
  });

  it('#Handler for B should select Bucket', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'b',
      ctrlKey: false,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    service['initialiseShortcuts']();
    const handlerDigitB = service['shortcutHanler']['manager'].get(Shortcut.B);
    if (!!handlerDigitB) {
      handlerDigitB.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalledWith(Tool.Bucket);
      done();
    }, 500);
  });

  it('#Handler for M should toggle Magnetism', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'm',
      ctrlKey: false,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    service['selectionService'].magnetActive = true;
    service['initialiseShortcuts']();
    const handlerDigitB = service['shortcutHanler']['manager'].get(Shortcut.M);
    if (!!handlerDigitB) {
      handlerDigitB.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(service['selectionService'].magnetActive).not.toEqual(true);
      done();
    }, 500);
  });

  it('#Handler for Delete should select delete', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'Delete',
      ctrlKey: false,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spyTool = spyOn(service['selectionService'].delete, 'next');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.DELETE);
    if (!!handler) {
      handler.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(spyTool).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('#Handler for Ctrl + S should open save dialog', (done: DoneFn) => {
    const event = {
      code: 's',
      ctrlKey: true,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['overlayService'], 'openSaveDialog');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.S);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, waitTime);
  });

  it('#Handler for S should select selection tool', (done: DoneFn) => {
    const event = {
      code: 's',
      ctrlKey: false,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.S);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(Tool.Selection);
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + digit O should open new draw dialog', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'KeyO',
      ctrlKey: true,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spy = spyOn(service['overlayService'], 'openNewDrawDialog');
    service['initialiseShortcuts']();
    const handlerDigitO = service['shortcutHanler']['manager'].get(Shortcut.O);
    if (!!handlerDigitO) {
      handlerDigitO.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('#Handler for digit O should not cancel default action', (done: DoneFn) => {
    const eventOWithControl = {
      code: 'KeyO',
      ctrlKey: false,
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spy = spyOn(eventOWithControl, 'preventDefault');
    service['initialiseShortcuts']();
    const handlerDigitO = service['shortcutHanler']['manager'].get(Shortcut.O);
    if (!!handlerDigitO) {
      handlerDigitO.handlerFunction(eventOWithControl);
    }
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, 500);
  });

  it('#Handler for Ctrl + Z do the undo action', (done: DoneFn) => {
    const event = {
      code: 'z',
      ctrlKey: true,
      shiftKey: false,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['undoRedoService'], 'undo');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.Z);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith();
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + Shift + Z do the redo action', (done: DoneFn) => {
    const event = {
      code: 'Z',
      ctrlKey: true,
      shiftKey: true,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['undoRedoService'], 'redo');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.Z_SHIFT);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith();
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + Z do the undo action'
      + 'only when shift is not pressed', (done: DoneFn) => {
    const event = {
      code: 'z',
      ctrlKey: true,
      shiftKey: true,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['undoRedoService'], 'undo');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.Z);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalledWith();
      done();
    }, waitTime);
  });

  it('#Handler for Ctrl + Shift + Z do the redo action'
      + 'only when shift is pressed', (done: DoneFn) => {
    const event = {
      code: 'Z',
      ctrlKey: true,
      shiftKey: false,
      preventDefault: () => { }
    } as unknown as KeyboardEvent;
    const spy = spyOn<any>(service['undoRedoService'], 'redo');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.Z_SHIFT);
    if (!!handler) {
      handler.handlerFunction(event);
    }
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalledWith();
      done();
    }, waitTime);
  });
});
// tslint:disable-next-line: max-file-line-count
