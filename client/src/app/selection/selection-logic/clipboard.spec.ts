import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgShape } from 'src/app/svg/svg-shape';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { Clipboard } from './clipboard';
import { SelectionLogicComponent } from './selection-logic.component';

// tslint:disable: no-magic-numbers no-string-literal no-any
describe('Clipboard', () => {
  let component: SelectionLogicComponent;
  let fixture: ComponentFixture<SelectionLogicComponent>;
  let instance: Clipboard;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionLogicComponent ],
      providers: [
        Renderer2
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionLogicComponent);
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

    const rec1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec1.setAttribute('x', '155');
    rec1.setAttribute('y', '135');
    rec1.setAttribute('width', '100');
    rec1.setAttribute('height', '100');
    rec1.setAttribute('stroke-width', '5');
    const rec2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec2.setAttribute('x', '225');
    rec2.setAttribute('y', '305');
    rec2.setAttribute('width', '100');
    rec2.setAttribute('height', '100');
    rec2.style.strokeWidth = '2';
    const rec3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec2.setAttribute('x', '625');
    rec2.setAttribute('y', '905');
    rec2.setAttribute('width', '100');
    rec2.setAttribute('height', '100');
    rec2.style.strokeWidth = '2';
    rec3.classList.add('filter1');
    component.svgStructure.drawZone.appendChild(rec1);
    component.svgStructure.drawZone.appendChild(rec2);
    component.svgStructure.drawZone.appendChild(rec3);

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component.svgStructure);
    instance = component['clipboard'];
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(new Clipboard(component)).toBeTruthy();
  });

  it('#onCopy should change the clipBoard so that it eqauls to the selectedElements ', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );
    component['service']['selectedElements'] = new Set (allElements);
    instance.copy();
    expect(component['service']['clipboard'][0]).toEqual(component['service']['selectedElements']);
  });

  it('#the subscribe of onCopy should work ', (done: DoneFn) => {
    const spy = spyOn (instance, 'copy');
    component['service'].copy.next(null);
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

  it('#the onCut should remove elements from the svg ', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );
    component['service']['selectedElements'] = new Set (allElements);
    expect(Array.from(component.svgStructure.drawZone.children) as SVGElement[]).not.toEqual([]);
    instance.cut();
    expect(Array.from(component.svgStructure.drawZone.children) as SVGElement[]).toEqual([]);
  });

  it('#the onCut should change the clipboard', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );
    component['service']['selectedElements'] = new Set (allElements);
    const clipboard = component['service']['clipboard'][0];
    instance.cut();
    expect(component['service']['clipboard'][0]).not.toEqual(clipboard);
  });

  it('#onPaste should make a tranlation of the clipboard of 30', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );
    component['service']['selectedElements'] = new Set (allElements);
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component.svgShape = svgShapeTest;
    instance.copy();
    for ( const element of component['service']['clipboard'].peak()) {
      expect(element.attributes.getNamedItem('transform')).toEqual(null);
    }
    instance.paste();
    for ( const element of component['service']['clipboard'].peak()) {
      expect((element.attributes.getNamedItem('transform')as Attr).value).toEqual('matrix(1,0,0,1,30,30)');
    }
  });

  it('#onPaste should make a negative tranlation of the clipboard even if their is no intersection', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );
    component['service']['selectedElements'] = new Set (allElements);
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 0,
      height: 0
    };
    component.svgShape = svgShapeTest;
    component['service']['clipboard'] = [allElements, allElements];
    for ( const element of component['service']['clipboard'].peak()) {
      expect(element.attributes.getNamedItem('transform')).toEqual(null);
    }
    instance.paste();
    for ( const element of component['service']['clipboard'].peak()) {
      expect((element.attributes.getNamedItem('transform')as Attr).value).toEqual('matrix(1,0,0,1,-30,-30)');
    }
  });

  it('#onPaste should make no tranlation of the clipboard if their is multiple SET that are not in the svg', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );
    component['service']['selectedElements'] = new Set (allElements);
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 5000,
      height: 5000
    };
    component.svgShape = svgShapeTest;
    const rec3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    const newSet =  new Set<SVGElement>(Array.from([rec3]) as SVGElement[]);
    component['service']['clipboard'] = [newSet, newSet];
    for ( const element of component['service']['clipboard'].peak()) {
      expect(element.attributes.getNamedItem('transform')).toEqual(null);
    }
    instance.paste();
    for ( const element of component['service']['clipboard'].peak()) {
      expect((element.attributes.getNamedItem('transform')as Attr).value).toEqual('matrix(1,0,0,1,-30,-30)');
    }
  });

  it('#onPaste should not do anything if the clipboard is empty', () => {

    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component.svgShape = svgShapeTest;
    const spy = spyOn (instance, 'clipboardValid');
    instance.paste();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onPaste should paste even if the tags are not in the svg', () => {

    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component.svgShape = svgShapeTest;
    const test = new Set<SVGElement>();
    const rec1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec1.setAttribute('x', '155');
    rec1.setAttribute('y', '135');
    test.add(rec1);
    component.service.clipboard = [test, test];
    const spy = spyOn (instance, 'clipboardValid');
    instance.paste();
    expect(spy).toHaveBeenCalled();
  });

  it('#the onDelete should remove elements from the svg ', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );
    component['service']['selectedElements'] = new Set (allElements);
    expect(Array.from(component.svgStructure.drawZone.children) as SVGElement[]).not.toEqual([]);
    instance.delete();
    expect(Array.from(component.svgStructure.drawZone.children) as SVGElement[]).toEqual([]);
  });

  it('#onDuplicate should select a new pair of forms', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );
    component['service']['selectedElements'] = new Set (allElements);
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component.svgShape = svgShapeTest;
    instance.copy();
    const selectedElements = component['service']['selectedElements'];
    instance.duplicate();
    expect(selectedElements).not.toEqual(component['service']['selectedElements']);
  });

  it('#onDuplicate should select the same forms if its out of the svg', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );
    component['service']['selectedElements'] = new Set (allElements);
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 0,
      height: 0
    };
    component.svgShape = svgShapeTest;
    instance.copy();
    const selectedElements = component['service']['selectedElements'];
    instance.duplicate();
    expect(selectedElements).not.toEqual(component['service']['selectedElements']);
  });

  it('#isInside should return true or false depending on the SET given in parameters', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );

    expect(instance.clipboardValid(allElements)).toEqual(true);
    expect(instance.clipboardValid(new Set<SVGElement>())).toEqual(false);
    const rec3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    const newSet =  new Set<SVGElement>(Array.from([rec3]) as SVGElement[]);
    expect(instance.clipboardValid(newSet)).toEqual(true);
  });

  it('#isInside should return true if the elements are in the svg', () => {

    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component.svgShape = svgShapeTest;
    const allElements = new Set<SVGElement>(
      Array.from(component.svgStructure.drawZone.children) as SVGElement[]
    );
    component['service']['selectedElements'] = new Set (allElements);
    expect(instance.isInside(allElements)).toEqual(true);
  });

  it('#without selectedElements the methos delete, copy and curt should not do anything', () => {

    const clipboardBefore = component['service']['clipboard'];
    instance.copy();
    expect(clipboardBefore).toEqual(component['service']['clipboard']);
    const spy1 = spyOn (component, 'deleteVisualisation');
    instance.cut();
    expect(spy1).not.toHaveBeenCalled();
    instance.delete();
    expect(spy1).not.toHaveBeenCalled();

  });

  it('#add Tag should correctly add a tag in the element', () => {
    const rec1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec1.setAttribute('x', '155');
    rec1.setAttribute('y', '135');
    const classList = rec1.classList.value;
    instance['addTag'](rec1, 'test');
    expect(rec1.classList.value).not.toEqual(classList);
  });

  it('#delete Tag should correctly delete the tag in the element', () => {
    const rec1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec1.setAttribute('x', '155');
    rec1.setAttribute('y', '135');
    instance['addTag'](rec1, 'test');
    instance['addTag'](rec1, 'clipboard2');
    instance['deleteTag'](rec1);
    expect(rec1.classList.value).toEqual('test');
    instance['deleteTag'](rec1);
    expect(rec1.classList.value).toEqual('test');
    const rec2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec1.setAttribute('x', '155');
    rec1.setAttribute('y', '135');
    instance['addTag'](rec2, 'clipboard3');
    instance['deleteTag'](rec2);
    expect(rec2.classList.value).toEqual('');
  });

  it('#getCurrentTags should return the correct tags', () => {
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component.svgShape = svgShapeTest;
    const allElements = new Set<SVGElement>();
    const rec1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec1.setAttribute('x', '155');
    rec1.setAttribute('y', '135');
    instance['addTag'](rec1, 'test');
    instance['addTag'](rec1, 'clipBoard');
    allElements.add(rec1);

    const rec2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec2.setAttribute('x', '155');
    rec2.setAttribute('y', '135');
    instance['addTag'](rec2, 'test');
    instance['addTag'](rec2, 'clipBoards');
    allElements.add(rec2);
    expect(instance['getCurrentTags'](allElements)).not.toEqual(new Set());
  });

  it('#tagsExistInSVG should return the correct tags', () => {
    const svgShapeTest: SvgShape = {
      color: 'blue',
      width: 1345,
      height: 245
    };
    component.svgShape = svgShapeTest;

    const set = new Set<string>();
    set.add('test');
    set.add('test2');
    set.add('filter1');
    expect(instance['tagsExistInSVG'](set)).not.toEqual(true);
  });

  it('#the subscribe of onCut should work ', (done: DoneFn) => {
    const spy = spyOn (instance, 'cut');
    component['service'].cut.next(null);
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });
  it('#the subscribe of onDuplicate should work ', (done: DoneFn) => {
    const spy = spyOn (instance, 'duplicate');
    component['service'].duplicate.next(null);
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });
  it('#the subscribe of onDuplicate should work ', (done: DoneFn) => {
    const spy = spyOn (instance, 'delete');
    component['service'].delete.next(null);
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });
  it('#the subscribe of onPaste should work ', (done: DoneFn) => {
    const spy = spyOn (instance, 'paste');
    component['service'].paste.next(null);
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

});
