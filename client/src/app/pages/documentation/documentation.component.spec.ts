import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/material.module';
import { DocumentationComponent, Node } from './documentation.component';

describe('DocumentationComponent', () => {
  let component: DocumentationComponent;
  let fixture: ComponentFixture<DocumentationComponent>;
  const defaultArray = new Array<Node>(
    {label: 'Parent1',
      children: [
        {label: 'Enfant1',
          children: [
            {label: 'PetitEnfant1'},
            {label: 'PetitEnfant2'}
          ]},
        {label: 'Enfant2'}
      ]},
    {label: 'Parent2'},
    {label: 'Parent3'}
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentationComponent ],
      imports: [MaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#constructLeafNodeArray devrait creer le tableau correctement.', () => {

    const expectedArray: Node[] = Array<Node>(
      {label: 'PetitEnfant1', id: 0},
      {label: 'PetitEnfant2', id: 1},
      {label: 'Enfant2', id: 2},
      {label: 'Parent2', id: 3},
      {label: 'Parent3', id: 4}
    );

    component.leafNodeArray = new Array<Node>();
    component.constructLeafNodeArray(defaultArray);
    expect(component.leafNodeArray).toEqual(expectedArray);
  });

  it('#contructLeafNodeArray devrait creer un tableau vide avec des parametres vide', () => {
    const refArray: Node[] = new Array<Node>();
    const expectedArray: Node[] = Array<Node>();

    component.leafNodeArray = new Array<Node>();
    component.constructLeafNodeArray(refArray);
    expect(component.leafNodeArray).toEqual(expectedArray);
  });

  it('#contructLeafNodeArray devrait creer un tableau contenant une seule node quand l entree en contitent plusieur du meme nom.', () => {
    const refArray: Node[] = new Array<Node>(
      {label: 'Parent1',
        children: [
          {label: 'Enfant1',
            children: [
              {label: 'Enfant1'},
              {label: 'Enfant1'}
            ]},
          {label: 'Enfant2'}
        ]},
      {label: 'Parent2'},
      {label: 'Parent3'}
    );

    const expectedArray: Node[] = Array<Node>(
      {label: 'Enfant1', id: 0},
      {label: 'Enfant2', id: 1},
      {label: 'Parent2', id: 2},
      {label: 'Parent3', id: 3}
    );

    component.leafNodeArray = new Array<Node>();
    component.constructLeafNodeArray(refArray);
    expect(component.leafNodeArray).toEqual(expectedArray);
  });

  it('#leafNodeArrayContains devrait retourner true si leafNodeArray contient la node en parametre.', () => {
    component.leafNodeArray = new Array<Node>(
      {label: 'Enfant1', id: 0},
      {label: 'Enfant2', id: 1},
      {label: 'Parent2', id: 2},
      {label: 'Parent3', id: 3}
    );

    const refNode: Node = {label: 'Enfant1'};

    expect(component.leafNodeArrayContains(refNode)).toBe(true);
  });

  it('#leafNodeArrayContains devrais retourner false si leafNodeArray ne contient pas la node en parametre.', () => {
    component.leafNodeArray = new Array<Node>(
      {label: 'Enfant1', id: 0},
      {label: 'Enfant2', id: 1},
      {label: 'Parent2', id: 2},
      {label: 'Parent3', id: 3}
    );

    const refNode: Node = {label: 'Enfant3'};

    expect(component.leafNodeArrayContains(refNode)).toBe(false);
  });

  it('#expand devrait expand les nodes parent de la node id en parametre', () => {
    const refArray: Node[] = new Array<Node>(
      {label: 'Parent1',
        children: [
          {label: 'Enfant1',
            children: [
              {label: 'PetitEnfant1', id: 0},
              {label: 'petitEnfant2', id: 1}
            ]},
          {label: 'Enfant2', id: 2}
        ]},
      {label: 'Parent2', id: 3},
      {label: 'Parent3', id: 4}
    );

    const refNode1: Node = {
    label: 'Enfant1',
    children: [
      {label: 'PetitEnfant1', id: 0},
      {label: 'petitEnfant2', id: 1}
    ]};

    const refNode2: Node = {
      label: 'Parent1',
      children: [
        {label: 'Enfant1',
          children: [
            {label: 'PetitEnfant1', id: 0},
            {label: 'petitEnfant2', id: 1}
          ]},
        {label: 'Enfant2', id: 2}
    ]};

    spyOn(component.treeControl, 'expand');

    component.expandParent(refArray, 0);
    expect(component.treeControl.expand).toHaveBeenCalledTimes(2);
    expect(component.treeControl.expand).toHaveBeenCalledWith(refNode1);
    expect(component.treeControl.expand).toHaveBeenCalledWith(refNode2);
  });

  it('#expand devrait expand aucune node si le parametre id n\'a pas de parent', () => {
    const refArray: Node[] = new Array<Node>(
      {label: 'Parent1',
        children: [
          {label: 'Enfant1',
            children: [
              {label: 'PetitEnfant1', id: 0},
              {label: 'petitEnfant2', id: 1}
            ]},
          {label: 'Enfant2', id: 2}
        ]},
      {label: 'Parent2', id: 3},
      {label: 'Parent3', id: 4}
    );

    spyOn(component.treeControl, 'expand');

    component.expandParent(refArray, 4);
    expect(component.treeControl.expand).toHaveBeenCalledTimes(0);
  });

  it('#expand devrait expand aucune node si le parametre id n\'existe pas', () => {
    const refArray: Node[] = new Array<Node>(
      {label: 'Parent1',
        children: [
          {label: 'Enfant1',
            children: [
              {label: 'PetitEnfant1', id: 0},
              {label: 'petitEnfant2', id: 1}
            ]},
          {label: 'Enfant2', id: 2}
        ]},
      {label: 'Parent2', id: 3},
      {label: 'Parent3', id: 4}
    );

    spyOn(component.treeControl, 'expand');

    component.expandParent(refArray, 5);
    expect(component.treeControl.expand).toHaveBeenCalledTimes(0);
  });

  it('#hasChild doit retourner true si la node a des enfants.', () => {
    const refNode: Node = {
      label: 'Parent1',
      children: [
        {label: 'Enfant1',
          children: [
            {label: 'PetitEnfant1', id: 0},
            {label: 'petitEnfant2', id: 1}
          ]},
        {label: 'Enfant2', id: 2}
    ]};

    expect(component.hasChild(42, refNode)).toBe(true);
  });

  it('#hasChild doit retourner false si la node n\'a pas d\'enfants.', () => {
    const refNode: Node = {label: 'Enfant1'};

    expect(component.hasChild(42, refNode)).toBe(false);
  });

  it('#next() ne devrait pas changer la variable contentToDisplay',
    () => {
      component.leafNodeArray = new Array<Node>();
      component.constructLeafNodeArray(defaultArray);
      component.displayNodeContent(defaultArray[defaultArray.length - 1]);
      const refContent = defaultArray[defaultArray.length - 1];
      component.next();
      expect(
        component.contentToDisplay.title === refContent.label
      ).toBeTruthy();
  });

  it('#next() devrait changer la variable contentToDisplay', () => {
    component.dataSource.data = defaultArray;
    component.leafNodeArray = [];
    component.constructLeafNodeArray(defaultArray);

    component.contentToDisplay = {title: 'PetitEnfant1', body: 'PLACEHOLDER'};
    component.currentNodeIndex = 0;

    component.next();

    expect(component.contentToDisplay.title).toEqual('PetitEnfant2')
  });

  it('#previous() ne devrait pas changer la variable contentToDisplay', () => {
      component.dataSource.data = defaultArray;
      component.leafNodeArray = [];
      component.constructLeafNodeArray(defaultArray);

      component.contentToDisplay = {title: 'PetitEnfant1', body: 'PLACEHOLDER'};
      component.currentNodeIndex = 0;

      component.previous();

      expect(component.contentToDisplay.title).toEqual('PetitEnfant1')
    });

  it('#previous() devrait changer la variable contentToDisplay', () => {
    component.dataSource.data = defaultArray;
    component.leafNodeArray = [];
    component.constructLeafNodeArray(defaultArray);

    component.contentToDisplay = {title: 'PetitEnfant2', body: 'PLACEHOLDER'};
    component.currentNodeIndex = 1;

    component.previous();

    expect(component.contentToDisplay.title).toEqual('PetitEnfant1')
  });

  it('#isFirstNode() devrait retourner true', () => {
    component.leafNodeArray = new Array<Node>();
    component.constructLeafNodeArray(defaultArray);

    component.currentNodeIndex = 0;
    expect(component.isFirstNode()).toBeTruthy();
  });

  it('#isLastNode() devrait retourner true', () => {
    component.leafNodeArray = new Array<Node>();
    component.constructLeafNodeArray(defaultArray);

    component.currentNodeIndex = defaultArray.length + 1;
    expect(component.isLastNode()).toBeTruthy();
  });

  it('#displayContent ne devrait pas mettre a jour currentNodeIndex si la node en parametre n\'a pas d\'id', () => {
    component.displayNodeContent({label: 'nodeTest'});
    component.currentNodeIndex = 0;
    expect(component.currentNodeIndex).toBe(0);
  });

});
