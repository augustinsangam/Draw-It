import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {UndoRedoService} from '../../../../undo-redo/undo-redo.service';
import {ColorService} from '../../../color/color.service';
import {Point} from '../../../shape/common/point';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';
import {FeatherpenService} from '../featherpen.service';

@Component({
  selector: 'app-featherpen-logic',
  template: '',
})

export class FeatherpenLogicComponent extends ToolLogicDirective
 implements OnDestroy, OnInit {

  private listeners: (() => void)[];
  private onDrag: boolean;
  private element: SVGElement;
  private currentPath: string;
  private previousPoint: Point;
  private cursorLine: SVGElement;

  constructor(
      private readonly renderer: Renderer2,
      private readonly service: FeatherpenService,
      private readonly colorService: ColorService,
      private readonly undoRedoService: UndoRedoService,
    ) {
    super();
    this.onDrag = false;
    this.currentPath = '';
    this.undoRedoService.resetActions();
    this.undoRedoService.setPreUndoAction({
      enabled: true,
      overrideDefaultBehaviour: false,
      overrideFunctionDefined: true,
      overrideFunction: () => {
        if (this.onDrag) {
          this.onMouseUp();
          this.element.remove();
        }
      }
    });
  }

  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0) {
          this.onMouseDown(mouseEv);
        }
      }
    );

    const onMouseMove = this.renderer.listen(
      this.svgStructure.root,
      'mousemove',
      (mouseEv: MouseEvent) => this.onMouseMove(
        new Point(mouseEv.offsetX, mouseEv.offsetY)),
    );

    const onScroll = this.renderer.listen(
      this.svgStructure.root,
      'wheel',
      (wheelEv: WheelEvent) => this.onScroll(wheelEv),
    );

    const onMouseLeave = this.renderer.listen(
      this.svgStructure.root,
      'mouseleave',
      () => {
        this.renderer.setAttribute(this.cursorLine, 'd', 'M 0 0 L 0 0');
        this.onMouseUp();
      }
    );

    const onMouseUp = this.renderer.listen(
      document,
      'mouseup',
      (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0) {
          this.onMouseUp();
        }
      }
    );

    this.listeners = [
      onMouseDown,
      onMouseMove,
      onScroll,
      onMouseLeave,
      onMouseUp,
    ];

    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'none');
    this.cursorLine = this.renderer.createElement('path', this.svgNS);
    this.renderer.appendChild(this.svgStructure.temporaryZone, this.cursorLine);
    this.setElementStyle(this.cursorLine);
  }

  ngOnDestroy(): void {
    this.listeners.forEach((listener) => listener());
    this.undoRedoService.resetActions();
    this.cursorLine.remove();
  }

  private onMouseDown(mouseEv: MouseEvent): void {
    if (!this.onDrag) {
      this.onDrag = true;
      this.element = this.renderer.createElement('path', this.svgNS);
      this.renderer.appendChild(this.svgStructure.drawZone, this.element);
      this.setElementStyle(this.element);
      this.element.setAttribute('d', this.service.pathCentered(new Point(mouseEv.offsetX, mouseEv.offsetY)));
      this.previousPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
    }
  }

  private setElementStyle(element: SVGElement): void {
    this.renderer.setAttribute(element, 'stroke', this.colorService.primaryColor);
    this.renderer.setAttribute(element, 'stroke-width', '2');
  }

  private complete(initial: Point, final: Point): string {
    let toAdd = '';
    const points = this.service.getInterpolatedPoints(initial, final);
    for (const point of points) {
      toAdd += ` ${this.service.pathCentered(point)}`;
    }
    return toAdd;
  }

  private onMouseMove(point: Point): void {
    if (!this.onDrag) {
      this.renderer.setAttribute(this.cursorLine, 'd', this.service.pathCentered(point));
      this.setElementStyle(this.cursorLine);
      return;
    }

    this.currentPath += this.service.pathCentered(point);
    if (point.squareDistanceTo(this.previousPoint) > 1) {
      this.currentPath += ` ${this.complete(this.previousPoint, point)}`;
    }
    this.element.setAttribute('d', this.currentPath);
    this.previousPoint = point;
  }

  private onMouseUp(): void {
    if (this.onDrag) {
      this.onDrag = false;
      this.undoRedoService.saveState();
      this.currentPath = '';
    }
  }

  private onScroll(wheelEv: WheelEvent): void {
    this.renderer.setAttribute(this.cursorLine, 'd', this.service.pathCentered(new Point(wheelEv.offsetX, wheelEv.offsetY)));
    wheelEv.preventDefault();
    const oldAngle = this.service.updateAngle(wheelEv);
    this.service.emitter.next();
    if (!this.onDrag) {
      return;
    }

    const pathToAdd = this.service.interpolate(
      oldAngle,
      this.service.angle,
      new Point(wheelEv.offsetX, wheelEv.offsetY),
      wheelEv.deltaY < 0,
    );
    this.currentPath += ` ${pathToAdd}`;
    this.renderer.setAttribute(this.element, 'd', this.currentPath);
  }
}
