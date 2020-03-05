import { TestBed } from '@angular/core/testing';
import {SVGStructure} from '../tool-logic/tool-logic.directive';
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
fdescribe('UndoRedoService', () => {
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

  // TODO : find a way to send a « false array » to refresh in order to
  //  restore initialCommand in testSVGStructure.drawZone
  // it('refresh should restore the initial command if an' +
  //   ' empty array is passed', () => {
  //   const ellipse1 = createEllipse();
  //   const ellipse2 = createEllipse();
  //   const ellipse3 = createEllipse();
  //   testSVGStructure.drawZone.appendChild(ellipse1);
  //   testSVGStructure.drawZone.appendChild(ellipse2);
  //   service['initialCommand'] = [ellipse3];
  //   service.saveState();
  //   service.refresh();
  //   expect(
  //     Array.from(testSVGStructure.drawZone.children) as SVGElement[]
  //   ).toEqual([ellipse3]);
  // });

  });
