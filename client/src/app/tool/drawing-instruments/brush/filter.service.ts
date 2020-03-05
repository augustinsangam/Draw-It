import { Injectable, Renderer2 } from '@angular/core';

const SVG_NS = 'http://www.w3.org/2000/svg' ;

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  generateBrushFilters(renderer: Renderer2): SVGDefsElement {
    const svgDefsEl: SVGDefsElement = renderer.createElement('defs', SVG_NS);
    renderer.appendChild(svgDefsEl, this.generateFilterOne(renderer));
    renderer.appendChild(svgDefsEl, this.generateFilterTwo(renderer));
    renderer.appendChild(svgDefsEl, this.generateFilterThree(renderer));
    renderer.appendChild(svgDefsEl, this.generateFilterFour(renderer));
    renderer.appendChild(svgDefsEl, this.generateFilterFive(renderer));
    return svgDefsEl;
  }

  generateExportFilters(renderer: Renderer2): SVGDefsElement {
    const svgDefsEl: SVGDefsElement = renderer.createElement('defs', SVG_NS);
    renderer.appendChild(svgDefsEl, this.generateFilterBlackWhite(renderer));
    renderer.appendChild(svgDefsEl, this.generateFilterSaturate(renderer));
    renderer.appendChild(svgDefsEl, this.generateFilterInvertion(renderer));
    return svgDefsEl;
  }

  private generateFilterOne(renderer: Renderer2): SVGFilterElement {
    const svgFilterEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    svgFilterEl.setAttribute('id', 'filter1');
    svgFilterEl.setAttribute('filterUnits', 'userSpaceOnUse');

    const svgFeTurbulence: SVGFETurbulenceElement =
      renderer.createElement('feTurbulence', SVG_NS);
    svgFeTurbulence.setAttribute('type', 'turbulence');
    svgFeTurbulence.setAttribute('baseFrequency', '0.05');
    svgFeTurbulence.setAttribute('numOctaves', '2');
    svgFeTurbulence.setAttribute('result', 'turbulence');
    renderer.appendChild(svgFilterEl, svgFeTurbulence);

    const svgDisplacementMap: SVGFEDisplacementMapElement =
      renderer.createElement('feDisplacementMap', SVG_NS);
    svgDisplacementMap.setAttribute('in2', 'turbulence');
    svgDisplacementMap.setAttribute('in', 'SourceGraphic');
    svgDisplacementMap.setAttribute('scale', '50');
    svgDisplacementMap.setAttribute('xChannelSelector', 'R');
    svgDisplacementMap.setAttribute('yChannelSelector', 'G');
    renderer.appendChild(svgFilterEl, svgDisplacementMap);

    return svgFilterEl;
  }

  private generateFilterTwo(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement =
      renderer.createElement('filter', SVG_NS);
    filterSvgEl.setAttribute('id', 'filter2');
    filterSvgEl.setAttribute('filterUnits', 'userSpaceOnUse');
    const feGaussianBlurSvgEl: SVGFEGaussianBlurElement =
      renderer.createElement('feGaussianBlur', SVG_NS);
    feGaussianBlurSvgEl.setAttribute('in', 'SourceGraphic');
    feGaussianBlurSvgEl.setAttribute('stdDeviation', '4');
    feGaussianBlurSvgEl.setAttribute('result', 'blur');
    renderer.appendChild(filterSvgEl, feGaussianBlurSvgEl);
    const feOffset: SVGFEOffsetElement =
      renderer.createElement('feOffset', SVG_NS);
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('result', 'offsetBlur');
    renderer.appendChild(filterSvgEl, feOffset);
    return filterSvgEl;
  }

  private generateFilterThree(renderer: Renderer2): SVGFilterElement {
    const svgFilterEl: SVGFilterElement =
      renderer.createElement('filter', SVG_NS);
    svgFilterEl.setAttribute('id', 'filter3');
    svgFilterEl.setAttribute('filterUnits', 'userSpaceOnUse');

    const feGaussianBlurSvgEl: SVGFEGaussianBlurElement =
      renderer.createElement('feGaussianBlur', SVG_NS);
    feGaussianBlurSvgEl.setAttribute('in', 'SourceAlpha');
    feGaussianBlurSvgEl.setAttribute('stdDeviation', '4');
    feGaussianBlurSvgEl.setAttribute('result', 'blur');
    renderer.appendChild(svgFilterEl, feGaussianBlurSvgEl);

    const feOffset: SVGFEOffsetElement =
      renderer.createElement('feOffset', SVG_NS);
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('dx', '4');
    feOffset.setAttribute('dy', '4');
    feOffset.setAttribute('result', 'offsetBlur');
    renderer.appendChild(svgFilterEl, feOffset);

    const feSpecularLighting: SVGFESpecularLightingElement =
      renderer.createElement('feSpecularLighting', SVG_NS);
    feSpecularLighting.setAttribute('in', 'blur');
    feSpecularLighting.setAttribute('surfaceScale', '5');
    feSpecularLighting.setAttribute('specularConstant', '.75');
    feSpecularLighting.setAttribute('specularExponent', '20');
    feSpecularLighting.setAttribute('result', 'specOut');
    renderer.appendChild(svgFilterEl, feSpecularLighting);

    const feComposite: SVGFECompositeElement =
      renderer.createElement('feComposite', SVG_NS);
    feComposite.setAttribute('in', 'SourceGraphic');
    feComposite.setAttribute('in2', 'specOut');
    feComposite.setAttribute('operator', 'arithmetic');
    feComposite.setAttribute('result', 'specOut');
    feComposite.setAttribute('k1', '0');
    feComposite.setAttribute('k2', '1');
    feComposite.setAttribute('k3', '1');
    feComposite.setAttribute('k4', '0');
    feComposite.setAttribute('result', 'litPaint');
    renderer.appendChild(svgFilterEl, feComposite);

    const feMerge: SVGFEMergeElement =
      renderer.createElement('feMerge', SVG_NS);

    const feMergeNode1: SVGFEMergeNodeElement = renderer.createElement(
      'feMergeNode', SVG_NS);
    feMergeNode1.setAttribute('in', 'offsetBlur');
    renderer.appendChild(feMerge, feMergeNode1);

    const feMergeNode2: SVGFEMergeNodeElement =
      renderer.createElement('feMergeNode', SVG_NS);
    feMergeNode2.setAttribute('in', 'litPaint');
    renderer.appendChild(feMerge, feMergeNode2);
    renderer.appendChild(svgFilterEl, feMerge);

    return svgFilterEl;
  }

  private generateFilterFour(renderer: Renderer2): SVGFilterElement {
    const svgFilterEl: SVGFilterElement =
      renderer.createElement('filter', SVG_NS);
    svgFilterEl.setAttribute('id', 'filter4');
    svgFilterEl.setAttribute('filterUnits', 'userSpaceOnUse');
    svgFilterEl.setAttribute('x', '0%');
    svgFilterEl.setAttribute('y', '0%');

    const svgFeTurbulence: SVGFETurbulenceElement =
      renderer.createElement('feTurbulence', SVG_NS);
    svgFeTurbulence.setAttribute('baseFrequency', '0.01 0.4');
    svgFeTurbulence.setAttribute('numOctaves', '2');
    svgFeTurbulence.setAttribute('result', 'NOISE');
    renderer.appendChild(svgFilterEl, svgFeTurbulence);

    const svgDisplacementMap: SVGFEDisplacementMapElement =
      renderer.createElement('feDisplacementMap', SVG_NS);
    svgDisplacementMap.setAttribute('in', 'SourceGraphic');
    svgDisplacementMap.setAttribute('in2', 'NOISE');
    svgDisplacementMap.setAttribute('scale', '20');
    svgDisplacementMap.setAttribute('xChannelSelector', 'R');
    svgDisplacementMap.setAttribute('yChannelSelector', 'R');
    renderer.appendChild(svgFilterEl, svgDisplacementMap);

    return svgFilterEl;
  }

  private generateFilterFive(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    filterSvgEl.setAttribute('id', 'filter5');
    filterSvgEl.setAttribute('filterUnits', 'userSpaceOnUse');

    const feTurbulenceSvgEl: SVGFETurbulenceElement =
      renderer.createElement('feTurbulence', SVG_NS);
    feTurbulenceSvgEl.setAttribute('baseFrequency', '0.7');
    renderer.appendChild(filterSvgEl, feTurbulenceSvgEl);

    const feDisplacementMapSvgEl: SVGFEDisplacementMapElement =
      renderer.createElement('feDisplacementMap', SVG_NS);
    feDisplacementMapSvgEl.setAttribute('in', 'SourceGraphic');
    feDisplacementMapSvgEl.setAttribute('scale', '20');
    renderer.appendChild(filterSvgEl, feDisplacementMapSvgEl);

    return filterSvgEl;
  }
  // <filter id="invertion">
  //   <feColorMatrix in="SourceGraphic" type="matrix" values="-1 0 0 0 1
  //                                                           0 -1 0 0 1
  //                                                           0 0 -1 0 1
  //                                                           0 0 0 1 0" />
  // </filter>

  private generateFilterInvertion(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    filterSvgEl.setAttribute('id', 'invertion');

    const feColorMatrixSvgEl: SVGFEColorMatrixElement = renderer.createElement('feColorMatrix', SVG_NS);
    feColorMatrixSvgEl.setAttribute('in', 'SourceGraphic');
    feColorMatrixSvgEl.setAttribute('type', 'matrix');
    feColorMatrixSvgEl.setAttribute('values', '-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0');
    renderer.appendChild(filterSvgEl, feColorMatrixSvgEl);
    return filterSvgEl;
  }

  private generateFilterBlackWhite(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    filterSvgEl.setAttribute('id', 'blackWhite');

    const feColorMatrixSvgEl: SVGFEColorMatrixElement = renderer.createElement('feColorMatrix', SVG_NS);
    feColorMatrixSvgEl.setAttribute('type', 'matrix');
    feColorMatrixSvgEl.setAttribute('values', '0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 1 0 ');
    renderer.appendChild(filterSvgEl, feColorMatrixSvgEl);
    return filterSvgEl;
  }

  private generateFilterSaturate(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    filterSvgEl.setAttribute('id', 'saturate');

    const feColorMatrixSvgEl: SVGFEColorMatrixElement = renderer.createElement('feColorMatrix', SVG_NS);
    feColorMatrixSvgEl.setAttribute('in', 'SourceGraphic');
    feColorMatrixSvgEl.setAttribute('type', 'saturate');
    feColorMatrixSvgEl.setAttribute('values', '0.5');
    renderer.appendChild(filterSvgEl, feColorMatrixSvgEl);
    return filterSvgEl;
  }
}
