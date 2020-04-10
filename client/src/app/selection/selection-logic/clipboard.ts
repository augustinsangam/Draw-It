import { MultipleSelection } from '../multiple-selection';
import { Zone } from '../zone';
import * as Util from './selection-logic-util';
import { SelectionLogicComponent } from './selection-logic.component';
import { Transform } from './transform';

export class Clipboard {

  constructor(private selectionLogic: SelectionLogicComponent) {}

  copy(): void {

    if (this.selectionLogic.service.selectedElements.size !== 0) {
      this.selectionLogic.service.clipboard = [
        new Set(this.selectionLogic.service.selectedElements)
      ];
    }

  }

  cut(): void {

    if (this.selectionLogic.service.selectedElements.size !== 0) {
      this.selectionLogic.service.clipboard = [
        new Set(this.selectionLogic.service.selectedElements)
      ];
      this.selectionLogic.service.clipboard.peak().forEach((element) => {
        this.selectionLogic.renderer.removeChild(
          this.selectionLogic.svgStructure.drawZone,
          element
        );
      });
      this.selectionLogic.deleteVisualisation();
      this.selectionLogic.undoRedoService.saveState();
    }

  }

  paste(): void {

    if (this.selectionLogic.service.clipboard.length !== 0) {

      while (this.selectionLogic.service.clipboard.length > 1
              && !this.clipboardValid(this.selectionLogic.service.clipboard.peak())) {
        this.selectionLogic.service.clipboard.pop();
      }

      this.selectionLogic.service.clipboard.push(
        Util.SelectionLogicUtil.clone(this.selectionLogic.service.clipboard.peak())
      );

      Transform.translateAll(
        this.selectionLogic.service.clipboard.peak(),
        Util.PASTE_TRANSLATION, Util.PASTE_TRANSLATION, this.selectionLogic.renderer);
      const lastValidClipboard = this.selectionLogic.service.clipboard.peak();

      lastValidClipboard.forEach((element) => {
        this.selectionLogic.renderer.appendChild(
          this.selectionLogic.svgStructure.drawZone,
          element
        );
      });

      if (!this.isInside(lastValidClipboard)) {
        const length = this.selectionLogic.service.clipboard.length - 1;
        Transform.translateAll(
          lastValidClipboard,
          - Util.PASTE_TRANSLATION * length,
          -Util.PASTE_TRANSLATION * length,
          this.selectionLogic.renderer
        );
        this.selectionLogic.service.clipboard = [lastValidClipboard];
      }

      this.selectionLogic.applyMultipleSelection(
        undefined,
        undefined,
        new Set(lastValidClipboard)
      );

      this.selectionLogic.undoRedoService.saveState();
    }

  }

  delete(): void {

    if (this.selectionLogic.service.selectedElements.size !== 0) {
      this.selectionLogic.service.selectedElements.forEach((element) => {
        element.remove();
      });
      this.selectionLogic.deleteVisualisation();
      this.selectionLogic.undoRedoService.saveState();
    }

  }

  duplicate(): void {

    const toDuplicate = Util.SelectionLogicUtil.clone(
      this.selectionLogic.service.selectedElements
    );

    Transform.translateAll(
      toDuplicate,
      Util.PASTE_TRANSLATION,
      Util.PASTE_TRANSLATION,
      this.selectionLogic.renderer
    );

    toDuplicate.forEach((element) => {
      this.selectionLogic.renderer.appendChild(
        this.selectionLogic.svgStructure.drawZone,
        element
      );
    });

    this.selectionLogic.applyMultipleSelection(
      undefined,
      undefined,
      new Set(toDuplicate)
    );

  }

  clipboardValid(clipboard: Set<SVGElement>): boolean {

    if (clipboard.size === 0) {
      return false;
    }
    for (const element of clipboard) {
      if (!this.selectionLogic.svgStructure.drawZone.contains(element)) {
        return false;
      }
    }
    return true;

  }

  isInside(elements: Set<SVGElement>): boolean {

    const svgZone = new Zone(
      0,
      this.selectionLogic.svgShape.width,
      0,
      this.selectionLogic.svgShape.height
    );

    const selection = new MultipleSelection(
      elements,
      this.selectionLogic.getSvgOffset(),
      undefined,
      undefined
    ).getSelection();

    const selectionZone = new Zone(
      selection.points[0].x,
      selection.points[1].x,
      selection.points[0].y,
      selection.points[1].y
    );
    return svgZone.intersection(selectionZone)[0];

  }

}
