import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { Svg, SVG_NS } from '../../../constants/constants';
import { MathematicsService } from '../../../mathematics/mathematics.service';
import { UndoRedoService } from '../../../undo-redo/undo-redo.service';
import { ColorService } from '../../color/color.service';
import {
  PencilBrushCommonDirective,
} from '../pencil-brush-common/pencil-brush-common.directive';
import { BrushService } from './brush.service';

@Directive({
  selector: '[appBrush]',
})
export class BrushDirective extends PencilBrushCommonDirective
  implements OnDestroy, OnInit {

  private drawZone: SVGGElement;
  private listeners: (() => void)[];

  constructor(
    elementRef: ElementRef<SVGSVGElement>,
    private readonly colorService: ColorService,
    mathService: MathematicsService,
    private readonly renderer: Renderer2,
    private readonly service: BrushService,
    undoRedoService: UndoRedoService,
  ) {
    super(elementRef, colorService, mathService, renderer, service,
      undoRedoService);
    this.listeners = new Array();
    this.mouseOnHold = false;
    this.stringPath = '';
    this.strokeLineCap = 'round';
  }

  ngOnDestroy() {
    this.listeners.forEach((listenner) => listenner());
  }

  ngOnInit(): void {
    this.drawZone = this.elementRef.nativeElement
      .getElementById('zone') as SVGGElement;

    const drawEnd = this.elementRef.nativeElement
    .getElementById('end') as SVGGElement;

    if (this.service.isFirstLoaded) {
      const svgDefsEl: SVGDefsElement =
        this.renderer.createElement('defs', SVG_NS);
      this.renderer.appendChild(svgDefsEl, this.generateFilterOne());
      this.renderer.appendChild(svgDefsEl, this.generateFilterTwo());
      this.renderer.appendChild(svgDefsEl, this.generateFilterThree());
      this.renderer.appendChild(svgDefsEl, this.generateFilterFour());
      this.renderer.appendChild(svgDefsEl, this.generateFilterFive());
      this.renderer.appendChild(drawEnd, svgDefsEl);
      this.service.isFirstLoaded = false;
    }
    const mouseDownListen = this.renderer.listen(this.elementRef.nativeElement,
      'mousedown', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0) {
          this.mouseOnHold = true;
          this.onMouseDown(mouseEv);
        }
    });

    const mouseMoveListen = this.renderer.listen(this.elementRef.nativeElement,
      'mousemove', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.onMouseMove(mouseEv);
        }
    });

    const mouseUpListen = this.renderer.listen(this.elementRef.nativeElement,
      'mouseup', (mouseEv: MouseEvent) => {
        this.stopDrawing();
    });

    const mouseLeaveListen = this.renderer.listen(this.elementRef.nativeElement,
      'mouseleave', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.stopDrawing();
        }
    });
    this.listeners = [
      mouseDownListen,
      mouseMoveListen,
      mouseUpListen,
      mouseLeaveListen
    ];

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'cursor',
      'crosshair'
    );
  }

  protected onMouseDown(mouseEv: MouseEvent): void {
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement(Svg.PATH, SVG_NS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.drawZone, this.svgPath);
  }

  protected onMouseMove(mouseEv: MouseEvent): void {
    this.drawing(mouseEv);
    this.svgPath.setAttribute('d', this.stringPath);
  }

  protected configureSvgElement(element: SVGElement): void {
    element.setAttribute('d', this.stringPath);
    element.setAttribute('stroke', this.colorService.primaryColor);
    element.setAttribute('fill', this.colorService.primaryColor);
    element.setAttribute('filter', `url(#${this.service.texture})`);
    element.setAttribute('stroke-linecap', this.strokeLineCap);
    element.setAttribute(
      'stroke-width', this.service.thickness.toString()
    );
    element.classList.add(this.service.texture);
  }

  private generateFilterOne(): SVGFilterElement {
    const svgFilterEl: SVGFilterElement = this.renderer.createElement(
      'filter', SVG_NS);
    svgFilterEl.setAttribute('id', 'filter1');
    svgFilterEl.setAttribute('filterUnits', 'userSpaceOnUse');

    const svgFeTurbulence: SVGFETurbulenceElement =
      this.renderer.createElement('feTurbulence', SVG_NS);
    svgFeTurbulence.setAttribute('type', 'turbulence');
    svgFeTurbulence.setAttribute('baseFrequency', '0.05');
    svgFeTurbulence.setAttribute('numOctaves', '2');
    svgFeTurbulence.setAttribute('result', 'turbulence');
    this.renderer.appendChild(svgFilterEl, svgFeTurbulence);

    const svgDisplacementMap: SVGFEDisplacementMapElement =
      this.renderer.createElement('feDisplacementMap', SVG_NS);
    svgDisplacementMap.setAttribute('in2', 'turbulence');
    svgDisplacementMap.setAttribute('in', 'SourceGraphic');
    svgDisplacementMap.setAttribute('scale', '50');
    svgDisplacementMap.setAttribute('xChannelSelector', 'R');
    svgDisplacementMap.setAttribute('yChannelSelector', 'G');
    this.renderer.appendChild(svgFilterEl, svgDisplacementMap);

    return svgFilterEl;
  }

  private generateFilterTwo(): SVGFilterElement {
    const filterSvgEl: SVGFilterElement =
      this.renderer.createElement('filter', SVG_NS);
    filterSvgEl.setAttribute('id', 'filter2');
    filterSvgEl.setAttribute('filterUnits', 'userSpaceOnUse');
    const feGaussianBlurSvgEl: SVGFEGaussianBlurElement =
      this.renderer.createElement('feGaussianBlur', SVG_NS);
    feGaussianBlurSvgEl.setAttribute('in', 'SourceGraphic');
    feGaussianBlurSvgEl.setAttribute('stdDeviation', '4');
    feGaussianBlurSvgEl.setAttribute('result', 'blur');
    this.renderer.appendChild(filterSvgEl, feGaussianBlurSvgEl);
    const feOffset: SVGFEOffsetElement =
      this.renderer.createElement('feOffset', SVG_NS);
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('result', 'offsetBlur');
    this.renderer.appendChild(filterSvgEl, feOffset);
    return filterSvgEl;
  }

  private generateFilterThree(): SVGFilterElement {
    const svgFilterEl: SVGFilterElement =
      this.renderer.createElement('filter', SVG_NS);
    svgFilterEl.setAttribute('id', 'filter3');
    svgFilterEl.setAttribute('filterUnits', 'userSpaceOnUse');

    const feGaussianBlurSvgEl: SVGFEGaussianBlurElement =
      this.renderer.createElement('feGaussianBlur', SVG_NS);
    feGaussianBlurSvgEl.setAttribute('in', 'SourceAlpha');
    feGaussianBlurSvgEl.setAttribute('stdDeviation', '4');
    feGaussianBlurSvgEl.setAttribute('result', 'blur');
    this.renderer.appendChild(svgFilterEl, feGaussianBlurSvgEl);

    const feOffset: SVGFEOffsetElement =
      this.renderer.createElement('feOffset', SVG_NS);
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('dx', '4');
    feOffset.setAttribute('dy', '4');
    feOffset.setAttribute('result', 'offsetBlur');
    this.renderer.appendChild(svgFilterEl, feOffset);

    const feSpecularLighting: SVGFESpecularLightingElement =
      this.renderer.createElement('feSpecularLighting', SVG_NS);
    feSpecularLighting.setAttribute('in', 'blur');
    feSpecularLighting.setAttribute('surfaceScale', '5');
    feSpecularLighting.setAttribute('specularConstant', '.75');
    feSpecularLighting.setAttribute('specularExponent', '20');
    feSpecularLighting.setAttribute('result', 'specOut');
    this.renderer.appendChild(svgFilterEl, feSpecularLighting);

    const feComposite: SVGFECompositeElement =
      this.renderer.createElement('feComposite', SVG_NS);
    feComposite.setAttribute('in', 'SourceGraphic');
    feComposite.setAttribute('in2', 'specOut');
    feComposite.setAttribute('operator', 'arithmetic');
    feComposite.setAttribute('result', 'specOut');
    feComposite.setAttribute('k1', '0');
    feComposite.setAttribute('k2', '1');
    feComposite.setAttribute('k3', '1');
    feComposite.setAttribute('k4', '0');
    feComposite.setAttribute('result', 'litPaint');
    this.renderer.appendChild(svgFilterEl, feComposite);

    const feMerge: SVGFEMergeElement =
      this.renderer.createElement('feMerge', SVG_NS);

    const feMergeNode1: SVGFEMergeNodeElement = this.renderer.createElement(
      'feMergeNode', SVG_NS);
    feMergeNode1.setAttribute('in', 'offsetBlur');
    this.renderer.appendChild(feMerge, feMergeNode1);

    const feMergeNode2: SVGFEMergeNodeElement =
      this.renderer.createElement('feMergeNode', SVG_NS);
    feMergeNode2.setAttribute('in', 'litPaint');
    this.renderer.appendChild(feMerge, feMergeNode2);
    this.renderer.appendChild(svgFilterEl, feMerge);

    return svgFilterEl;
  }

  private generateFilterFour(): SVGFilterElement {
    const svgFilterEl: SVGFilterElement =
      this.renderer.createElement('filter', SVG_NS);
    svgFilterEl.setAttribute('id', 'filter4');
    svgFilterEl.setAttribute('filterUnits', 'userSpaceOnUse');
    svgFilterEl.setAttribute('x', '0%');
    svgFilterEl.setAttribute('y', '0%');

    const svgFeTurbulence: SVGFETurbulenceElement =
      this.renderer.createElement('feTurbulence', SVG_NS);
    svgFeTurbulence.setAttribute('baseFrequency', '0.01 0.4');
    svgFeTurbulence.setAttribute('numOctaves', '2');
    svgFeTurbulence.setAttribute('result', 'NOISE');
    this.renderer.appendChild(svgFilterEl, svgFeTurbulence);

    const svgDisplacementMap: SVGFEDisplacementMapElement =
      this.renderer.createElement('feDisplacementMap', SVG_NS);
    svgDisplacementMap.setAttribute('in', 'SourceGraphic');
    svgDisplacementMap.setAttribute('in2', 'NOISE');
    svgDisplacementMap.setAttribute('scale', '20');
    svgDisplacementMap.setAttribute('xChannelSelector', 'R');
    svgDisplacementMap.setAttribute('yChannelSelector', 'R');
    this.renderer.appendChild(svgFilterEl, svgDisplacementMap);

    return svgFilterEl;
  }

  private generateFilterFive(): SVGFilterElement {
    const filterSvgEl: SVGFilterElement =
      this.renderer.createElement('filter', SVG_NS);
    filterSvgEl.setAttribute('id', 'filter5');
    filterSvgEl.setAttribute('filterUnits', 'userSpaceOnUse');

    const feTurbulenceSvgEl: SVGFETurbulenceElement =
      this.renderer.createElement('feTurbulence', SVG_NS);
    feTurbulenceSvgEl.setAttribute('baseFrequency', '0.7');
    this.renderer.appendChild(filterSvgEl, feTurbulenceSvgEl);

    const feDisplacementMapSvgEl: SVGFEDisplacementMapElement =
      this.renderer.createElement('feDisplacementMap', SVG_NS);
    feDisplacementMapSvgEl.setAttribute('in', 'SourceGraphic');
    feDisplacementMapSvgEl.setAttribute('scale', '20');
    this.renderer.appendChild(filterSvgEl, feDisplacementMapSvgEl);

    return filterSvgEl;
  }
}
