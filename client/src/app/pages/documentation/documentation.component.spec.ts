import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/material.module';
import { DocumentationComponent, Node } from './documentation.component';

describe('DocumentationComponent', () => {
  let component: DocumentationComponent;
  let fixture: ComponentFixture<DocumentationComponent>;
  const defaultArray = new Array<Node>(
    {
      label: 'Parent1',
      children: [
        {
          label: 'Enfant1',
          children: [
            { label: 'PetitEnfant1' },
            { label: 'PetitEnfant2' }
          ]
        },
        { label: 'Enfant2' }
      ]
    },
    { label: 'Parent2' },
    { label: 'Parent3' }
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentationComponent],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* tslint:disable:no-string-literal */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#constructLeafNodeArray should create the correct table', () => {

    const expectedArray: Node[] = Array<Node>(
      { label: 'PetitEnfant1', id: 0 },
      { label: 'PetitEnfant2', id: 1 },
      { label: 'Enfant2', id: 2 },
      { label: 'Parent2', id: 3 },
      { label: 'Parent3', id: 4 }
    );

    component.leafNodeArray = new Array<Node>();
    component['constructLeafNodeArray'](defaultArray);
    expect(component.leafNodeArray).toEqual(expectedArray);
  });

  it('#contructLeafNodeArray should create an empty ' +
    'table when called with empty parameters', () => {
      const refArray: Node[] = new Array<Node>();
      const expectedArray: Node[] = Array<Node>();

      component.leafNodeArray = new Array<Node>();
      component['constructLeafNodeArray'](refArray);
      expect(component.leafNodeArray).toEqual(expectedArray);
    });

  it('#contructLeafNodeArray should create a one node table' +
    'when called with same names objects', () => {
      const refArray: Node[] = new Array<Node>(
        {
          label: 'Parent1',
          children: [
            {
              label: 'Enfant1',
              children: [
                { label: 'Enfant1' },
                { label: 'Enfant1' }
              ]
            },
            { label: 'Enfant2' }
          ]
        },
        { label: 'Parent2' },
        { label: 'Parent3' }
      );

      const expectedArray: Node[] = Array<Node>(
        { label: 'Enfant1', id: 0 },
        { label: 'Enfant2', id: 1 },
        { label: 'Parent2', id: 2 },
        { label: 'Parent3', id: 3 }
      );

      component.leafNodeArray = new Array<Node>();
      component['constructLeafNodeArray'](refArray);
      expect(component.leafNodeArray).toEqual(expectedArray);
    });

  it('#leafNodeArrayContains should return true' +
    'if leafNodeArray contains the node passed', () => {
      component.leafNodeArray = new Array<Node>(
        { label: 'Enfant1', id: 0 },
        { label: 'Enfant2', id: 1 },
        { label: 'Parent2', id: 2 },
        { label: 'Parent3', id: 3 }
      );

      const refNode: Node = { label: 'Enfant1' };

      expect(component['leafNodeArrayContains'](refNode)).toBe(true);
    });

  it('#leafNodeArrayContains should return false if leafNodeArray ' +
    'does not contain the node passed', () => {
      component.leafNodeArray = new Array<Node>(
        { label: 'Enfant1', id: 0 },
        { label: 'Enfant2', id: 1 },
        { label: 'Parent2', id: 2 },
        { label: 'Parent3', id: 3 }
      );

      const refNode: Node = { label: 'Enfant3' };

      expect(component['leafNodeArrayContains'](refNode)).toBe(false);
    });

  it('#expand should expand the parent node of the node id passed', () => {
    const refArray: Node[] = new Array<Node>(
      {
        label: 'Parent1',
        children: [
          {
            label: 'Enfant1',
            children: [
              { label: 'PetitEnfant1', id: 0 },
              { label: 'petitEnfant2', id: 1 }
            ]
          },
          { label: 'Enfant2', id: 2 }
        ]
      },
      { label: 'Parent2', id: 3 },
      { label: 'Parent3', id: 4 }
    );

    const refNode1: Node = {
      label: 'Enfant1',
      children: [
        { label: 'PetitEnfant1', id: 0 },
        { label: 'petitEnfant2', id: 1 }
      ]
    };

    const refNode2: Node = {
      label: 'Parent1',
      children: [
        {
          label: 'Enfant1',
          children: [
            { label: 'PetitEnfant1', id: 0 },
            { label: 'petitEnfant2', id: 1 }
          ]
        },
        { label: 'Enfant2', id: 2 }
      ]
    };

    spyOn(component.treeControl, 'expand');

    component['expandParent'](refArray, 0);
    expect(component.treeControl.expand).toHaveBeenCalledTimes(2);
    expect(component.treeControl.expand).toHaveBeenCalledWith(refNode1);
    expect(component.treeControl.expand).toHaveBeenCalledWith(refNode2);
  });

  it('#expand shouldn´t expand anything if the note passed has no parents',
    () => {
      const refArray: Node[] = new Array<Node>(
        {
          label: 'Parent1',
          children: [
            {
              label: 'Enfant1',
              children: [
                { label: 'PetitEnfant1', id: 0 },
                { label: 'petitEnfant2', id: 1 }
              ]
            },
            { label: 'Enfant2', id: 2 }
          ]
        },
        { label: 'Parent2', id: 3 },
        { label: 'Parent3', id: 4 }
      );

      spyOn(component.treeControl, 'expand');

      component['expandParent'](refArray, 4);
      expect(component.treeControl.expand).toHaveBeenCalledTimes(0);
    });

  it('#expand shouldn´t expand anything if the node passed doesn´t exist',
    () => {
      const refArray: Node[] = new Array<Node>(
        {
          label: 'Parent1',
          children: [
            {
              label: 'Enfant1',
              children: [
                { label: 'PetitEnfant1', id: 0 },
                { label: 'petitEnfant2', id: 1 }
              ]
            },
            { label: 'Enfant2', id: 2 }
          ]
        },
        { label: 'Parent2', id: 3 },
        { label: 'Parent3', id: 4 }
      );

      spyOn(component.treeControl, 'expand');

      component['expandParent'](refArray, 5);
      expect(component.treeControl.expand).toHaveBeenCalledTimes(0);
    });

  it('#hasChild should return true if the node has children', () => {
    const refNode: Node = {
      label: 'Parent1',
      children: [
        {
          label: 'Enfant1',
          children: [
            { label: 'PetitEnfant1', id: 0 },
            { label: 'petitEnfant2', id: 1 }
          ]
        },
        { label: 'Enfant2', id: 2 }
      ]
    };

    expect(component.hasChild(42, refNode)).toBe(true);
  });

  it('#hasChild should return false if the node has no children', () => {
    const refNode: Node = { label: 'Enfant1' };

    expect(component.hasChild(42, refNode)).toBe(false);
  });

  it('#next() should not change contentToDisplay if already at last node',
    () => {
      component.leafNodeArray = new Array<Node>();
      component['constructLeafNodeArray'](defaultArray);
      component['displayNodeContent'](defaultArray[defaultArray.length - 1]);
      const refContent = defaultArray[defaultArray.length - 1];
      component['next']();
      expect(
        component.contentToDisplay.title === refContent.label
      ).toBeTruthy();
    });

  it('#next() should change contentToDisplay if not at the last node', () => {
    component.dataSource.data = defaultArray;
    component.leafNodeArray = [];
    component['constructLeafNodeArray'](defaultArray);

    component.contentToDisplay = { title: 'PetitEnfant1', body: 'PLACEHOLDER' };
    component.currentNodeIndex = 0;

    component['next']();

    expect(component.contentToDisplay.title).toEqual('PetitEnfant2')
  });

  it('#previous() shouldn´t change contentToDisplay if at first node', () => {
    component.dataSource.data = defaultArray;
    component.leafNodeArray = [];
    component['constructLeafNodeArray'](defaultArray);

    component.contentToDisplay = { title: 'PetitEnfant1', body: 'PLACEHOLDER' };
    component.currentNodeIndex = 0;

    component['previous']();

    expect(component.contentToDisplay.title).toEqual('PetitEnfant1')
  });

  it('#previous() should change contentToDisplay if not at first node', () => {
    component.dataSource.data = defaultArray;
    component.leafNodeArray = [];
    component['constructLeafNodeArray'](defaultArray);

    component.contentToDisplay = { title: 'PetitEnfant2', body: 'PLACEHOLDER' };
    component.currentNodeIndex = 1;

    component['previous']();

    expect(component.contentToDisplay.title).toEqual('PetitEnfant1')
  });

  it('#isFirstNode() should return true if at first node', () => {
    component.leafNodeArray = new Array<Node>();
    component['constructLeafNodeArray'](defaultArray);

    component.currentNodeIndex = 0;
    expect(component['isLastNode']).toBeTruthy();
  });

  it('#isLastNode() should return false if at last node', () => {
    component.leafNodeArray = new Array<Node>();
    component['constructLeafNodeArray'](defaultArray);

    component.currentNodeIndex = defaultArray.length + 1;
    expect(component['isLastNode']).toBeTruthy();
  });

  it('#displayContent shouldn´t update contentNodeIndex'
  +  'if the node passed has no id', () => {
    component['displayNodeContent']({ label: 'nodeTest' });
    component.currentNodeIndex = 0;
    expect(component.currentNodeIndex).toBe(0);
  });

});
