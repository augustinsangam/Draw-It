import {
  AfterViewInit, Component, OnDestroy, OnInit, Renderer2
} from '@angular/core';

import { UndoRedoService } from 'src/app/tool/undo-redo/undo-redo.service';
import { ColorService } from '../../../color/color.service';
import { PencilBrushCommon } from '../../pencil-brush/pencil-brush-common';
import { PencilService } from '../pencil.service';

@Component({
  selector: 'app-pencil-logic',
  template: ''
})
export class PencilLogicComponent extends PencilBrushCommon
  implements OnInit, AfterViewInit, OnDestroy {

  private listeners: (() => void)[];

  constructor(private renderer: Renderer2,
              private colorService: ColorService,
              private pencilService: PencilService,
              private undoRedoService: UndoRedoService
  ) {
    super();
    this.listeners = [];
    this.undoRedoService.setPreUndoAction({
      enabled: true,
      overrideDefaultBehaviour: false,
      overrideFunctionDefined: true,
      overrideFunction: () => {
        if (this.mouseOnHold) {
          this.stopDrawing();
          this.undoRedoService.saveState();
        }
      }
    });
  }

  ngOnInit(): void {
    this.svgStructure.root.style.cursor = 'crosshair';
  }

  protected configureSvgElement(element: SVGElement): void {
    element.setAttribute('d', this.stringPath);
    element.setAttribute('stroke', this.colorService.primaryColor);
    element.setAttribute('fill', this.colorService.primaryColor);
    element.setAttribute('stroke-linecap', this.strokeLineCap);
    element.setAttribute(
      'stroke-width', this.pencilService.thickness.toString()
    );
  }

  protected onMouseMove(mouseEv: MouseEvent): void {
    this.drawing(mouseEv);
    this.svgPath.setAttribute('d', this.stringPath);
  }

  protected onMouseDown(mouseEv: MouseEvent): void {
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement(this.svgTag, this.svgNS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.svgStructure.drawZone, this.svgPath);
  }

  ngAfterViewInit(): void {
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
        if (this.mouseOnHold) {
          this.stopDrawing();
          this.undoRedoService.saveState();
        }
    });

    const mouseLeaveListen = this.renderer.listen(this.svgStructure.root,
      'mouseleave', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.stopDrawing();
          this.undoRedoService.saveState();
        }
    });

    this.listeners = [mouseDownListen, mouseMoveListen,
      mouseUpListen, mouseLeaveListen];
  }

  ngOnDestroy(): void {
    this.listeners.forEach((end) => { end(); });
    this.undoRedoService.resetActions();
    if (this.mouseOnHold) {
      this.stopDrawing();
      this.undoRedoService.saveState();
    }
  }
}
