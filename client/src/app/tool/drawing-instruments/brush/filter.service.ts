import { Injectable, Renderer2 } from '@angular/core';

const SVG_NS = 'http://www.w3.org/2000/svg' ;

@Injectable({
  providedIn: 'root'
})
export class FilterService {
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
    renderer.appendChild(svgDefsEl, this.generateFilterSepia(renderer));
    renderer.appendChild(svgDefsEl, this.generateFilterGreyScale(renderer));
    return svgDefsEl;
  }

  private generateFilterOne(renderer: Renderer2): SVGFilterElement {
    const svgFilterEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    renderer.setAttribute(svgFilterEl, 'id', 'filter1');
    renderer.setAttribute(svgFilterEl, 'filterUnits', 'userSpaceOnUse');

    const svgFeTurbulence: SVGFETurbulenceElement =
      renderer.createElement('feTurbulence', SVG_NS);
    renderer.setAttribute(svgFeTurbulence, 'type', 'turbulence');
    renderer.setAttribute(svgFeTurbulence, 'baseFrequency', '0.05');
    renderer.setAttribute(svgFeTurbulence, 'numOctaves', '2');
    renderer.setAttribute(svgFeTurbulence, 'result', 'turbulence');
    renderer.appendChild(svgFilterEl, svgFeTurbulence);

    const svgDisplacementMap: SVGFEDisplacementMapElement =
      renderer.createElement('feDisplacementMap', SVG_NS);
    renderer.setAttribute(svgDisplacementMap, 'in2', 'turbulence');
    renderer.setAttribute(svgDisplacementMap, 'in', 'SourceGraphic');
    renderer.setAttribute(svgDisplacementMap, 'scale', '50');
    renderer.setAttribute(svgDisplacementMap, 'xChannelSelector', 'R');
    renderer.setAttribute(svgDisplacementMap, 'yChannelSelector', 'G');
    renderer.appendChild(svgFilterEl, svgDisplacementMap);

    return svgFilterEl;
  }

  private generateFilterTwo(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    renderer.setAttribute(filterSvgEl, 'id', 'filter2');
    renderer.setAttribute(filterSvgEl, 'filterUnits', 'userSpaceOnUse');
    const feGaussianBlurSvgEl: SVGFEGaussianBlurElement = 
      renderer.createElement('feGaussianBlur', SVG_NS);
    renderer.setAttribute(feGaussianBlurSvgEl, 'in', 'SourceGraphic');
    renderer.setAttribute(feGaussianBlurSvgEl, 'stdDeviation', '4');
    renderer.setAttribute(feGaussianBlurSvgEl, 'result', 'blur');
    renderer.appendChild(filterSvgEl, feGaussianBlurSvgEl);
    const feOffset: SVGFEOffsetElement = renderer.createElement('feOffset', SVG_NS);
    renderer.setAttribute(feOffset, 'in', 'blur');
    renderer.setAttribute(feOffset, 'result', 'offsetBlur');
    renderer.appendChild(filterSvgEl, feOffset);
    return filterSvgEl;
  }

  private generateFilterThree(renderer: Renderer2): SVGFilterElement {
    const svgFilterEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    renderer.setAttribute(svgFilterEl, 'id', 'filter3');
    renderer.setAttribute(svgFilterEl, 'filterUnits', 'userSpaceOnUse');

    const feGaussianBlurSvgEl: SVGFEGaussianBlurElement =
      renderer.createElement('feGaussianBlur', SVG_NS);
    renderer.setAttribute(feGaussianBlurSvgEl, 'in', 'SourceAlpha');
    renderer.setAttribute(feGaussianBlurSvgEl, 'stdDeviation', '4');
    renderer.setAttribute(feGaussianBlurSvgEl, 'result', 'blur');
    renderer.appendChild(svgFilterEl, feGaussianBlurSvgEl);

    const feOffset: SVGFEOffsetElement =
      renderer.createElement('feOffset', SVG_NS);
    renderer.setAttribute(feOffset, 'in', 'blur');
    renderer.setAttribute(feOffset, 'dx', '4');
    renderer.setAttribute(feOffset, 'dy', '4');
    renderer.setAttribute(feOffset, 'result', 'offsetBlur');
    renderer.appendChild(svgFilterEl, feOffset);

    const feSpecularLighting: SVGFESpecularLightingElement =
      renderer.createElement('feSpecularLighting', SVG_NS);
    renderer.setAttribute(feSpecularLighting, 'in', 'blur');
    renderer.setAttribute(feSpecularLighting, 'surfaceScale', '5');
    renderer.setAttribute(feSpecularLighting, 'specularConstant', '.75');
    renderer.setAttribute(feSpecularLighting, 'specularExponent', '20');
    renderer.setAttribute(feSpecularLighting, 'result', 'specOut');
    renderer.appendChild(svgFilterEl, feSpecularLighting);

    const feComposite: SVGFECompositeElement = renderer.createElement('feComposite', SVG_NS);
    renderer.setAttribute(feComposite, 'in', 'SourceGraphic');
    renderer.setAttribute(feComposite, 'in2', 'specOut');
    renderer.setAttribute(feComposite, 'operator', 'arithmetic');
    renderer.setAttribute(feComposite, 'result', 'specOut');
    renderer.setAttribute(feComposite, 'k1', '0');
    renderer.setAttribute(feComposite, 'k2', '1');
    renderer.setAttribute(feComposite, 'k3', '1');
    renderer.setAttribute(feComposite, 'k4', '0');
    renderer.setAttribute(feComposite, 'result', 'litPaint');
    renderer.appendChild(svgFilterEl, feComposite);

    const feMerge: SVGFEMergeElement = renderer.createElement('feMerge', SVG_NS);

    const feMergeNode1: SVGFEMergeNodeElement = renderer.createElement('feMergeNode', SVG_NS);
    renderer.setAttribute(feMergeNode1, 'in', 'offsetBlur');
    renderer.appendChild(feMerge, feMergeNode1);

    const feMergeNode2: SVGFEMergeNodeElement = renderer.createElement('feMergeNode', SVG_NS);
    renderer.setAttribute(feMergeNode2, 'in', 'litPaint');
    renderer.appendChild(feMerge, feMergeNode2);
    renderer.appendChild(svgFilterEl, feMerge);

    return svgFilterEl;
  }

  private generateFilterFour(renderer: Renderer2): SVGFilterElement {
    const svgFilterEl: SVGFilterElement =
      renderer.createElement('filter', SVG_NS);
    renderer.setAttribute(svgFilterEl, 'id', 'filter4');
    renderer.setAttribute(svgFilterEl, 'filterUnits', 'userSpaceOnUse');
    renderer.setAttribute(svgFilterEl, 'x', '0%');
    renderer.setAttribute(svgFilterEl, 'y', '0%');

    const svgFeTurbulence: SVGFETurbulenceElement =
      renderer.createElement('feTurbulence', SVG_NS);
    renderer.setAttribute(svgFeTurbulence, 'baseFrequency', '0.01 0.4');
    renderer.setAttribute(svgFeTurbulence, 'numOctaves', '2');
    renderer.setAttribute(svgFeTurbulence, 'result', 'NOISE');
    renderer.appendChild(svgFilterEl, svgFeTurbulence);

    const svgDisplacementMap: SVGFEDisplacementMapElement =
      renderer.createElement('feDisplacementMap', SVG_NS);
    renderer.setAttribute(svgDisplacementMap, 'in', 'SourceGraphic');
    renderer.setAttribute(svgDisplacementMap, 'in2', 'NOISE');
    renderer.setAttribute(svgDisplacementMap, 'scale', '20');
    renderer.setAttribute(svgDisplacementMap, 'xChannelSelector', 'R');
    renderer.setAttribute(svgDisplacementMap, 'yChannelSelector', 'R');
    renderer.appendChild(svgFilterEl, svgDisplacementMap);

    return svgFilterEl;
  }

  private generateFilterFive(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    renderer.setAttribute(filterSvgEl, 'id', 'filter5');
    renderer.setAttribute(filterSvgEl, 'filterUnits', 'userSpaceOnUse');

    const feTurbulenceSvgEl: SVGFETurbulenceElement =
      renderer.createElement('feTurbulence', SVG_NS);
      renderer.setAttribute(feTurbulenceSvgEl, 'baseFrequency', '0.7');
    renderer.appendChild(filterSvgEl, feTurbulenceSvgEl);

    const feDisplacementMapSvgEl: SVGFEDisplacementMapElement =
      renderer.createElement('feDisplacementMap', SVG_NS);
    renderer.setAttribute(feDisplacementMapSvgEl, 'in', 'SourceGraphic');
    renderer.setAttribute(feDisplacementMapSvgEl, 'scale', '20');
    renderer.appendChild(filterSvgEl, feDisplacementMapSvgEl);

    return filterSvgEl;
  }

  private generateFilterGreyScale(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    renderer.setAttribute(filterSvgEl, 'id', 'greyscale');

    const feColorMatrixSvgEl: SVGFEColorMatrixElement = renderer.createElement('feColorMatrix', SVG_NS);
    renderer.setAttribute(feColorMatrixSvgEl, 'in', 'SourceGraphic');
    renderer.setAttribute(feColorMatrixSvgEl, 'type', 'matrix');
    renderer.setAttribute(feColorMatrixSvgEl, 'values', '.33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0');
    renderer.appendChild(filterSvgEl, feColorMatrixSvgEl);
    return filterSvgEl;
  }

  private generateFilterSepia(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    renderer.setAttribute(filterSvgEl, 'id', 'sepia');

    const feColorMatrixSvgEl: SVGFEColorMatrixElement = renderer.createElement('feColorMatrix', SVG_NS);
    renderer.setAttribute(feColorMatrixSvgEl, 'in', 'SourceGraphic');
    renderer.setAttribute(feColorMatrixSvgEl, 'type', 'matrix');
    renderer.setAttribute(feColorMatrixSvgEl, 'values', '.35 .35 .35 0 0 .25 .25 .25 0 0 .15 .15 .15 0 0 0 0 0 1 0');
    renderer.appendChild(filterSvgEl, feColorMatrixSvgEl);
    return filterSvgEl;
  }

  private generateFilterInvertion(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    renderer.setAttribute(filterSvgEl, 'id', 'invertion');

    const feColorMatrixSvgEl: SVGFEColorMatrixElement = renderer.createElement('feColorMatrix', SVG_NS);
    renderer.setAttribute(feColorMatrixSvgEl, 'in', 'SourceGraphic');
    renderer.setAttribute(feColorMatrixSvgEl, 'type', 'matrix');
    renderer.setAttribute(feColorMatrixSvgEl, 'values', '-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0');
    renderer.appendChild(filterSvgEl, feColorMatrixSvgEl);
    return filterSvgEl;
  }

  private generateFilterBlackWhite(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    renderer.setAttribute(filterSvgEl, 'id', 'blackWhite');

    const feColorMatrixSvgEl: SVGFEColorMatrixElement = renderer.createElement('feColorMatrix', SVG_NS);
    renderer.setAttribute(feColorMatrixSvgEl, 'type', 'matrix');
    renderer.setAttribute(feColorMatrixSvgEl, 'values', '0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 1 0 ');
    renderer.appendChild(filterSvgEl, feColorMatrixSvgEl);
    return filterSvgEl;
  }

  private generateFilterSaturate(renderer: Renderer2): SVGFilterElement {
    const filterSvgEl: SVGFilterElement = renderer.createElement('filter', SVG_NS);
    renderer.setAttribute(filterSvgEl, 'id', 'saturate');

    const feColorMatrixSvgEl: SVGFEColorMatrixElement = renderer.createElement('feColorMatrix', SVG_NS);
    renderer.setAttribute(feColorMatrixSvgEl, 'in', 'SourceGraphic');
    renderer.setAttribute(feColorMatrixSvgEl, 'type', 'saturate');
    renderer.setAttribute(feColorMatrixSvgEl, 'values', '0.5');
    renderer.appendChild(filterSvgEl, feColorMatrixSvgEl);
    return filterSvgEl;
  }
}
