import {Component, OnDestroy, Renderer2} from '@angular/core';
import {interval, Observable} from 'rxjs';
import { Point } from 'src/app/tool/selection/Point';
import {ColorService} from '../../../color/color.service';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';
import {AerosolService} from '../aerosol.service';
import {UndoRedoService} from '../../../undo-redo/undo-redo.service';

@Component({
  selector: 'app-aerosol-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class AerosolLogicComponent
  extends ToolLogicDirective implements OnDestroy {

  private listeners: (() => void)[];
  private currentPath: SVGElement;
  private currMousePos: Point;

  private onDrag: boolean;
  private stringPath: string;

  private periodicSplashAdder: any;
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
          this.currentPath.remove()
        }
      }
    })
  }

  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => this.onMouseDown(mouseEv)
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

    this.svgStructure.root.style.cursor = 'crosshair';

  }

  ngOnDestroy(): void {
    this.listeners.forEach(listenner => { listenner(); });
    this.undoRedoService.resetActions();
  }

  protected onMouseDown(mouseEv: MouseEvent): void {
    this.currMousePos = new Point(mouseEv.offsetX, mouseEv.offsetY);

    this.currentPath = this.renderer.createElement('path', this.svgNS);
    this.currentPath.setAttribute(
      'fill',
      this.colorService.primaryColor
    );
    this.renderer.appendChild(this.svgStructure.drawZone, this.currentPath);

    this.onDrag = true;

    this.frequency = interval(1000 / (this.service.frequency));
    this.periodicSplashAdder = this.frequency.subscribe(
      () => this.addSplash()
    );
  }

  protected onMouseMove(mouseEv: MouseEvent): void {
    if (this.onDrag) {
      this.currMousePos = new Point(mouseEv.offsetX, mouseEv.offsetY);
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
      this.currMousePos
    );
    this.currentPath.setAttribute('d', this.stringPath);
  }
}
