import { MultipleSelection } from '../multiple-selection';
import { Zone } from '../zone';
import { SelectionLogicUtil } from './selection-logic-util';
import { SelectionLogicComponent } from './selection-logic.component';
import { Transform } from './transform';

export class Clipboard {

  private static readonly TAG_LENGTH: number = 32;
  private static readonly TAG_PREFIX: string = 'clipboard';

  constructor(private selectionLogic: SelectionLogicComponent) { }

  copy(): void {
    const selectedElements = new Set(
      this.selectionLogic.service.selectedElements
    );
    if (this.selectionLogic.service.selectedElements.size !== 0) {
      this.selectionLogic.service.clipboard = [ selectedElements ];
    }
  }

  cut(): void {
    if (this.selectionLogic.service.selectedElements.size === 0) {
      return;
    }

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

  paste(): void {
    if (this.selectionLogic.service.clipboard.length === 0) {
      return;
    }

    while (this.selectionLogic.service.clipboard.length > 1
            && !this.clipboardValid(this.selectionLogic.service.clipboard.peak())) {
      this.selectionLogic.service.clipboard.pop();
    }

    this.selectionLogic.service.clipboard.push(
      SelectionLogicUtil.clone(
        this.selectionLogic.service.clipboard.peak()
      )
    );

    Transform.translateAll(
      this.selectionLogic.service.clipboard.peak(),
      SelectionLogicUtil.PASTE_TRANSLATION,
      SelectionLogicUtil.PASTE_TRANSLATION,
      this.selectionLogic.renderer
      );
    const lastValidClipboard = this.selectionLogic.service.clipboard.peak();

    const tag = this.createRandomTag();
    lastValidClipboard.forEach((element) => {
      this.addTag(element, tag);
      this.selectionLogic.renderer.appendChild(
        this.selectionLogic.svgStructure.drawZone,
        element
      );
    });

    if (!this.isInside(lastValidClipboard)) {
      const length = this.selectionLogic.service.clipboard.length - 1;
      Transform.translateAll(
        lastValidClipboard,
        - SelectionLogicUtil.PASTE_TRANSLATION * length,
        - SelectionLogicUtil.PASTE_TRANSLATION * length,
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

  delete(): void {
    if (this.selectionLogic.service.selectedElements.size === 0) {
      return;
    }

    this.selectionLogic.service.selectedElements.forEach((element) => {
      element.remove();
    });
    this.selectionLogic.deleteVisualisation();
    this.selectionLogic.undoRedoService.saveState();
  }

  duplicate(): void {
    const toDuplicate = SelectionLogicUtil.clone(
      this.selectionLogic.service.selectedElements
    );

    Transform.translateAll(
      toDuplicate,
      SelectionLogicUtil.PASTE_TRANSLATION,
      SelectionLogicUtil.PASTE_TRANSLATION,
      this.selectionLogic.renderer
    );

    toDuplicate.forEach((element) => {
      this.selectionLogic.renderer.appendChild(
        this.selectionLogic.svgStructure.drawZone,
         element
         );
    });

    if (!this.isInside(toDuplicate)) {
      Transform.translateAll(toDuplicate,
        - SelectionLogicUtil.PASTE_TRANSLATION,
         -SelectionLogicUtil.PASTE_TRANSLATION,
         this.selectionLogic.renderer);
    }

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

    const tags = this.getCurrentTags(clipboard);
    return this.tagsExistInSVG(tags);
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

  private createRandomTag(): string {
    let result         = '';
    const characters   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            + 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < Clipboard.TAG_LENGTH; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return Clipboard.TAG_PREFIX + result;
  }

  private getCurrentTags(clipboard: Set<SVGElement>): Set<string> {
    const tags = new Set<string>();
    for (const element of clipboard) {
      if (tags.size === 0) {
        element.classList.forEach((classListItem: string) => {
          tags.add(classListItem);
        });
        continue;
      }

      element.classList.forEach((classListItem: string) => {
        if (!tags.has(classListItem)) {
          tags.delete(classListItem);
        }
      });
    }

    return tags;
  }

  private addTag(element: SVGElement, tag: string): void {
    this.deleteTag(element);
    element.classList.add(tag);
  }

  private deleteTag(element: SVGElement): void {
    element.classList.forEach((classListItem: string) => {
      if (!classListItem.startsWith(Clipboard.TAG_PREFIX)) {
        return;
      }

      this.selectionLogic.renderer.removeClass(
        element,
        classListItem
      );

      if (element.classList.length === 0) {
        this.selectionLogic.renderer.removeAttribute(
          element,
          'class'
        );
      }
    });
  }

  private tagsExistInSVG(tags: Set<string>): boolean {
    for (const tag of tags) {
      let tagExist = false;
      const allDraws = Array.from(
        this.selectionLogic.svgStructure.drawZone.children
      );

      for (const element of allDraws) {
        if (element.classList.contains(tag)) {
          tagExist = true;
          break;
        }
      }

      if (!tagExist) {
        return false;
      }
    }

    return true;
  }
}
