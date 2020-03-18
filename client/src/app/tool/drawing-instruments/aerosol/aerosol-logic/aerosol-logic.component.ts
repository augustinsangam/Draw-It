import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { Point } from 'src/app/tool/shape/common/point';
import { ColorService } from '../../../color/color.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { UndoRedoService } from '../../../undo-redo/undo-redo.service';
import { AerosolService } from '../aerosol.service';

const A_SECOND_IN_MS = 1000;

@Component({
  selector: 'app-aerosol-logic',
  template: '',
})
export class AerosolLogicComponent
  extends ToolLogicDirective implements OnInit, OnDestroy {

  private listeners: (() => void)[];
  private currentPath: SVGElement;
  private currentMousePos: Point;

  private onDrag: boolean;
  private stringPath: string;

  private periodicSplashAdder: Subscription;
  private frequency: Observable<number>;

  constructor(
    private readonly service: AerosolService,
    private readonly renderer: Renderer2,
    protected readonly colorService: ColorService,
    private readonly undoRedoService: UndoRedoService
  ) {
    super();
    this.listeners = [];
    this.onDrag = false;
    this.stringPath = '';
    this.undoRedoService.resetActions();
    this.undoRedoService.setPreUndoAction({
      enabled: true,
      overrideDefaultBehaviour: false,
      overrideFunctionDefined: true,
      overrideFunction: () => {
        if (this.onDrag) {
          this.onMouseUp();
          this.currentPath.remove();
        }
      }
    });
    this.periodicSplashAdder = Subscription.EMPTY;
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
      (mouseEv: MouseEvent) => this.onMouseMove(mouseEv)
    );

    const onMouseUp = this.renderer.listen(
      this.svgStructure.root,
      'mouseup',
      () => this.onMouseUp()
    );

    const onMouseLeave = this.renderer.listen(
      this.svgStructure.root,
      'mouseleave',
      () => this.onMouseUp()
    );

    this.listeners = [
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
    ];
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'crosshair');

  }

  ngOnDestroy(): void {
    this.onMouseUp();
    this.listeners.forEach((listenner) => { listenner(); });
    this.undoRedoService.resetActions();
  }

  protected onMouseDown(mouseEv: MouseEvent): void {
    this.currentMousePos = new Point(mouseEv.offsetX, mouseEv.offsetY);

    this.currentPath = this.renderer.createElement('path', this.svgNS);

    this.currentPath.setAttribute(
      'fill',
      this.colorService.primaryColor
    );
    this.renderer.appendChild(this.svgStructure.drawZone, this.currentPath);

    this.onDrag = true;

    this.frequency = interval(A_SECOND_IN_MS / (this.service.frequency));
    this.periodicSplashAdder = this.frequency.subscribe(
      () => this.addSplash()
    );
  }

  protected onMouseMove(mouseEv: MouseEvent): void {
    if (this.onDrag) {
      this.currentMousePos = new Point(mouseEv.offsetX, mouseEv.offsetY);
    }
  }

  protected onMouseUp(): void {
    if (this.onDrag) {
      this.periodicSplashAdder.unsubscribe();
      this.onDrag = false;
      this.stringPath = '';
      this.undoRedoService.saveState();
    }
  }

  private addSplash(): void {
    this.stringPath += this.service.generatePoints(
      this.currentMousePos
    );
    this.currentPath.setAttribute('d', this.stringPath);
  }
}
