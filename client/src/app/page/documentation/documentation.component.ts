import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import * as marked from 'marked';

import { docs } from '../../../assets/docs.json';

interface Node {
  children?: Node[];
  id?: number;
  label: string;
}

interface Page {
  body: string;
  title: string;
}

@Component({
  selector: 'app-documentation',
  styleUrls: [
    './documentation.component.css',
  ],
  templateUrl: './documentation.component.html',
})
export class DocumentationComponent {
  treeControl: NestedTreeControl<Node>;
  dataSource: MatTreeNestedDataSource<Node>;
  leafNodeArray: Node[];
  currentNodeIndex: number;
  contentToDisplay: Page;

  constructor() {
    this.treeControl = new NestedTreeControl<Node>((node) => node.children);
    this.dataSource = new MatTreeNestedDataSource<Node>();
    this.leafNodeArray = new Array<Node>();
    this.dataSource.data = docs;
    this.constructLeafNodeArray(docs);
    this.contentToDisplay = {
      title: 'Bienvenue',
      body: marked(
        '**Bonjour et bienvenue** '
        + 'dans le guide d’utilisation de DrawIt !</br></br>'
        + 'Ce guide est destiné à vous aider à découvrir et utiliser '
        + 'les différents outils proposés par l’application. '
        + 'Pour naviguer dans ce guide, utilisez la barre de naviguation '
        + 'sur la gauche de la page.<br/>'
      )
    };
  }

  private constructLeafNodeArray(nodes: Node[]): void {
    for (const node of nodes) {
      if (!!node.children) {
        this.constructLeafNodeArray(node.children);
      } else if (!this.leafNodeArrayContains(node)) {
        node.id = this.leafNodeArray.length;
        this.leafNodeArray.push(node);
      }
    }
  }

  private leafNodeArrayContains(node: Node): boolean {
    for (const nodes of this.leafNodeArray) {
      if (node.label === nodes.label) {
        return true;
      }
    }
    return false;
  }

  // Must be public
  isFirstNode(): boolean {
    return this.currentNodeIndex === 0;
  }

  // Must be public
  isLastNode(): boolean {
    return this.currentNodeIndex + 1 === this.leafNodeArray.length;
  }

  // not private because only called in the html => "
  // next() is declared but its value is never read" warning
  // Must be public
  previous(): void {
    if (!this.isFirstNode()) {
      this.displayNodeContent(this.leafNodeArray[this.currentNodeIndex - 1]);
    }
  }

  // not private because only called in the html =>
  // "next() is declared but its value is never read" warning
  // Must be public
  next(): void {
    if (!this.isLastNode()) {
      this.displayNodeContent(this.leafNodeArray[this.currentNodeIndex + 1]);
    }
  }

  // Must be public
  displayNodeContent(node: Node): void {
    this.contentToDisplay.title = node.label;
    if (node.id != null) {
      this.currentNodeIndex = node.id;
      this.treeControl.collapseAll();
      this.expandParent(docs, node.id);
    }
    fetch(encodeURI('/assets/doc/md/' + node.label + '.md'))
      .then((res) => res.text())
      .then((text) => this.contentToDisplay.body = marked(text));
  }

  private expandParent(nodes: Node[], id: number): boolean {
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

  hasChild = (_: number, node: Node) =>
    !!node.children && node.children.length > 0
}
