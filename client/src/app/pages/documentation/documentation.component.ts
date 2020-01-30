import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import marked from 'marked';

import docs from '../../../assets/docs.json';

export interface Node {
  label: string;
  children?: Node[];
  id?: number;
}

export interface Page {
  title: string;
  body: string;
}

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
})
export class DocumentationComponent {
  treeControl: NestedTreeControl<Node>;
  dataSource: MatTreeNestedDataSource<Node>;
  leafNodeArray: Node[];
  currentNodeIndex: number;
  contentToDisplay: Page;

  constructor() {
    this.treeControl = new NestedTreeControl<Node>(node => node.children);
    this.dataSource = new MatTreeNestedDataSource<Node>();
    this.leafNodeArray = new Array<Node>();
    this.dataSource.data = docs;
    this.constructLeafNodeArray(docs);
    this.contentToDisplay = {
      title: 'Bienvenue',
      body: marked('**Bonjour et bienvenue** dans le guide d’utilisation de DrawIt !</br></br> ' +
                   'Ce guide est destiné à vous aider à découvrir et utiliser les différents outils proposés par l’application. ' +
                   'Pour naviguer dans ce guide, utilisez la barre de naviguation sur la gauche de la page.<br/>'),
    }
  }

  constructLeafNodeArray(nodes: Node[]) {
    for (const node of nodes) {
      if (!!node.children) {
        this.constructLeafNodeArray(node.children);
      } else if (!this.leafNodeArrayContains(node)) {
        node.id = this.leafNodeArray.length;
        this.leafNodeArray.push(node);
      }
    }
  }

  leafNodeArrayContains(node: Node): boolean {
    for (const nodes of this.leafNodeArray) {
      if (node.label === nodes.label) {
        return true;
      }
    }
    return false;
  }

  isFirstNode(): boolean {
    return this.currentNodeIndex === 0;
  }

  isLastNode(): boolean {
    return this.currentNodeIndex + 1 === this.leafNodeArray.length;
  }

  previous() {
    if (!this.isFirstNode()) {
      this.displayNodeContent(this.leafNodeArray[this.currentNodeIndex - 1]);
    }
  }

  next() {
    if (!this.isLastNode()) {
      this.displayNodeContent(this.leafNodeArray[this.currentNodeIndex + 1]);
    }
  }

  expandParent(nodes: Node[], id: number): boolean {
    for (const node of nodes) {
      if (!!node.children) {
        if (this.expandParent(node.children, id)) {
          this.treeControl.expand(node);
          return true;
        }
      } else if (node.id === id) {
        return true;
      }
    }
    return false;
  }

  displayNodeContent(node: Node) {
    this.contentToDisplay.title = node.label;
    if (node.id != null) {
      this.currentNodeIndex = node.id;
      this.treeControl.collapseAll();
      this.expandParent(docs, node.id);
    }
    fetch(encodeURI('../../assets/doc/doc.md/' + node.label + '.md')).then(res => res.text())
      .then(text => {
        this.contentToDisplay.body = marked(text);
      })
  }

  hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;
}
