import { TestBed } from '@angular/core/testing';
import { SVGStructure } from '../../svg/svg-structure';
import { UndoRedoService } from './undo-redo.service';

const createEllipse = (): SVGElement => {
  const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'svg:ellipse');
  ellipse.setAttribute('ellipse', '');
  ellipse.setAttribute('cx', '205');
  ellipse.setAttribute('cy', '441');
  ellipse.setAttribute('rx', '81');
  ellipse.setAttribute('ry', '18');
  ellipse.setAttribute('fill-opacity', '1');
  ellipse.setAttribute('fill', 'rgba(230, 25, 75, 1)');
  ellipse.setAttribute('stroke-width', '2');
  ellipse.setAttribute('stroke', 'rgba(240, 50, 230, 1)');
  return ellipse;
};

// tslint:disable:no-string-literal
describe('UndoRedoService', () => {
  let service: UndoRedoService;
  let testSVGStructure: SVGStructure;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    testSVGStructure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    testSVGStructure.root.appendChild(testSVGStructure.defsZone);
    testSVGStructure.root.appendChild(testSVGStructure.drawZone);
    testSVGStructure.root.appendChild(testSVGStructure.temporaryZone);
    testSVGStructure.root.appendChild(testSVGStructure.endZone);

    service = TestBed.get(UndoRedoService);
    service.intialise(testSVGStructure);
    }
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initialise should initalise the svgStructure element', () => {
    service.intialise(testSVGStructure);
    expect(service['svgStructure']).toBe(testSVGStructure);
  });

  it('setStartingCommand should initialise the initialCommand ' +
    'as a SVGElement table', () => {
    service.setStartingCommand();
    expect(service['initialCommand']).toEqual(
      Array.from(testSVGStructure.drawZone.children) as SVGElement[]
    );
  });

  it('resetActions should call 2 times createDefaultPreAction ' +
    'and createDefaultPostAction', () => {
    const spyOnPre = spyOn<any>(service, 'createDefaultPreAction');
    const spyOnPost = spyOn<any>(service, 'createDefaultPostAction');
    service.resetActions();
    expect(spyOnPre).toHaveBeenCalledTimes(2);
    expect(spyOnPost).toHaveBeenCalledTimes(2);
  });

  it ('clearUndoRedo should assign empty arrays to the cmdDone ' +
    'and cmdUndone attributes', () => {
      const ellipse = createEllipse();
      testSVGStructure.drawZone.appendChild(ellipse);
      service['cmdDone'].push([ellipse]);
      service['cmdUndone'].push([ellipse]);
      service.clearUndoRedo();
      expect(service['cmdDone']).toEqual([]);
      expect(service['cmdUndone']).toEqual([]);
  });

  it('saveState should save the ellipses created in cmdDone', () => {
    service.clearUndoRedo();
    const ellipse1 = createEllipse();
    const ellipse2 = createEllipse();
    const ellipse3 = createEllipse();
    const ellipse4 = createEllipse();
    testSVGStructure.drawZone.appendChild(ellipse1);
    testSVGStructure.drawZone.appendChild(ellipse2);
    testSVGStructure.drawZone.appendChild(ellipse3);
    testSVGStructure.drawZone.appendChild(ellipse4);
    service.saveState();
    expect(service['cmdDone']).toEqual([[ellipse1, ellipse2, ellipse3, ellipse4]]);
  });

  it('cmdDone should contain an empty array if saveState is called' +
    ' while the drawZone is empty', () => {
    service.clearUndoRedo();
    service.saveState();
    expect(service['cmdDone']).toEqual([[]]);
  });

  it('saveState should contain 2 arrays containing the ellipses when ' +
    'called two times with modifications in between', () => {
    service.clearUndoRedo();
    const ellipse1 = createEllipse();
    const ellipse2 = createEllipse();
    const ellipse3 = createEllipse();
    const ellipse4 = createEllipse();
    testSVGStructure.drawZone.appendChild(ellipse1);
    testSVGStructure.drawZone.appendChild(ellipse2);
    service.saveState();
    testSVGStructure.drawZone.appendChild(ellipse3);
    testSVGStructure.drawZone.appendChild(ellipse4);
    service.saveState();
    expect(service['cmdDone']).toEqual(
      [
        [ellipse1, ellipse2],
        [ellipse1, ellipse2, ellipse3, ellipse4]
      ]);
  });

  it('saveState should empty the cmdUndone attribute', () => {
    service['cmdUndone'].push([createEllipse()]);
    service.saveState();
    expect(service['cmdUndone']).toEqual([]);
  });

  it('saveState should only save objects from the drawZone', () => {
    testSVGStructure.temporaryZone.appendChild(createEllipse());
    testSVGStructure.defsZone.appendChild(createEllipse());
    testSVGStructure.endZone.appendChild(createEllipse());
    service.saveState();
    expect(service['cmdDone']).toEqual([[]]);
  });

  it('undoBase should not do anything if nothing has been saved ' +
    'i.e. if cmdDone is empty', () => {
    service.clearUndoRedo();
    const spy = spyOn(service, 'refresh');
    service.undoBase();
    expect(spy).not.toHaveBeenCalled();
  });

  it('undoBase should move the last item of cmdDone into cmdUndone' +
    ' and call the refresh method', () => {
    const spy = spyOn(service, 'refresh');
    const ellipse1 = createEllipse();
    testSVGStructure.drawZone.appendChild(ellipse1);
    service.saveState();
    expect(service['cmdDone']).toEqual([[ellipse1]]);
    service.undoBase();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(service['cmdUndone']).toEqual([[ellipse1]]);
    expect(service['cmdDone']).toEqual([]);
  });

  it('redoBase should not do anything if cmdUndone is empty', () => {
    const spy = spyOn(service, 'refresh');
    service.redoBase();
    expect(spy).not.toHaveBeenCalled();
  });

  it('redoBase should move the last item of cmdDone ' +
    'to cmdUndone and call the refresh method', () => {
    const spy = spyOn(service, 'refresh');
    const ellipse1 = createEllipse();
    testSVGStructure.drawZone.appendChild(ellipse1);
    service.saveState();
    service.undoBase();
    expect(service['cmdDone']).toEqual([]);
    service.redoBase();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(service['cmdUndone']).toEqual([]);
    expect(service['cmdDone']).toEqual([[ellipse1]]);
  });

  it('canUndo should return false if cmdDone is empty, true ' +
    'if cmdDone is not empty', () => {
    service.clearUndoRedo();
    expect(service.canUndo()).toBeFalsy();
    service['cmdDone'].push([createEllipse()]);
    expect(service.canUndo()).toBeTruthy();
  });

  it('canRedo should return false if cmdUndone is empty, true ' +
    'if cmdUndone is not empty', () => {
    service.clearUndoRedo();
    expect(service.canRedo()).toBeFalsy();
    service['cmdUndone'].push([createEllipse()]);
    expect(service.canRedo()).toBeTruthy();
  });

  it('refresh should append the childNodes of the nodes passed ' +
    'as a parameter to drawZone', () => {
    const ellipse1 = createEllipse();
    const ellipse2 = createEllipse();
    testSVGStructure.drawZone.appendChild(ellipse1);
    testSVGStructure.drawZone.appendChild(ellipse2);
    service.saveState();
    service.refresh([ellipse1]);
    expect(
      Array.from(testSVGStructure.drawZone.children) as SVGElement[]
    ).toEqual([ellipse1]);  });

  it('refresh should restore the initial command if an' +
    ' empty array is passed', () => {
    const ellipse1 = createEllipse();
    const ellipse2 = createEllipse();
    const ellipse3 = createEllipse();
    testSVGStructure.drawZone.appendChild(ellipse1);
    testSVGStructure.drawZone.appendChild(ellipse2);
    service['initialCommand'] = [ellipse3];
    service.saveState();
    service.refresh(undefined as unknown as ChildNode[]);
    expect(
      Array.from(testSVGStructure.drawZone.children) as SVGElement[]
    ).toEqual([ellipse3]);
  });

  it('createDefaultPreActions should return a conform object with the default' +
    'options', () => {
    expect(service['createDefaultPreAction']()).toEqual({
      enabled: false,
      overrideDefaultBehaviour: false,
      overrideFunctionDefined: false
    });
  });

  it('createDefaultPostActions should return a conform object with the default' +
    'options', () => {
    expect(service['createDefaultPostAction']()).toEqual({
      functionDefined: false
    });
  });

  it('setPreUndoAction should set the parameter as the first item of undo', () => {
    const expectedAction = {
      enabled: true,
      overrideDefaultBehaviour: true,
      overrideFunctionDefined: true,
      overrideFunction: () => true
    };
    service.setPreUndoAction(expectedAction);
    expect(service['actions'].undo[0]).toEqual(expectedAction);
  });

  it('setPostUndoAction should set the parameter as the first item of undo', () => {
    const expectedAction = {
      functionDefined: false,
    };
    service.setPostUndoAction(expectedAction);
    expect(service['actions'].undo[1]).toEqual(expectedAction);
  });

  it('setPreRedoAction should set the parameter as the first item of undo', () => {
    const expectedAction = {
      enabled: true,
      overrideDefaultBehaviour: true,
      overrideFunctionDefined: true,
      overrideFunction: () => true
    };
    service.setPreRedoAction(expectedAction);
    expect(service['actions'].redo[0]).toEqual(expectedAction);
  });

  it('setPostRedoAction should set the parameter as the first item of undo', () => {
    const expectedAction = {
      functionDefined: false,
    };
    service.setPostRedoAction(expectedAction);
    expect(service['actions'].redo[1]).toEqual(expectedAction);
  });

  it('undo should call the overrideFunction of undo when it is defined, ' +
    'the function of PostAction when defined and not call undoBase if the preAction is' +
    ' set not to overrideDefaultBehaviour', () => {
    let called = false;
    const callback = jasmine.createSpy().and.callFake(() => { called = true; });
    const spy = spyOn<any>(service, 'undoBase');
    service['actions'].undo = [
      {
        enabled: true,
        overrideDefaultBehaviour: true,
        overrideFunctionDefined: true,
        overrideFunction: callback
      }, {
        functionDefined: true,
        function: callback
      }
     ];
    service.undo();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(spy).not.toHaveBeenCalled();
    expect(called).toBeTruthy();
  });

  it('undo should not call the overrideFunction of undo when it is not defined, ' +
    'nor the function of PostAction when not defined and call undoBase if the preAction is' +
    ' set to overrideDefaultBehaviour', () => {
    let called = false;
    const callback = jasmine.createSpy().and.callFake(() => { called = true; });
    const spy = spyOn<any>(service, 'undoBase');
    service['actions'].undo = [
      {
        enabled: false,
        overrideDefaultBehaviour: false,
        overrideFunctionDefined: false,
        overrideFunction: callback
      }, {
        functionDefined: false,
        function: callback
      }
     ];
    service.undo();
    expect(callback).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(called).toBeFalsy();
  });

  it('redo should call the overrideFunction of redo when it is defined, ' +
    'the function of PostAction when defined and not call redoBase if the preAction is' +
    ' set not to overrideDefaultBehaviour', () => {
    let called = false;
    const callback = jasmine.createSpy().and.callFake(() => { called = true; });
    const spy = spyOn<any>(service, 'redoBase');
    service['actions'].redo = [
      {
        enabled: true,
        overrideDefaultBehaviour: true,
        overrideFunctionDefined: true,
        overrideFunction: callback
      }, {
        functionDefined: true,
        function: callback
      }
     ];
    service.redo();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(spy).not.toHaveBeenCalled();
    expect(called).toBeTruthy();
  });

  it('redo should not call the overrideFunction of redo when it is not defined, ' +
    'nor the function of PostAction when not defined and call redoBase if the preAction is' +
    ' set to overrideDefaultBehaviour', () => {
    let called = false;
    const callback = jasmine.createSpy().and.callFake(() => { called = true; });
    const spy = spyOn<any>(service, 'redoBase');
    service['actions'].redo = [
      {
        enabled: false,
        overrideDefaultBehaviour: false,
        overrideFunctionDefined: false,
        overrideFunction: callback
      }, {
        functionDefined: false,
        function: callback
      }
     ];
    service.redo();
    expect(callback).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(called).toBeFalsy();
  });

  });
