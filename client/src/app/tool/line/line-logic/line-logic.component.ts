import { Component, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { MathService} from '../../mathematics/tool.math-service.service'
import { Point } from '../../tool-common classes/Point'
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { LineService } from '../line.service';
import { JonctionOption } from './jonctionOptions'
import { Path } from './Path'

@Component({
  selector: 'app-line-logic',
  template: ''
})
export class LineLogicComponent extends ToolLogicDirective {
  private paths: Path[] = [];
  private isNewPath = true;
  private mousePosition: Point;
  private mathService = new MathService();
  private currentJonctionOptions: JonctionOption
  constructor(private readonly service: LineService,
              private readonly renderer: Renderer2,
              private readonly serviceColor: ColorService) {
    super();
  }
  private listeners: (() => void)[] = [];

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    const onMouseDown = this.renderer.listen(this.svgElRef.nativeElement, 'click', (mouseEv: MouseEvent) => {
      this.onMouseClick(mouseEv);
    });

    const onMouseMove = this.renderer.listen(this.svgElRef.nativeElement, 'mousemove', (mouseEv: MouseEvent) => {
      this.onMouseMove(mouseEv);
    });
    const onMouseUp = this.renderer.listen(this.svgElRef.nativeElement, 'dblclick', (mouseEv: MouseEvent) => {
      this.onMouseUp(mouseEv);
    });
    const onKeyDown = this.renderer.listen('document', 'keydown', (keyEv: KeyboardEvent) => {
      this.onKeyDown(keyEv);
    });
    const onKeyUp = this.renderer.listen('document', 'keyup', (keyEv: KeyboardEvent) => {
      this.onKeyUp(keyEv);
    });
    this.listeners = [onMouseDown, onMouseMove, onMouseUp, onKeyUp, onKeyDown];
  }
  createNewPath(initialPoint: Point) {
    const path = this.renderer.createElement('path', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, path);
    this.paths.push(new Path(initialPoint, this.renderer, path, this.service.withJonction));
    this.getPath().setLineCss(this.service.thickness.toString(), this.serviceColor.primaryColor);
  }
  createJonction(center: Point) {
    const circle = this.renderer.createElement('circle', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, circle);
    this.getPath().addJonction(circle, center, this.currentJonctionOptions.radius, this.currentJonctionOptions.color);
  }
  addNewLine(currentPoint: Point) {
    this.getPath().addLine(currentPoint);
    if (this.getPath().withJonctions) {
      this.createJonction(currentPoint);
    }
  }
  onMouseClick(mouseEv: MouseEvent) {
    let currentPoint = {x: mouseEv.offsetX, y: mouseEv.offsetY};
    if (this.isNewPath) {
      this.createNewPath(currentPoint)
      this.currentJonctionOptions = {radius: this.service.radius.toString(),
                                     color: this.serviceColor.primaryColor }
      this.isNewPath = false;
    }
    if (mouseEv.shiftKey && !this.isNewPath) {
      currentPoint = this.getPath().getAlignedPoint(currentPoint);
    }
    this.addNewLine(currentPoint)
  }
  onMouseMove(mouseEv: MouseEvent) {
    if (!this.isNewPath) {
      let point = this.mousePosition = {x: mouseEv.offsetX, y: mouseEv.offsetY};
      if (mouseEv.shiftKey) {
        point = this.getPath().getAlignedPoint(point)
      }
      this.getPath().simulateNewLine(point);
    }
  }
  onMouseUp(mouseEv: MouseEvent) {
    if (!this.isNewPath) {
      let currentPoint = {x: mouseEv.offsetX, y: mouseEv.offsetY};
      this.getPath().removeLastLine(); // cancel the click event
      this.getPath().removeLastLine();
      const isLessThan3pixels = this.mathService.distanceIsLessThan3Pixel(currentPoint, this.getPath().datas.points[0])
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
  onKeyDown(keyEv: KeyboardEvent) {
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
  onKeyUp(keyEv: KeyboardEvent) {
    const shiftIsPressed = (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight')
    if (shiftIsPressed && !this.isNewPath) {
      this.getPath().simulateNewLine(this.mousePosition);
    }
  }
  getPath(): Path {
    return this.paths[this.paths.length - 1];
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.listeners.forEach(listenner => {
      listenner();
    })
  }
}
