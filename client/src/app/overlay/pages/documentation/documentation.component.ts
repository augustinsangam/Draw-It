import { NestedTreeControl } from '@angular/cdk/tree';
import {Component} from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import marked from 'marked';

import docs from '../../../../assets/docs.json';
import {DocEnum} from './doc-enum';

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
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent {
  private treeControl: NestedTreeControl<Node>;
  private dataSource: MatTreeNestedDataSource<Node>;
  private leafNodeArray: Node[];
  private currentNodeIndex: number;
  protected contentToDisplay: Page;
  private doc: Node[] = docs;

  constructor() {
    this.treeControl = new NestedTreeControl<Node>((node) => node.children);
    this.dataSource = new MatTreeNestedDataSource<Node>();
    this.leafNodeArray = new Array<Node>();
    this.dataSource.data = this.doc;
    this.constructLeafNodeArray(this.doc);
    this.contentToDisplay = {title: '', body: ''};
    this.displayNodeContent(this.leafNodeArray[DocEnum.WELCOME]);
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

  private leafNodeArrayContains(localNode: Node): boolean {
    for (const nodes of this.leafNodeArray) {
      if (localNode.label === nodes.label) {
        return true;
      }
    }
    return false;
  }

  private isFirstNode(): boolean {
    return this.currentNodeIndex === 0;
  }

  private isLastNode(): boolean {
    return this.currentNodeIndex + 1 === this.leafNodeArray.length;
  }

  protected previous(): void {
    if (!this.isFirstNode()) {
      this.displayNodeContent(this.leafNodeArray[this.currentNodeIndex - 1]);
    }
  }

  protected next(): void {
    if (!this.isLastNode()) {
      this.displayNodeContent(this.leafNodeArray[this.currentNodeIndex + 1]);
    }
  }

  private findParentNode(nodes: Node[], id: number): Node | null {
    for (const node of nodes) {
      if (!!node.children) {
        if (!!this.findParentNode(node.children, id)) {
          this.treeControl.expand(node);
          return node;
        }
      } else if (node.id === id) {
        return node;
      }
    }
    return null;
  }

  private displayNodeContent(node: Node): void {
    this.contentToDisplay.title = node.label;
    if (node.id != null) {
      this.currentNodeIndex = node.id;
      this.treeControl.collapseAll();
      const parentNode = this.findParentNode(this.doc, node.id);
      this.treeControl.dataNodes = parentNode !== null ? new Array<Node>(parentNode) : new Array<Node>();
      this.treeControl.expandAll();
    }
    fetch(encodeURI(`/assets/doc/md/${node.label}.md`))
      .then((res) => res.text())
      .then((text) => {
        this.contentToDisplay.body = marked(text);
      });
  }

  goToSection(section: DocEnum): void {
    this.displayNodeContent(this.leafNodeArray[section]);
  }

  hasChild = (_: number, node: Node) =>
    !!node.children && node.children.length > 0
}
