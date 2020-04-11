import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import {UndoRedoService} from '../../../../undo-redo/undo-redo.service';
import { ColorService } from '../../../color/color.service';
import { PencilBrushCommon } from '../../pencil-brush/pencil-brush-common';
import { BrushService } from '../brush.service';

@Component({
  selector: 'app-brush-logic',
  template: ''
})
export class BrushLogicComponent extends PencilBrushCommon
  implements OnInit, OnDestroy {

  private listeners: (() => void)[];
  private preUndoFunction: () => void;

  constructor(private readonly renderer: Renderer2,
              private readonly colorService: ColorService,
              private readonly brushService: BrushService,
              private readonly undoRedoService: UndoRedoService
  ) {
    super();
    this.listeners = [];
    this.preUndoFunction = () => {
      if (this.mouseOnHold) {
        this.stopDrawing();
        this.undoRedoService.saveState();
      }
    };
    this.undoRedoService.setPreUndoAction({
      enabled: true,
      overrideDefaultBehaviour: false,
      overrideFunctionDefined: true,
      overrideFunction: this.preUndoFunction
    });
  }

  ngOnInit(): void {
    this.svgStructure.root.style.cursor = 'crosshair';

    const mouseDownListen = this.renderer.listen(this.svgStructure.root,
      'mousedown', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0) {
          this.mouseOnHold = true;
          this.onMouseDown(mouseEv);
        }
    });

    const mouseMoveListen = this.renderer.listen(this.svgStructure.root,
      'mousemove', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.onMouseMove(mouseEv);
        }
    });

    const mouseUpListen = this.renderer.listen(this.svgStructure.root,
      'mouseup', () => {
        this.preUndoFunction();
      });

    const mouseLeaveListen = this.renderer.listen(this.svgStructure.root,
      'mouseleave', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.stopDrawing();
          this.undoRedoService.saveState();
        }
    });
    this.listeners = [
      mouseDownListen,
      mouseMoveListen,
      mouseUpListen,
      mouseLeaveListen
    ];
    this.svgStructure.root.style.cursor = 'url(/assets/sidebar-icons/gimp-tool-paintbrush.png), auto';
  }

  protected configureSvgElement(element: SVGElement): void {
    this.renderer.setAttribute(element, 'd', this.stringPath);
    this.renderer.setAttribute(element, 'stroke', this.colorService.primaryColor);
    this.renderer.setAttribute(element, 'filter', `url(#${this.brushService.texture})`);
    this.renderer.setAttribute(element, 'stroke-linecap', this.strokeLineCap);
    this.renderer.setAttribute(element, 'stroke-width', this.brushService.thickness.toString());
    element.classList.add(this.brushService.texture);
  }

  protected onMouseDown(mouseEv: MouseEvent): void {
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement(this.svgTag, this.svgNS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.svgStructure.drawZone, this.svgPath);
  }

  protected onMouseMove(mouseEv: MouseEvent): void {
    this.drawing(mouseEv);
    this.svgPath.setAttribute('d', this.stringPath);
  }

  ngOnDestroy(): void {
    this.listeners.forEach((end) => { end(); });
    this.undoRedoService.resetActions();
    this.preUndoFunction();
  }
}
