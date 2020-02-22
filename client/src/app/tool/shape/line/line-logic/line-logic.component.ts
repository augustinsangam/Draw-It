import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { UndoRedoService } from 'src/app/tool/undo-redo/undo-redo.service';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { Path } from '../../common/Path';
import { Point } from '../../common/Point';
import { LineService } from '../line.service';

@Component({
  selector: 'app-line-logic',
  template: ''
})
export class LineLogicComponent extends ToolLogicDirective
  implements OnDestroy {
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
    private readonly undoRedo: UndoRedoService
  ) {
    super();
    this.paths = [];
    this.listeners = [];
    this.isNewPath = true;
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    this.listeners.push(
      this.renderer.listen(
        this.svgElRef.nativeElement,
        'click',
        (mouseEv: MouseEvent) => this.onMouseClick(mouseEv)
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.svgElRef.nativeElement,
        'dblclick',
        (mouseEv: MouseEvent) => this.onMouseDblClick(mouseEv)
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.svgElRef.nativeElement,
        'mousemove',
        (mouseEv: MouseEvent) => this.onMouseMove(mouseEv)
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.svgElRef.nativeElement,
        'keydown',
        (keyEv: KeyboardEvent) => this.onKeyDown(keyEv)
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.svgElRef.nativeElement,
        'keyup',
        (keyEv: KeyboardEvent) => this.onKeyUp(keyEv)
      )
    );
  }

  ngOnDestroy() {
    this.listeners.forEach(listenner => listenner());
  }

  private onMouseClick(mouseEv: MouseEvent): void {
    let currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
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
    if (!this.isNewPath) {
      let currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
      this.removeLine();
      this.removeLine(); // remove the click event
      const isLessThan3pixels = this.mathService.distanceIsLessThan3Pixel(
        currentPoint,
        this.getPath().datas.points[0]
      );
      if (isLessThan3pixels) {
        this.getPath().closePath();

      } else {
        if (mouseEv.shiftKey) {
          currentPoint = this.getPath().getAlignedPoint(currentPoint);
          console.log('la')
        }
        this.addNewLine(currentPoint);
      }
      this.isNewPath = true;
      this.undoRedo.addToCommands();
    }
  }

  private onMouseMove(mouseEv: MouseEvent): void {
    if (!this.isNewPath) {
      let point = (this.mousePosition = {
        x: mouseEv.offsetX,
        y: mouseEv.offsetY
      });
      if (mouseEv.shiftKey) {
        point = this.getPath().getAlignedPoint(point);
      }
      this.getPath().simulateNewLine(point);
    }
  }

  private onKeyDown(keyEv: KeyboardEvent): void {
    const shiftIsPressed =
      keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight';
    if (!this.isNewPath) {
      if (keyEv.code === 'Escape') {
        this.getPath().removePath();
        this.isNewPath = true;
      }
      if (
        keyEv.code === 'Backspace' &&
        this.getPath().datas.points.length >= 2
      ) {
        this.removeLine();
        this.getPath().simulateNewLine(this.getPath().lastPoint);
      }
      if (shiftIsPressed) {
        const transformedPoint = this.getPath().getAlignedPoint(
          this.mousePosition
        );
        this.getPath().simulateNewLine(transformedPoint);
      }
    }
  }

  private onKeyUp(keyEv: KeyboardEvent): void {
    const shiftIsPressed =
      keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight';
    if (shiftIsPressed && !this.isNewPath) {
      this.getPath().simulateNewLine(this.mousePosition);
    }
  }

  private createNewPath(initialPoint: Point): void {
    const path = this.renderer.createElement('path', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, path);
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
    if (this.getPath().withJonctions) {
      this.getPath().removeLastInstruction();
    }
  }

  private getPath(): Path {
    return this.paths[this.paths.length - 1];
  }
}

interface JonctionOption {
  radius: number,
  color: string
}
