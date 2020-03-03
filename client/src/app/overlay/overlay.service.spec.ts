import { TestBed } from '@angular/core/testing';
import { MaterialModule } from '../material.module';
import { SvgService } from '../svg/svg.service';
import { UndoRedoService } from '../tool/undo-redo/undo-redo.service';
import { OverlayService } from './overlay.service';

// tslint:disable: no-string-literal
fdescribe('OverlayService', () => {
  let service: OverlayService;
  let svgService: SvgService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        MaterialModule
      ],
      providers: [
        SvgService,
        UndoRedoService
      ]
    });
    service = TestBed.get(OverlayService);
    svgService = TestBed.get(SvgService);
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

    (TestBed.get(UndoRedoService) as UndoRedoService).intialise(svgService.structure);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('#Handlers works for C, L, W, digit 1 and digit 2', () => {
  //   const spy = spyOn(service['toolSelectorService'], 'set');
  //   (service['handlersFunc'].get(Shortcut.C) as ShortcutCallBack)();
  //   (service['handlersFunc'].get(Shortcut.L) as ShortcutCallBack)();
  //   (service['handlersFunc'].get(Shortcut.W) as ShortcutCallBack)();
  //   (service['handlersFunc'].get(Shortcut.Digit1) as ShortcutCallBack)();
  //   (service['handlersFunc'].get(Shortcut.Digit2) as ShortcutCallBack)();
  //   expect(spy).toHaveBeenCalledTimes(5);
  // });

});
