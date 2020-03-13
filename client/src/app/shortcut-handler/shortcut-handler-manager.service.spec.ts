import { TestBed } from '@angular/core/testing';

import { MaterialModule } from '../material.module';
import { Tool } from '../tool/tool.enum';
import { Shortcut } from './shortcut';
import { ShortcutHandlerManagerService } from './shortcut-handler-manager.service';
import { Handler } from './shortcut-handler.service';

// TODO : Ask the chargé de lab
// tslint:disable: no-string-literal no-any no-empty
describe('ShortcutHandlerManagerService', () => {

  let service: ShortcutHandlerManagerService;
  const waitTime = 5;

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#Handler for C should select Pencil', (done: DoneFn) => {
    const spyTool = spyOn(service['toolSelectorService'], 'set');
    const handler = service['shortcutHanler']['manager'].get(Shortcut.C) as Handler;
    handler.handlerFunction();
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
