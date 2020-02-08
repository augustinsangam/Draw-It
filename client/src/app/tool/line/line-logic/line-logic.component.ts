import { Component, OnDestroy, Renderer2 } from '@angular/core';

import { ColorService } from '../../color/color.service';
import { Point } from '../../common/Point'
import { MathService} from '../../mathematics/tool.math-service.service'
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { LineService } from '../line.service';
import { JonctionOption } from './jonctionOptions';
import { Path } from './Path';

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

  constructor(private readonly service: LineService,
              private readonly renderer: Renderer2,
              private readonly serviceColor: ColorService,
              private readonly mathService: MathService) {
    super();
    this.paths = new Array();
    this.listeners = new Array();
    this.isNewPath = true;
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    this.listeners.push(this.renderer.listen(this.svgElRef.nativeElement,
      'click', (mouseEv: MouseEvent) => this.onMouseClick(mouseEv)));

    this.listeners.push(this.renderer.listen(this.svgElRef.nativeElement,
      'dblclick', (mouseEv: MouseEvent) => this.onMouseDblClick(mouseEv)));

    this.listeners.push(this.renderer.listen(this.svgElRef.nativeElement,
      'mousemove', (mouseEv: MouseEvent) => this.onMouseMove(mouseEv)));

    this.listeners.push(this.renderer.listen(this.svgElRef.nativeElement,
      'keydown', (keyEv: KeyboardEvent) => this.onKeyDown(keyEv)));

    this.listeners.push(this.renderer.listen(this.svgElRef.nativeElement,
      'keyup', (keyEv: KeyboardEvent) => this.onKeyUp(keyEv)));
  }

  ngOnDestroy() {
    this.listeners.forEach(listenner => listenner())
  }

  private onMouseClick(mouseEv: MouseEvent) {
    let currentPoint = {x: mouseEv.offsetX, y: mouseEv.offsetY};
    if (this.isNewPath) {
      this.createNewPath(currentPoint);
      this.currentJonctionOptions = {radius: this.service.radius.toString(),
                                     color: this.serviceColor.primaryColor };
      this.isNewPath = false;
    }
    if (mouseEv.shiftKey && !this.isNewPath) {
      currentPoint = this.getPath().getAlignedPoint(currentPoint);
    }
    this.addNewLine(currentPoint)
  }

  private onMouseDblClick(mouseEv: MouseEvent) {
    if (!this.isNewPath) {
      let currentPoint = {x: mouseEv.offsetX, y: mouseEv.offsetY};
      this.getPath().removeLastLine(); // cancel the click event
      this.getPath().removeLastLine();
      const isLessThan3pixels = this.mathService.distanceIsLessThan3Pixel(
        currentPoint, this.getPath().datas.points[0])
      if (isLessThan3pixels) {
        this.getPath().closePath();
      } else {
        if (mouseEv.shiftKey) {
          currentPoint = this.getPath().getAlignedPoint(currentPoint)
        }
        this.addNewLine(currentPoint)
      }
      this.isNewPath = true;
    }
  }

  private onMouseMove(mouseEv: MouseEvent) {
    if (!this.isNewPath) {
      let point = this.mousePosition = {x: mouseEv.offsetX, y: mouseEv.offsetY};
      if (mouseEv.shiftKey) {
        point = this.getPath().getAlignedPoint(point)
      }
      this.getPath().simulateNewLine(point);
    }
  }

  private onKeyDown(keyEv: KeyboardEvent) {
    const shiftIsPressed = (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight')
    if (keyEv.code === 'Escape' && !this.isNewPath) {
      this.getPath().removePath();
      this.isNewPath = true;
    }
    if (keyEv.code === 'Backspace' && this.getPath().datas.points.length >= 2) {
      this.getPath().removeLastLine();
      this.getPath().simulateNewLine(this.getPath().lastPoint);
    }
    if (shiftIsPressed && !this.isNewPath) {
      const transformedPoint = this.getPath().getAlignedPoint(this.mousePosition);
      this.getPath().simulateNewLine(transformedPoint);
    }
  }

  private onKeyUp(keyEv: KeyboardEvent) {
    const shiftIsPressed = (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight')
    if (shiftIsPressed && !this.isNewPath) {
      this.getPath().simulateNewLine(this.mousePosition);
    }
  }

  private createNewPath(initialPoint: Point) {
    const path = this.renderer.createElement('path', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, path);
    this.paths.push(new Path(initialPoint, this.renderer, path, this.service.withJonction));
    this.getPath().setLineCss(this.service.thickness.toString(), this.serviceColor.primaryColor);
  }

  private createJonction(center: Point) {
    const circle = this.renderer.createElement('circle', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, circle);
    this.getPath().addJonction(circle, center, this.currentJonctionOptions.radius, this.currentJonctionOptions.color);
  }

  private addNewLine(currentPoint: Point) {
    this.getPath().addLine(currentPoint);
    if (this.getPath().withJonctions) {
      this.createJonction(currentPoint);
    }
  }

  private getPath(): Path {
    return this.paths[this.paths.length - 1];
  }
}
