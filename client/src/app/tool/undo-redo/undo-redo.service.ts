import { Injectable } from '@angular/core';
import { SVGStructure } from '../tool-logic/tool-logic.directive';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  private svgStructure: SVGStructure;
  private cmdDone: (SVGElement[])[]
  private cmdUndone: (SVGElement[])[];
  private firstCommand: boolean;

  private actions: [PreUndoAction, PostUndoAction];

  constructor() {
    this.cmdDone = [];
    this.cmdUndone = [];
    this.firstCommand = true;
    this.resetActions();
  }

  intialise(svgStructure: SVGStructure): void {
    this.svgStructure = svgStructure;
    this.saveState();
  }

  resetActions() {
    this.actions = [
      {
        enabled: false,
        overrideDefaultBehaviour: false,
        overrideFunctionDefined: false
      },
      {
        enabled: false,
        functionDefined: false,
      }
    ]
  }

  setPreUndoAction(action: PreUndoAction) {
    this.actions[0] = action;
  }

  setPostUndoAction(action: PostUndoAction) {
    this.actions[1] = action;
  }

  saveState(): void {
    // TODO : J'ai changé plein de tucs. Tu copiais des référecences Nico
    this.firstCommand = false;
    const drawZone = this.svgStructure.drawZone;
    const length = drawZone.children.length;
    const toPush = new Array(length);
    for (let i = 0; i < length; i++) {
      toPush[i] = (drawZone.children.item(i) as SVGElement).cloneNode(true);
    }
    this.cmdDone.push(toPush);
    console.log('On sauvegarde');
    console.log(this);
  }

  undo(): void {

    if (this.actions[0].enabled && this.actions[0].overrideFunctionDefined) {
      (this.actions[0].overrideFunction as () => void)();
    }

    if (!this.actions[0].overrideDefaultBehaviour) {
      this.undoBase();
    }

    if (this.actions[1].enabled && this.actions[1].functionDefined) {
      (this.actions[1].function as () => void)();
    }

  }

  undoBase() {
    if (this.cmdDone.length !== 0) {
      const lastCommand = this.cmdDone.pop();
      this.cmdUndone.push(lastCommand as SVGElement[]);
      this.refresh(this.cmdDone[this.cmdDone.length - 1]);
    }
  }

  redo(): void {
    if (this.cmdUndone.length) {
      const lastCommand = this.cmdUndone.pop();
      this.cmdDone.push(lastCommand as SVGElement[]);
      this.refresh(this.cmdDone[this.cmdDone.length - 1]);
    }
  }

  refresh(node: ChildNode[]): void {
    // TODO : Nicolas. Look if it make sense. J'ai changé des trucs
    for (const element of Array.from(this.svgStructure.drawZone.childNodes)) {
      element.remove();
    }
    const nodeChildrens = node ? Array.from(node) : [];
    for (const element of nodeChildrens) {
      this.svgStructure.drawZone.appendChild(element);
    }

  }

  canUndo(): boolean {
    return !this.firstCommand &&
      this.svgStructure.drawZone.children.length >= 1;
  }

  canRedo(): boolean {
    return this.cmdUndone.length > 0;
  }

}

interface PreUndoAction {
  enabled: boolean,
  overrideDefaultBehaviour: boolean,
  overrideFunctionDefined: boolean
  overrideFunction?: () => void
}

interface PostUndoAction {
  enabled: boolean,
  functionDefined: boolean,
  function?: () => void
}
