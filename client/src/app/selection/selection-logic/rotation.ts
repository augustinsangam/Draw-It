import * as Util from './selection-logic-util';
import {SelectionLogicComponent} from './selection-logic.component';
import {Transform} from './transform';

export class Rotation {

  constructor(private selectionLogic: SelectionLogicComponent) { }

  onRotate($event: WheelEvent): void {
    console.log($event.deltaY);
    const angle = this.selectionLogic.deplacement.keyManager.alt ?
      $event.deltaY / Util.MOUSE_WHEEL_DELTA_Y :
      Util.ANGLE * ($event.deltaY / Util.MOUSE_WHEEL_DELTA_Y);

    if (this.selectionLogic.deplacement.keyManager.shift) {
      this.allSelfRotate(angle);
    } else {
      this.rotateAll(angle);
    }

    if (this.selectionLogic.service.selectedElements.size !== 0) {
      this.selectionLogic.undoRedoService.saveState();
    }
  }

  protected rotateAll(angle: number): void {
    const point = Util.SelectionLogicUtil.findElementCenter(
      this.selectionLogic.rectangles.visualisation,
      this.selectionLogic.getSvgOffset()
    );
    Transform.rotateAll(
      this.selectionLogic.service.selectedElements,
      point,
      angle,
      this.selectionLogic.renderer
    );
    Transform.rotateAll(
      this.selectionLogic.circles,
      point,
      angle,
      this.selectionLogic.renderer
    );
    new Transform(
      this.selectionLogic.rectangles.visualisation,
      this.selectionLogic.renderer
    ).rotate(point, angle);
    this.selectionLogic.applyMultipleSelection(
      undefined,
      undefined,
      new Set(this.selectionLogic.service.selectedElements)
    );
  }

  protected allSelfRotate(angle: number): void {
    this.selectionLogic.service.selectedElements.forEach((element) => {
      const point = Util.SelectionLogicUtil.findElementCenter(
        element,
        this.selectionLogic.getSvgOffset()
      );
      new Transform(element,
        this.selectionLogic.renderer
      ).rotate(point, angle);
    });
    this.selectionLogic.applyMultipleSelection(
      undefined,
      undefined,
      new Set(this.selectionLogic.service.selectedElements)
    );
  }

}
