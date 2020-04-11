import { PointSet } from '../../tool/bucket/bucket-logic/point-set';
import { Point } from '../../tool/shape/common/point';
import { MultipleSelection } from '../multiple-selection';
// import { Offset } from '../offset';
import { Arrow } from './arrow';
import { KeyManager } from './key-manager';
import { OFFSET_TRANSLATE, TIME_INTERVAL } from './selection-logic-util';
import { SelectionLogicComponent } from './selection-logic.component';

export class Deplacement {

  keyManager: KeyManager;

  constructor(private selectionLogic: SelectionLogicComponent) {
    this.initialiseKeyManager();
    this.selectionLogic.allListenners.push(
      this.selectionLogic.renderer.listen(document, 'keydown',
        this.keyManager.handlers.keydown));
    this.selectionLogic.allListenners.push(
      this.selectionLogic.renderer.listen(document, 'keyup',
        this.keyManager.handlers.keyup));
    // this.offset = {x: 0, y: 0};
  }

  private initialiseKeyManager(): void {

    const allArrows = new Set<string>([Arrow.Up, Arrow.Down, Arrow.Left, Arrow.Right]);

    this.keyManager = {

      keyPressed: new Set(),

      lastTimeCheck: new Date().getTime(),

      shift: false,

      alt: false,

      handlers: {

        keydown: ($event: KeyboardEvent) => {
          this.keyManager.shift = $event.shiftKey;
          this.keyManager.alt = $event.altKey;
          if (!allArrows.has($event.key)) {
            return;
          }
          $event.preventDefault();
          this.keyManager.keyPressed.add($event.key);
          const actualTime = new Date().getTime();
          if (actualTime - this.keyManager.lastTimeCheck >= TIME_INTERVAL) {
            this.keyManager.lastTimeCheck = actualTime;
            this.handleKey(Arrow.Up, 0, -OFFSET_TRANSLATE);
            this.handleKey(Arrow.Down, 0, OFFSET_TRANSLATE);
            this.handleKey(Arrow.Left, -OFFSET_TRANSLATE, 0);
            this.handleKey(Arrow.Right, OFFSET_TRANSLATE, 0);
          }
        },

        keyup: ($event: KeyboardEvent) => {
          this.keyManager.shift = $event.shiftKey;
          this.keyManager.alt = $event.altKey;
          this.keyManager.keyPressed.delete($event.key);
          if (this.keyManager.keyPressed.size === 0 && allArrows.has($event.key)) {
            this.selectionLogic.undoRedoService.saveState();
          }
        }
      }
    };

  }

  private handleKey(key: string, dx: number, dy: number): void {
    if (!this.keyManager.keyPressed.has(key)) {
      return;
    }

    if (!this.selectionLogic.service.magnetActive) {
      this.selectionLogic.translateAll(dx, dy);
      return;
    }
    let comparePoint = this.getComparePoint(
      this.selectionLogic.service.selectedElements
    );

    const pointInDirection = this.pointInDirection(comparePoint, dx, dy);
    let [translateX, translateY] = [
      pointInDirection.x - comparePoint.x,
      pointInDirection.y - comparePoint.y
    ];

    const intersection = this.nearestIntersection(comparePoint);
    translateX += intersection.x - comparePoint.x;
    translateY += intersection.y - comparePoint.y;

    if (translateX > this.selectionLogic.gridService.squareSize) {
      translateX -= this.selectionLogic.gridService.squareSize;
    } else if (translateX < -this.selectionLogic.gridService.squareSize) {
      translateX += this.selectionLogic.gridService.squareSize;
    }
    if (translateY > this.selectionLogic.gridService.squareSize) {
      translateY -= this.selectionLogic.gridService.squareSize;
    } else if (translateY < -this.selectionLogic.gridService.squareSize) {
      translateY += this.selectionLogic.gridService.squareSize;
    }

    comparePoint = new Point(comparePoint.x + translateX, comparePoint.y + translateY);
    if (this.isValidPoint(comparePoint)) {
      this.selectionLogic.translateAll(translateX, translateY);
    }
  }

  onCursorMove(): void {

    const nearestIntersection = this.nearestIntersection(
      this.selectionLogic.mouse.left.currentPoint
      );
    const comparePoint = this.getComparePoint(
      this.selectionLogic.service.selectedElements
    );

    const dx = nearestIntersection.x - comparePoint.x;
    const dy = nearestIntersection.y - comparePoint.y;
    this.selectionLogic.translateAll(dx, dy);

  }

  protected nearestIntersection(point: Point): Point {

    const candidates = new PointSet();
    const s = this.selectionLogic.gridService.squareSize;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const pointToAdd = new Point(
          point.x - point.x % s + i * s,
          point.y - point.y % s + j * s
        );
        candidates.add(pointToAdd);
      }
    }
    return candidates.nearestPoint(point)[0] as Point;

  }

  private isValidPoint(point: Point): boolean {

    const [x, y] = [point.x, point.y];
    return 0 <= x && x < this.selectionLogic.svgShape.width
      && 0 <= y && y < this.selectionLogic.svgShape.height;

  }

  private pointInDirection(currentPoint: Point, ux: number, uy: number): Point {

    const dx = ux === 0 ? 0 : ux / Math.abs(ux) * this.selectionLogic.gridService.squareSize;
    const dy = uy === 0 ? 0 : uy / Math.abs(uy) * this.selectionLogic.gridService.squareSize;
    const result = new Point (currentPoint.x + dx, currentPoint.y + dy);
    return result;

  }

  protected getComparePoint(elements: Set<SVGElement>): Point {

    const selection = new MultipleSelection(elements, this.selectionLogic.getSvgOffset()).getSelection().points;
    const MAX_POINTS_PER_DIMENSION = 3;
    const x = (this.selectionLogic.service.magnetPoint as number) % MAX_POINTS_PER_DIMENSION;
    const y = Math.floor((this.selectionLogic.service.magnetPoint as number) / MAX_POINTS_PER_DIMENSION);
    return new Point(
      (2 - x) / 2 * selection[0].x + x / 2 * selection[1].x,
      (2 - y) / 2 * selection[0].y + y / 2 * selection[1].y,
    );

  }

}
