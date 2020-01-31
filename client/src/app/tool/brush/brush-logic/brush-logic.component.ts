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

  currentX: number;
  currentY: number;
  strokeLineCap: string;
  stringPath: string;
  filter: string;
  private mouseOnHold: boolean;
  private svgPath: SVGPathElement;
  private listeners: (() => void)[] = [];

  constructor(protected renderer: Renderer2,
    private colorService: ColorService,
    private brushService: BrushService) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    this.currentX = 0;
    this.currentY = 0;
    this.stringPath = '';
    this.svgTag = 'path';
    this.strokeLineCap = 'round';
    this.filter = this.brushService.texture;
    this.mouseOnHold = false;

    this.generateFilterOne();
    this.generateFilterTwo()

  }

  makeFirstPoint(mouseEv: MouseEvent) {
    if (mouseEv.button === 0) {
      this.currentX = mouseEv.offsetX;
      this.currentY = mouseEv.offsetY;
      this.stringPath = 'M' + this.currentX + ',' + this.currentY + ' h0';
    }
  }

  drawing(mouseEv: MouseEvent) {
    if (mouseEv.button === 0) {
      this.stringPath += ' L' + mouseEv.offsetX + ',' + mouseEv.offsetY;
      this.stringPath += ' M' + mouseEv.offsetX + ',' + mouseEv.offsetY;
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

  defineFilter(filter: string) {
    this.filter = filter;
  }

  onMouseDown(mouseEv: MouseEvent) {
    this.defineParameter();
    this.defineFilter(this.brushService.texture);
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement(this.svgTag, this.svgNS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.svgElRef.nativeElement, this.svgPath);
  }

  onMouseMove(mouseEv: MouseEvent) {
    this.drawing(mouseEv);
    this.svgPath.setAttribute('d', this.stringPath);
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
    this.renderer.appendChild(svgFilterEl,feGaussianBlurSvgEl );

    const feOffset: SVGFEOffsetElement = this.renderer.createElement('feOffset', this.svgNS); 
    feOffset.setAttribute('in', 'SourceAlpha');
    feOffset.setAttribute('dx', '4');
    feOffset.setAttribute('dy', 'blur');
    feOffset.setAttribute('result', 'offsetBlur');
    this.renderer.appendChild(svgFilterEl,feOffset );

    const feSpecularLighting: SVGFETurbulenceElement = this.renderer.createElement('feSpecularLighting', this.svgNS);
    feSpecularLighting.setAttribute('in', 'blur');
    feSpecularLighting.setAttribute('surfaceScale', '5');
    feSpecularLighting.setAttribute('specularConstant', '.75');
    feSpecularLighting.setAttribute('specularExponent', '20');
    feSpecularLighting.setAttribute('result', 'specOut');
    this.renderer.appendChild(svgFilterEl, feSpecularLighting);

    const feComposite: SVGFETurbulenceElement = this.renderer.createElement('feSpecularLighting', this.svgNS);
    feComposite.setAttribute('in', 'specOut');
    feComposite.setAttribute('in2', 'SourceAlpha');
    feComposite.setAttribute('operator', 'in');
    feComposite.setAttribute('result', 'specOut');
    this.renderer.appendChild(svgFilterEl, feComposite);

    const feComposite2: SVGFETurbulenceElement = this.renderer.createElement('feSpecularLighting', this.svgNS);
    feComposite2.setAttribute('in', 'SourceGraphic');
    feComposite2.setAttribute('in2', 'specOut');
    feComposite2.setAttribute('operator', 'arithmetic');
    feComposite2.setAttribute('result', 'specOut');
    feComposite2.setAttribute('k1', '0');
    feComposite2.setAttribute('k2', '1');
    feComposite2.setAttribute('k3', '1');
    feComposite2.setAttribute('k4', '0');
    feComposite2.setAttribute('result', 'litPaint');
    this.renderer.appendChild(svgFilterEl, feComposite2);

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


  generateFilterFoor(){
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
}
