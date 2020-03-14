import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { Point } from '../../../shape/common/point';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { UndoRedoService } from '../../../undo-redo/undo-redo.service';
import { Path } from '../../common/path';
import { LineService } from '../line.service';

interface JonctionOption {
  radius: number;
  color: string;
}

@Component({
  selector: 'app-line-logic',
  template: ''
})
export class LineLogicComponent extends ToolLogicDirective
  implements OnInit, OnDestroy {
  private paths: Path[];
  private listeners: (() => void)[];
  private isNewPath: boolean;
  private mousePosition: Point;
  private currentJonctionOptions: JonctionOption;

  constructor(
    private readonly service: LineService,
    private readonly renderer: Renderer2,
    private readonly serviceColor: ColorService,
    private readonly mathService: MathService,
    private readonly undoRedoService: UndoRedoService
  ) {
    super();
    this.paths = [];
    this.listeners = [];
    this.isNewPath = true;
    this.undoRedoService.resetActions();
    this.undoRedoService.setPreUndoAction({
      enabled: true,
      overrideDefaultBehaviour: true,
      overrideFunctionDefined: true,
      overrideFunction: () => {
        if (!this.isNewPath) {
          this.addNewLine( this.mousePosition);
          this.undoRedoService.saveState();
          this.onKeyDown({ code: 'Escape'} as unknown as KeyboardEvent);
        }
        this.undoRedoService.undoBase();
      }
    });
  }

  ngOnInit(): void {
    this.listeners.push(
      this.renderer.listen(
        this.svgStructure.root,
        'click',
        (mouseEv: MouseEvent) => this.onMouseClick(mouseEv)
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.svgStructure.root,
        'dblclick',
        (mouseEv: MouseEvent) => this.onMouseDblClick(mouseEv)
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.svgStructure.root,
        'mousemove',
        (mouseEv: MouseEvent) => this.onMouseMove(mouseEv)
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.svgStructure.root,
        'keydown',
        (keyEv: KeyboardEvent) => this.onKeyDown(keyEv)
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.svgStructure.root,
        'keyup',
        (keyEv: KeyboardEvent) => this.onKeyUp(keyEv)
      )
    );

    this.svgStructure.root.style.cursor = 'crosshair';

  }

  ngOnDestroy(): void {
    this.listeners.forEach((end) => end());
    this.undoRedoService.resetActions();
    if (!this.isNewPath) {
      this.undoRedoService.saveState();
    }
  }

  private onMouseClick(mouseEv: MouseEvent): void {
    let currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
    if (this.isNewPath) {
      this.createNewPath(currentPoint);
      this.currentJonctionOptions = {
        color: this.serviceColor.primaryColor,
        radius: this.service.radius
      };
      this.isNewPath = false;
    }
    if (mouseEv.shiftKey && !this.isNewPath) {
      currentPoint = this.getPath().getAlignedPoint(currentPoint);
    }
    this.addNewLine(currentPoint);
  }

  private onMouseDblClick(mouseEv: MouseEvent): void {
    if (this.isNewPath) {
      return;
    }
    let currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
    this.removeLine();
    this.removeLine(); // remove the click event
    const firstPoint = this.getPath().datas.points[0];
    const isLessThan3pixels = this.mathService.distanceIsLessThan3Pixel(currentPoint, firstPoint);
    if (isLessThan3pixels) {
      this.addNewLine(firstPoint);
    } else {
      if (mouseEv.shiftKey) {
        currentPoint = this.getPath().getAlignedPoint(currentPoint);
      }
      this.addNewLine(currentPoint);
    }
    this.isNewPath = true;
    this.undoRedoService.saveState();
  }

  private onMouseMove(mouseEv: MouseEvent): void {
    if (this.isNewPath) {
      return;
    }
    let point = (this.mousePosition = new Point(
      mouseEv.offsetX,
      mouseEv.offsetY
    ));
    if (mouseEv.shiftKey) {
      point = this.getPath().getAlignedPoint(point);
    }
    this.getPath().simulateNewLine(point);
  }

  // TODO : enumeration shortcut
  private onKeyDown(keyEv: KeyboardEvent): void {
    const shiftIsPressed =
      keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight';
    if (this.isNewPath) {
      return;
    }
    if (keyEv.code === 'Escape') {
      this.getPath().removePath();
      this.isNewPath = true;
    }
    const maxRemovableInstruction = this.service.withJonction ? 2 * 2 : 2; // TODO : Magie
    const shouldConnect = this.getPath().datas.instructions.length >= maxRemovableInstruction;
    if (keyEv.code === 'Backspace' && shouldConnect) {
      this.removeLine();
      this.getPath().simulateNewLine(this.getPath().lastPoint);
    }
    if (shiftIsPressed) {
      const transformedPoint = this.getPath().getAlignedPoint(this.mousePosition);
      this.getPath().simulateNewLine(transformedPoint);
    }
  }

  private onKeyUp(keyEv: KeyboardEvent): void {
    const shiftIsPressed = keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight';
    if (shiftIsPressed && !this.isNewPath) {
      this.getPath().simulateNewLine(this.mousePosition);
    }
  }

  private createNewPath(initialPoint: Point): void {
    const path = this.renderer.createElement('path', this.svgNS);
    this.renderer.appendChild(this.svgStructure.drawZone, path);
    this.paths.push(
      new Path(initialPoint, this.renderer, path, this.service.withJonction)
    );
    this.getPath().setLineCss(
      this.service.thickness.toString(),
      this.serviceColor.primaryColor
    );
  }

  private createJonction(center: Point): void {
    this.getPath().addJonction(center,
      this.currentJonctionOptions.radius);
  }

  private addNewLine(currentPoint: Point): void {
    this.getPath().addLine(currentPoint);
    if (this.getPath().withJonctions) {
      this.createJonction(currentPoint);
    }
  }

  private removeLine(): void {
    this.getPath().removeLastInstruction();
  }

  private getPath(): Path {
    return this.paths[this.paths.length - 1];
  }
}
