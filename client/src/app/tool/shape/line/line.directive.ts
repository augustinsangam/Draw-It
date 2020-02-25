import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { SVG_NS } from '../../../constants/constants';
import { MathematicsService } from '../../../mathematics/mathematics.service';
import { UndoRedoService } from '../../../undo-redo/undo-redo.service';
import { ColorService } from '../../color/color.service';
import { ToolDirective } from '../../tool.directive';
import { Path } from '../common/path';
import { Point } from '../common/point';
import { LineService } from './line.service';

interface JonctionOption {
  color: string;
  radius: string;
}

@Directive({
  selector: '[appLine]',
})
export class LineDirective extends ToolDirective implements OnDestroy, OnInit {

  // private drawZone: SVGGElement;
  private paths: Path[];
  private listeners: (() => void)[];
  private isNewPath: boolean;
  private mousePosition: Point;
  private currentJonctionOptions: JonctionOption;
  private drawZone?: SVGGElement;

  constructor(
    elementRef: ElementRef<SVGSVGElement>,
    private readonly colorService: ColorService,
    private readonly mathService: MathematicsService,
    private readonly renderer: Renderer2,
    private readonly service: LineService,
    undoRedoService: UndoRedoService,
  ) {
    super(elementRef, colorService, mathService, renderer, service,
      undoRedoService);
    this.paths = [];
    this.listeners = [];
    this.isNewPath = true;
  }

  ngOnDestroy(): void {
    this.listeners.forEach((listenner) => listenner());
  }

  ngOnInit(): void {
    this.drawZone = this.elementRef.nativeElement
      .getElementById('zone') as SVGGElement;
    console.log(this.drawZone);

    this.listeners.push(
      this.renderer.listen(
        this.elementRef.nativeElement,
        'click',
        (mouseEv: MouseEvent) => this.onMouseClick(mouseEv),
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.elementRef.nativeElement,
        'dblclick',
        (mouseEv: MouseEvent) => this.onMouseDblClick(mouseEv),
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.elementRef.nativeElement,
        'mousemove',
        (mouseEv: MouseEvent) => this.onMouseMove(mouseEv),
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.elementRef.nativeElement,
        'keydown',
        (keyEv: KeyboardEvent) => this.onKeyDown(keyEv),
      )
    );

    this.listeners.push(
      this.renderer.listen(
        this.elementRef.nativeElement,
        'keyup',
        (keyEv: KeyboardEvent) => this.onKeyUp(keyEv),
      )
    );
  }

  private onMouseClick(mouseEv: MouseEvent): void {
    let currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
    if (this.isNewPath) {
      this.createNewPath(currentPoint);
      this.currentJonctionOptions = {
        color: this.colorService.primaryColor,
        radius: this.service.radius.toString(),
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
      this.getPath().removeLastLine(); // cancel the click event
      this.getPath().removeLastLine();
      const isLessThan3pixels = this.mathService.distanceIsLessThan3Pixel(
        currentPoint,
        this.getPath().datas.points[0],
      );
      if (isLessThan3pixels) {
        this.getPath().closePath();
      } else {
        if (mouseEv.shiftKey) {
          currentPoint = this.getPath().getAlignedPoint(currentPoint);
        }
        this.addNewLine(currentPoint);
      }
      this.isNewPath = true;
      this.save();
    }
  }

  private onMouseMove(mouseEv: MouseEvent): void {
    if (!this.isNewPath) {
      let point = (this.mousePosition = {
        x: mouseEv.offsetX,
        y: mouseEv.offsetY,
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
        this.getPath().removeLastLine();
        this.getPath().simulateNewLine(this.getPath().lastPoint);
      }
      if (shiftIsPressed) {
        const transformedPoint = this.getPath().getAlignedPoint(
          this.mousePosition,
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
    const path = this.renderer.createElement('path', SVG_NS);
    this.renderer.appendChild(this.drawZone, path);
    this.paths.push(
      new Path(initialPoint, this.renderer, path, this.service.withJonction),
    );
    this.getPath().setLineCss(
      this.service.thickness.toString(),
      this.colorService.primaryColor,
    );
  }

  private createJonction(center: Point): void {
    const circle = this.renderer.createElement('circle', SVG_NS);
    const drawZone = this.elementRef.nativeElement
      .getElementById('zone') as SVGGElement;
    this.renderer.appendChild(drawZone, circle);
    this.getPath().addJonction(
      circle,
      center,
      this.currentJonctionOptions.radius,
      this.currentJonctionOptions.color,
    );
  }

  private addNewLine(currentPoint: Point): void {
    this.getPath().addLine(currentPoint);
    if (this.getPath().withJonctions) {
      this.createJonction(currentPoint);
    }
  }

  private getPath(): Path {
    return this.paths[this.paths.length - 1];
  }
}
