import {
  AfterViewInit, Component, OnDestroy, OnInit, Renderer2
} from '@angular/core';

import { UndoRedoService } from 'src/app/undo-redo/undo-redo.service';
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
  private preUndoFunction: () => void;

  constructor(private renderer: Renderer2,
              private colorService: ColorService,
              private pencilService: PencilService,
              private undoRedoService: UndoRedoService
  ) {
    super();
    this.listeners = [];
    this.preUndoFunction = () => {
      if (!this.mouseOnHold) {
        return ;
      }
      this.stopDrawing();
      this.undoRedoService.saveState();
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
  }

  protected configureSvgElement(element: SVGElement): void {
    this.renderer.setAttribute(element, 'd', this.stringPath);
    this.renderer.setAttribute(element, 'stroke', this.colorService.primaryColor);
    this.renderer.setAttribute(element, 'fill', this.colorService.primaryColor);
    this.renderer.setAttribute(element, 'stroke-linecap', this.strokeLineCap);
    this.renderer.setAttribute(element, 'stroke-width', this.pencilService.thickness.toString()
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
        if (mouseEv.button !== 0) {
          return ;
        }
        this.mouseOnHold = true;
        this.onMouseDown(mouseEv);
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
        if (mouseEv.button !== 0 || !this.mouseOnHold) {
          return ;
        }
        this.stopDrawing();
        this.undoRedoService.saveState();
    });

    this.listeners = [
      mouseDownListen,
      mouseMoveListen,
      mouseUpListen,
      mouseLeaveListen
    ];
  }

  ngOnDestroy(): void {
    this.listeners.forEach((end) => { end(); });
    this.undoRedoService.resetActions();
    this.preUndoFunction();
  }
}
