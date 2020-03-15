import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ColorService } from '../../../color/color.service';
import {UndoRedoService} from '../../../undo-redo/undo-redo.service';
import { PencilBrushCommon } from '../../pencil-brush/pencil-brush-common';
import { BrushService } from '../brush.service';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-brush-logic',
  template: ''
})
export class BrushLogicComponent extends PencilBrushCommon
  implements OnInit, OnDestroy {

  private listeners: (() => void)[];

  constructor(private readonly renderer: Renderer2,
              private readonly colorService: ColorService,
              private readonly brushService: BrushService,
              private readonly filterService: FilterService,
              private readonly undoRedoService: UndoRedoService
  ) {
    super();
    this.listeners = [];
    this.undoRedoService.resetActions();
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
    if (this.brushService.isFirstLoaded) {
      const svgDefsEl: SVGDefsElement = this.filterService.generateBrushFilters(this.renderer);
      this.renderer.appendChild(this.svgStructure.defsZone, svgDefsEl);
      this.brushService.isFirstLoaded = false;
    }
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
        this.stopDrawing();
        this.undoRedoService.saveState();
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
    // TODO renderer partout
    this.svgStructure.root.style.cursor = 'crosshair';

  }

  protected configureSvgElement(element: SVGElement): void {
    element.setAttribute('d', this.stringPath);
    element.setAttribute('stroke', this.colorService.primaryColor);
    element.setAttribute('fill', this.colorService.primaryColor);
    element.setAttribute('filter', `url(#${this.brushService.texture})`);
    element.setAttribute('stroke-linecap', this.strokeLineCap);
    element.setAttribute(
      'stroke-width', this.brushService.thickness.toString()
    );
    element.classList.add(this.brushService.texture);
  }

  protected onMouseDown(mouseEv: MouseEvent): void {
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement(this.svgTag, this.svgNS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.svgStructure.drawZone, this.svgPath);
  }
  // TODO : DRY avec overridefuction
  ngOnDestroy(): void {
    this.listeners.forEach((end) => { end(); });
    this.undoRedoService.resetActions();
    if (this.mouseOnHold) {
      this.stopDrawing();
      this.undoRedoService.saveState();
    }
  }

  protected onMouseMove(mouseEv: MouseEvent): void {
    this.drawing(mouseEv);
    this.svgPath.setAttribute('d', this.stringPath);
  }
}
