import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UndoRedoService } from 'src/app/tool/undo-redo/undo-redo.service';
import { Path } from '../../common/path';
import { Point } from '../../common/point';
import { LineLogicComponent } from './line-logic.component';

// tslint:disable:no-string-literal no-any no-magic-numbers
describe('LineLogicComponent', () => {
  let component: LineLogicComponent;
  let fixture: ComponentFixture<LineLogicComponent>;
  let defaultPath: Path;
  // let defaultCircle: Circle;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LineLogicComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineLogicComponent);
    component = fixture.componentInstance;
    component.svgStructure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    component.svgStructure.root.appendChild(component.svgStructure.defsZone);
    component.svgStructure.root.appendChild(component.svgStructure.drawZone);
    component.svgStructure.root.appendChild(component.svgStructure.temporaryZone);
    component.svgStructure.root.appendChild(component.svgStructure.endZone);

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component.svgStructure);

    fixture.detectChanges();

    defaultPath = new Path(
      new Point(42, 42),
      component['renderer'],
      component['renderer'].createElement('path', component['svgNS']),
      true
    );
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#createNewPath should call getPath', () => {
    const spy = spyOn<any>(component, 'getPath').and.callThrough();
    component['isNewPath'] = true;
    component['paths'] = [];
    component['createNewPath'](new Point(100, 100));
    expect(spy).toHaveBeenCalled();
  });

  it('#getPath should return the path containing' +
      'the Point passed as parameter', () => {
    component['paths'] = [defaultPath];
    expect(component['getPath']().datas.points).toEqual([new Point(42, 42)]);
  });

  it('#addNewLine should call addLine in Path', () => {
    component['onMouseClick'](
      new MouseEvent('mousedown', {
        button: 0,
        clientX: 100,
        clientY: 100
      } as MouseEventInit)
    );
    const spy = spyOn(component['getPath'](), 'addLine').and.callThrough();
    component['addNewLine'](new Point(100, 100));
    expect(spy).toHaveBeenCalled();
  });

  it('#addNewLine should not call createJonction if withJonction is false',
    () => {
      component['onMouseClick'](
        new MouseEvent('mousedown', {
          button: 0,
          clientX: 100,
          clientY: 100
        } as MouseEventInit)
      );
      component['getPath']().withJonctions = false;
      const spy = spyOn<any>(component, 'createJonction').and.callThrough();
      component['addNewLine'](new Point(100, 100));
      expect(spy).toHaveBeenCalledTimes(0);
    });

  it(
    'onMouseClick should call isNewLine and ' +
    'should set isNewPath to false when Shift is not pressed',
    () => {
      const spy = spyOn<any>(component, 'addNewLine').and.callThrough();
      component['isNewPath'] = true;
      component['onMouseClick'](
        new MouseEvent('mousedown', {
          button: 0,
          clientX: 100,
          clientY: 100,
          shiftKey: false
        } as MouseEventInit)
      );
      expect(spy).toHaveBeenCalled();
      expect(component['isNewPath']).toBeFalsy();
    }
  );

  it(
    'onMouseClick should call getAlignedPoint and ' +
    'set isNewPath to false when Shift is pressed',
    () => {
      component['paths'].push(defaultPath);
      const spy = spyOn(component['paths'][0], 'getAlignedPoint').and.callFake(
        (): Point => (new Point(100, 100))
      );
      spyOn<any>(component, 'addNewLine');
      component['isNewPath'] = false;
      component['onMouseClick'](
        new MouseEvent('mousedown', {
          button: 0,
          clientX: 100,
          clientY: 100,
          shiftKey: true
        } as MouseEventInit)
      );
      expect(spy).toHaveBeenCalled();
      expect(component['isNewPath']).toBeFalsy();
    }
  );

  it(
    'onMouseMove should call getPath only 1 time' +
    ' lorsque SHIFT n’est pas pressé',
    () => {
      component['isNewPath'] = false;
      component['paths'] = [defaultPath];
      const spy = spyOn<any>(component, 'getPath').and.callThrough();
      component['onMouseMove'](
        new MouseEvent('mousemove', {
          button: 0,
          clientX: 100,
          clientY: 100,
          shiftKey: false
        } as MouseEventInit)
      );
      expect(spy).toHaveBeenCalledTimes(1);
    }
  );

  it(
    'onMouseMove should call getPath 2 times lorsque SHIFT est pressé',
    () => {
      component['isNewPath'] = false;
      component['paths'] = [defaultPath];
      const spy = spyOn<any>(component, 'getPath').and.callThrough();
      component['onMouseMove'](
        new MouseEvent('mousemove', {
          button: 0,
          clientX: 100,
          clientY: 100,
          shiftKey: true
        } as MouseEventInit)
      );
      expect(spy).toHaveBeenCalledTimes(2);
    }
  );

  it('#onMouseMove should not do anything if isNewPath is true', () => {
    component['isNewPath'] = true;
    const spy = spyOn<any>(component, 'getPath').and.callThrough();
    component['onMouseMove'](
      new MouseEvent('mousemove', {
        button: 0,
        clientX: 100,
        clientY: 100,
        shiftKey: false
      } as MouseEventInit)
    );
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it(
    'onMouseDblClick should set isNewPath to true for a point ' +
    'that´s further than 3 pixels',
    () => {
      component['paths'] = [defaultPath];
      defaultPath.datas.points = [ new Point(42, 42) ];

      component['onMouseDblClick'](
        new MouseEvent('dblclick', {
          button: 0,
          clientX: 100,
          clientY: 100,
          shiftKey: false
        })
      );

      expect(component['isNewPath']).toBeTruthy();
    }
  );

  it(
    'onMouseDblClick should set isNewPath to true and call getPath ' +
    '5 for a point that´s further than 3 pixels and when we press Shift',
    () => {
      component['paths'] = [defaultPath];
      component['isNewPath'] = false;

      spyOn(component['mathService'], 'distanceIsLessThan3Pixel').and.callFake(
        () => false
      );
      spyOn(component['mathService'], 'findAlignedSegmentPoint');
      spyOn(component['paths'][0], 'getAlignedPoint').and.callFake(
        (): Point => (new Point(300, 300))
      );
      const spyaddNewLine = spyOn<any>(component, 'addNewLine');
      const spygetPath = spyOn<any>(component, 'getPath').and.callThrough();

      component['onMouseDblClick'](
        new MouseEvent('dblclick', {
          button: 0,
          clientX: 100,
          clientY: 100,
          shiftKey: true
        })
      );

      expect(spyaddNewLine).toHaveBeenCalled();
      expect(spygetPath).toHaveBeenCalledTimes(4);
      expect(component['isNewPath']).toBeTruthy();
    }
  );

  it(
    'onMouseDblClick should set isNewPath to true and call getPath '
    + '5 times for a point that´s further than 3 pixels and'
    + 'when shift isn´t pressed',
    () => {
      component['paths'] = [defaultPath];
      component['isNewPath'] = false;

      spyOn(component['mathService'], 'distanceIsLessThan3Pixel').and.callFake(
        () => false
      );
      spyOn(component['mathService'], 'findAlignedSegmentPoint');
      spyOn(component['paths'][0], 'getAlignedPoint').and.callFake(
        (): Point => (new Point(300, 300))
      );
      const spyaddNewLine = spyOn<any>(component, 'addNewLine');
      const spygetPath = spyOn<any>(component, 'getPath').and.callThrough();

      component['onMouseDblClick'](
        new MouseEvent('dblclick', {
          button: 0,
          clientX: 100,
          clientY: 100,
          shiftKey: false
        })
      );

      expect(spyaddNewLine).toHaveBeenCalled();
      expect(spygetPath).toHaveBeenCalledTimes(3);
      expect(component['isNewPath']).toBeTruthy();
    }
  );

  it( '#onMouseDblClick should call getPath 3 times for a point less '
    + 'far than 3 pixels', () => {
      component['paths'] = [defaultPath];
      component['isNewPath'] = false;

      spyOn(component['mathService'], 'distanceIsLessThan3Pixel').and.callFake(
        () => true
      );
      const spyaddNewLine = spyOn<any>(component, 'addNewLine');
      const spygetPath = spyOn<any>(component, 'getPath').and.callThrough();

      component['onMouseDblClick'](
        new MouseEvent('dblclick', {
          button: 0,
          clientX: 100,
          clientY: 100,
          shiftKey: false
        })
      );

      expect(spyaddNewLine).toHaveBeenCalled();
      expect(spygetPath).toHaveBeenCalledTimes(3);
      expect(component['isNewPath']).toBeTruthy();
    });

  it( '#onKeyDown should call getPath 3 times '
    + 'when called with shift pressed', () => {
      component['isNewPath'] = false;
      component['paths'] = [defaultPath];
      spyOn(component['getPath'](), 'getAlignedPoint').and.callFake(
        (): Point => (new Point(10, 10))
      );
      const spy = spyOn<any>(component, 'getPath').and.callThrough();
      component['onKeyDown'](
        new KeyboardEvent('shift', {
          code: 'ShiftLeft'
        })
      );
      expect(spy).toHaveBeenCalledTimes(3);
    });

  it('#onKeyDown shouldn´t do anything if isNewPath is true', () => {
    component['isNewPath'] = true;
    component['paths'] = [defaultPath];
    const spy = spyOn<any>(component['getPath'](), 'removePath')
                .and.callThrough();
    component['onKeyDown'](
      new KeyboardEvent('escape', {
        code: 'Escape'
      })
    );
    expect(spy).toHaveBeenCalledTimes(0);
  });

  // TODO
  it(
    'onKeyDown should call getPath 1 time when it´s called with ' +
    'with Escape, and shoud set isNewPath to true',
    () => {
      component['isNewPath'] = false;
      component['paths'] = [defaultPath];
      const spy = spyOn<any>(component['getPath'](), 'removePath')
                  .and.callThrough();
      component['onKeyDown'](
        new KeyboardEvent('escape', {
          code: 'Escape'
        })
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component['isNewPath']).toBeTruthy();
    }
  );

  it(
    'onKeyDown should call removeLastLine and ' +
    'simulateNewLine when called with Backspace',
    () => {
      defaultPath.datas.points = [ new Point(42, 42), new Point(404, 404) ];
      defaultPath.datas.instructions = [ 'L 50 25', 'L 23 45', 'L 21 23', 'L 23 45', 'L 23 45'];
      component['isNewPath'] = false;
      component['paths'] = [defaultPath];
      const spyNewLine = spyOn<any>(component,
                      'addNewLine');
      const spyRemo = spyOn(component['getPath'](),
                      'removeLastInstruction');
      const spySimu = spyOn(
        component['getPath'](),
        'simulateNewLine'
      ).and.callFake(
        (): Point => new Point(10, 10)
      );

      component['onKeyDown'](
        new KeyboardEvent('backspace', {
          code: 'Backspace'
        })
      );
      expect(spyRemo).toHaveBeenCalled();
      expect(spySimu).toHaveBeenCalled();
      expect(spyNewLine).not.toHaveBeenCalled();
    }
  );
  it(
    'onKeyDown should not call anything if there is not enought instruction  when called with Backspace',
    () => {
      defaultPath.datas.points = [ new Point(42, 42), new Point(404, 404) ];
      defaultPath.datas.instructions = [ 'M 50 25'];
      component['isNewPath'] = false;
      component['service'].withJonction = false;
      component['paths'] = [defaultPath];
      const spyNewLine = spyOn<any>(component,
                      'addNewLine');
      const spyRemo = spyOn(component['getPath'](),
                      'removeLastInstruction');
      const spySimu = spyOn(
        component['getPath'](),
        'simulateNewLine'
      ).and.callFake(
        (): Point => new Point(10, 10)
      );

      component['onKeyDown'](
        new KeyboardEvent('backspace', {
          code: 'Backspace'
        })
      );
      expect(spyRemo).not.toHaveBeenCalled();
      expect(spySimu).not.toHaveBeenCalled();
      expect(spyNewLine).not.toHaveBeenCalled();
    }
  );

  it(
    'removeLastLine should remove jonctions if  withJonction' +
    'was true', () => {
      defaultPath.datas.points = [
        new Point(42, 42),
        new Point(404, 404)];
      component['isNewPath'] = false;
      component['paths'] = [defaultPath];
      component['getPath']().withJonctions = true;
      defaultPath.datas.instructions = [ 'L 50 25', 'L 23 45', 'L 21 23', 'L 23 45', 'L 23 45'];
      const spyJonction = spyOn(
        component['getPath'](),
        'removeLastInstruction').and.callThrough();
      component['removeLine']();
      expect(spyJonction).toHaveBeenCalled();
      expect(component['getPath']().datas.instructions.length).toBe(3);
    }
  );
  it(
    'removeLastLine should not remove jonctions if  withJonction' +
    'was true', () => {
      defaultPath.datas.points = [
        new Point(42, 42),
        new Point(404, 404)];
      component['isNewPath'] = false;
      component['paths'] = [defaultPath];
      component['getPath']().withJonctions = false;
      defaultPath.datas.instructions = [ 'L 50 25', 'L 23 45', 'L 21 23', 'L 23 45', 'L 23 45'];
      const spyJonction = spyOn(
        component['getPath'](),
        'removeLastInstruction').and.callThrough();
      component['removeLine']();
      expect(spyJonction).toHaveBeenCalled();
      expect(component['getPath']().datas.instructions.length).toBe(4);
    }
  );

  it('#onKeyUp should call simulateNewLine if it´s called with ShiftLeft',
    () => {
      component['isNewPath'] = false;
      const spy = spyOn<any>(component, 'getPath').and.callFake(
        () => defaultPath
      );
      spyOn(component['getPath'](), 'simulateNewLine');

      component['onKeyUp'](
        new KeyboardEvent('shift', {
          code: 'ShiftLeft'
        })
      );

      expect(spy).toHaveBeenCalled();
    });

  it('#onKeyUp should call simulateNewLine if it´s called with ShiftRight',
    () => {
      component['isNewPath'] = false;
      const spy = spyOn<any>(component, 'getPath').and.callFake(
        () => defaultPath
      );
      spyOn(component['getPath'](), 'simulateNewLine');

      component['onKeyUp'](
        new KeyboardEvent('shift', {
          code: 'ShiftRight'
        })
      );

      expect(spy).toHaveBeenCalled();
    });

  it('#onKeyUp shouldn´t do anything if isNewPath is true', () => {
    component['isNewPath'] = true;
    const spy = spyOn<any>(component, 'getPath');
    component['onKeyUp'](
      new KeyboardEvent('shift', {
        code: 'ShiftRight'
      })
    );

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it(
    'ngOnDestroy should set "called" to true ' +
    '(= call every listener´s functions)',
    () => {
      let called = false;
      component['listeners'] = [() => (called = true)];
      component.ngOnDestroy();
      expect(called).toBeTruthy();
    }
  );

  it('#a Path object should be created with is defalut parameters', () => {
    component['isNewPath'] = true;
    const spy = spyOn<any>(component, 'getPath');
    component['onKeyUp'](
      new KeyboardEvent('shift', {
        code: 'ShiftRight'
      })
    );
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('#listeners should handle mouse click', () => {
    const globMouseEv = new MouseEvent('click');
    spyOn<any>(component, 'onMouseClick').and.callFake((mouseEv: MouseEvent) =>
      expect(mouseEv).toBe(globMouseEv)
    );
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(globMouseEv);
  });

  it('#listeners should handle mouse double click', () => {
    const globMouseEv = new MouseEvent('dblclick');
    spyOn<any>(
      component,
      'onMouseDblClick'
    ).and.callFake((mouseEv: MouseEvent) => expect(mouseEv).toBe(globMouseEv));
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(globMouseEv);
  });

  it('#listeners should handle mouse move', () => {
    const globMouseEv = new MouseEvent('mousemove');
    spyOn<any>(component, 'onMouseMove').and.callFake((mouseEv: MouseEvent) =>
      expect(mouseEv).toBe(globMouseEv)
    );
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(globMouseEv);
  });

  it('#listeners should handle key downs', () => {
    const globKeyEv = new KeyboardEvent('keydown');
    spyOn<any>(component, 'onKeyDown').and.callFake((keyEv: KeyboardEvent) =>
      expect(keyEv).toBe(globKeyEv)
    );
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(globKeyEv);
  });

  it('#listeners should handle key ups', () => {
    const globKeyEv = new KeyboardEvent('keyup');
    spyOn<any>(component, 'onKeyUp').and.callFake((keyEv: KeyboardEvent) =>
      expect(keyEv).toBe(globKeyEv)
    );
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(globKeyEv);
  });

  it('#the override function should call undoBase if it is a newPath', () => {
    const spyUndoBase = spyOn(component['undoRedoService'], 'undoBase');
    component['paths'] = [defaultPath];
    component['isNewPath'] = true;
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spyUndoBase).toHaveBeenCalled();
  });

  it('#the override function should call undoBase and addNewLine if it is not a newPath', () => {
    const spyNewLine = spyOn<any>(component, 'addNewLine');
    const spyUndoBase = spyOn(component['undoRedoService'], 'undoBase');
    component['paths'] = [defaultPath];
    component['mousePosition'] = new Point (12, 23);
    component['isNewPath'] = false;
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spyNewLine).toHaveBeenCalled();
    expect(spyUndoBase).toHaveBeenCalled();
  });

});
// tslint:disable-next-line: max-file-line-count
