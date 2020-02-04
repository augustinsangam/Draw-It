import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { PencilBrushCommon } from '../../pencil-brush/pencil-brush-common';
import { BrushService } from '../brush.service';

@Component({
  selector: 'app-brush-logic',
  templateUrl: './brush-logic.component.html',
  styleUrls: ['./brush-logic.component.scss']
})
export class BrushLogicComponent extends PencilBrushCommon implements AfterViewInit {

  strokeLineCap: string;
  filter: string;
  private svgPath: SVGPathElement;
  private listeners: (() => void)[] = [];

  constructor(protected renderer: Renderer2,
              private colorService: ColorService,
              private brushService: BrushService) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    this.stringPath = '';
    this.svgTag = 'path';
    this.strokeLineCap = 'round';
    this.filter = this.brushService.texture;
    this.mouseOnHold = false;

    this.generateFilterOne();
    this.generateFilterTwo();
    this.generateFilterThree();
    this.generateFilterFoor();
    this.generateFilterFive();

  }

  makeFirstPoint(mouseEv: MouseEvent) {
    if (mouseEv.button === 0) {
      this.stringPath = 'M' + mouseEv.offsetX + ',' + mouseEv.offsetY + ' h0';
    }
  }

  configureSvgElement(element: SVGElement): void {
    element.setAttribute('d', this.stringPath);
    element.setAttribute('stroke-width', this.strokeWidth.toString());
    element.setAttribute('stroke', this.stroke);
    element.setAttribute('fill', this.fill);
    element.setAttribute('filter', `url(#${this.filter})`);
    element.setAttribute('stroke-linecap', this.strokeLineCap);
  }

  defineParameter(): void {
    this.color = this.colorService.primaryColor;
    this.stroke = this.colorService.primaryColor;
    this.fill = this.colorService.primaryColor;
    this.strokeWidth = this.brushService.thickness;
    this.filter = this.brushService.texture;
  }

  onMouseDown(mouseEv: MouseEvent) {
    this.defineParameter();
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement(this.svgTag, this.svgNS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.svgElRef.nativeElement, this.svgPath);
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.listeners.forEach(listenner => {
      listenner();
    })
  }

  ngAfterViewInit() {
    const mouseDownListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mousedown', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0) {
          this.mouseOnHold = true;
          this.onMouseDown(mouseEv);
        }
      });

    const mouseMoveListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mousemove', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.onMouseMove(mouseEv);
        }
      });

    const mouseUpListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mouseup', (mouseEv: MouseEvent) => {
        this.mouseOnHold = false;
        this.stringPath = '';
      });

    const mouseLeaveListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mouseleave', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.mouseOnHold = false;
          this.stringPath = '';
        }
      });
    this.listeners = [mouseDownListen, mouseMoveListen, mouseUpListen, mouseLeaveListen]
  }

  generateFilterOne() {
    const svgDefsEl: SVGDefsElement = this.renderer.createElement('defs', this.svgNS);
    const svgFilterEl: SVGFilterElement = this.renderer.createElement('filter', this.svgNS);
    svgFilterEl.setAttribute('id', 'filter1');

    const svgFeTurbulence: SVGFETurbulenceElement = this.renderer.createElement('feTurbulence', this.svgNS);
    svgFeTurbulence.setAttribute('type', 'turbulence');
    svgFeTurbulence.setAttribute('baseFrequency', '0.05');
    svgFeTurbulence.setAttribute('numOctaves', '2');
    svgFeTurbulence.setAttribute('result', 'turbulence');
    this.renderer.appendChild(svgFilterEl, svgFeTurbulence);

    const svgDisplacementMap: SVGFEDisplacementMapElement = this.renderer.createElement('feDisplacementMap', this.svgNS);
    svgDisplacementMap.setAttribute('in2', 'turbulence');
    svgDisplacementMap.setAttribute('in', 'SourceGraphic');
    svgDisplacementMap.setAttribute('scale', '50');
    svgDisplacementMap.setAttribute('xChannelSelector', 'R');
    svgDisplacementMap.setAttribute('yChannelSelector', 'G');
    this.renderer.appendChild(svgFilterEl, svgDisplacementMap);

    this.renderer.appendChild(svgDefsEl, svgFilterEl);
    this.renderer.appendChild(this.svgElRef.nativeElement, svgDefsEl);
  }

  generateFilterTwo() {
    const defsSvgEl: SVGDefsElement = this.renderer.createElement('defs', this.svgNS);
    const filterSvgEl: SVGFilterElement = this.renderer.createElement('filter', this.svgNS);
    filterSvgEl.setAttribute('id', 'filter2');
    const feGaussianBlurSvgEl: SVGFEGaussianBlurElement = this.renderer.createElement(
      'feGaussianBlur', this.svgNS);
    feGaussianBlurSvgEl.setAttribute('in', 'SourceGraphic');
    feGaussianBlurSvgEl.setAttribute('stdDeviation', '4');
    feGaussianBlurSvgEl.setAttribute('result', 'blur');
    this.renderer.appendChild(filterSvgEl, feGaussianBlurSvgEl);
    const feOffset: SVGFEOffsetElement = this.renderer.createElement('feOffset', this.svgNS);
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('result', 'offsetBlur');
    this.renderer.appendChild(filterSvgEl, feOffset);
    this.renderer.appendChild(defsSvgEl, filterSvgEl);
    this.renderer.appendChild(this.svgElRef.nativeElement, defsSvgEl);
  }

  generateFilterThree() {
    const svgDefsEl: SVGDefsElement = this.renderer.createElement('defs', this.svgNS);
    const svgFilterEl: SVGFilterElement = this.renderer.createElement('filter', this.svgNS);
    svgFilterEl.setAttribute('id', 'filter3');
    svgFilterEl.setAttribute('filterUnits', 'userSpaceOnUse');

    const feGaussianBlurSvgEl: SVGFEGaussianBlurElement = this.renderer.createElement('feGaussianBlur', this.svgNS);
    feGaussianBlurSvgEl.setAttribute('in', 'SourceAlpha');
    feGaussianBlurSvgEl.setAttribute('stdDeviation', '4');
    feGaussianBlurSvgEl.setAttribute('result', 'blur');
    this.renderer.appendChild(svgFilterEl, feGaussianBlurSvgEl);

    const feOffset: SVGFEOffsetElement = this.renderer.createElement('feOffset', this.svgNS);
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('dx', '4');
    feOffset.setAttribute('dy', '4');
    feOffset.setAttribute('result', 'offsetBlur');
    this.renderer.appendChild(svgFilterEl, feOffset);

    const feSpecularLighting: SVGFESpecularLightingElement = this.renderer.createElement('feSpecularLighting', this.svgNS);
    feSpecularLighting.setAttribute('in', 'blur');
    feSpecularLighting.setAttribute('surfaceScale', '5');
    feSpecularLighting.setAttribute('specularConstant', '.75');
    feSpecularLighting.setAttribute('specularExponent', '20');
    feSpecularLighting.setAttribute('result', 'specOut');
    this.renderer.appendChild(svgFilterEl, feSpecularLighting);

    const feComposite: SVGFECompositeElement = this.renderer.createElement('feComposite', this.svgNS);
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

    const feMerge: SVGFEMergeElement = this.renderer.createElement('feMerge', this.svgNS);

    const feMergeNode1: SVGFEMergeNodeElement = this.renderer.createElement('feMergeNode', this.svgNS);
    feMergeNode1.setAttribute('in', 'offsetBlur');
    this.renderer.appendChild(feMerge, feMergeNode1);

    const feMergeNode2: SVGFEMergeNodeElement = this.renderer.createElement('feMergeNode', this.svgNS);
    feMergeNode2.setAttribute('in', 'litPaint');
    this.renderer.appendChild(feMerge, feMergeNode2);

    this.renderer.appendChild(svgFilterEl, feMerge);

    this.renderer.appendChild(svgDefsEl, svgFilterEl);
    this.renderer.appendChild(this.svgElRef.nativeElement, svgDefsEl);
  }

  generateFilterFoor() {
    const svgDefsEl: SVGDefsElement = this.renderer.createElement('defs', this.svgNS);
    const svgFilterEl: SVGFilterElement = this.renderer.createElement('filter', this.svgNS);
    svgFilterEl.setAttribute('id', 'filter4');
    svgFilterEl.setAttribute('x', '0%');
    svgFilterEl.setAttribute('y', '0%');
    svgFilterEl.setAttribute('width', '100%');
    svgFilterEl.setAttribute('height', '100%');

    const svgFeTurbulence: SVGFETurbulenceElement = this.renderer.createElement('feTurbulence', this.svgNS);
    svgFeTurbulence.setAttribute('baseFrequency', '0.01 0.4');
    svgFeTurbulence.setAttribute('numOctaves', '2');
    svgFeTurbulence.setAttribute('result', 'NOISE');
    this.renderer.appendChild(svgFilterEl, svgFeTurbulence);

    const svgDisplacementMap: SVGFEDisplacementMapElement = this.renderer.createElement('feDisplacementMap', this.svgNS);
    svgDisplacementMap.setAttribute('in', 'SourceGraphic');
    svgDisplacementMap.setAttribute('in2', 'NOISE');
    svgDisplacementMap.setAttribute('scale', '20');
    svgDisplacementMap.setAttribute('xChannelSelector', 'R');
    svgDisplacementMap.setAttribute('yChannelSelector', 'R');
    this.renderer.appendChild(svgFilterEl, svgDisplacementMap);

    this.renderer.appendChild(svgDefsEl, svgFilterEl);
    this.renderer.appendChild(this.svgElRef.nativeElement, svgDefsEl);

  }

  generateFilterFive() {
    const filterSvgEl: SVGFilterElement = this.renderer.createElement(
      'filter', this.svgNS);
    filterSvgEl.setAttribute('id', 'filter5');

    const feTurbulenceSvgEl: SVGFETurbulenceElement = this.renderer.createElement(
      'feTurbulence', this.svgNS);
    feTurbulenceSvgEl.setAttribute('baseFrequency', '.9');
    this.renderer.appendChild(filterSvgEl, feTurbulenceSvgEl);

    const feDisplacementMapSvgEl: SVGFEDisplacementMapElement = this.renderer.createElement(
      'feDisplacementMap', this.svgNS);
    feDisplacementMapSvgEl.setAttribute('in', 'SourceGraphic');
    feDisplacementMapSvgEl.setAttribute('scale', '20');
    this.renderer.appendChild(filterSvgEl, feDisplacementMapSvgEl);

    const defsSvgEl: SVGDefsElement = this.renderer.createElement(
      'defs', this.svgNS);
    this.renderer.appendChild(defsSvgEl, filterSvgEl);
    this.renderer.appendChild(this.svgElRef.nativeElement, defsSvgEl);
  }
}
