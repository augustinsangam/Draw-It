import { Renderer2 } from '@angular/core';

export class Transform {

  static translate(element: SVGElement,
                   x: number,
                   y: number,
                   renderer: Renderer2
  ): void {
    let [dx, dy] = this.getTransformTranslate(element);
    [dx, dy] = [x + dx, y + dy];
    renderer.setAttribute(element, 'transform', `translate(${dx},${dy})`);
  }

  static getTransformTranslate(element: SVGElement): [number, number] {
    const transform = element.getAttribute('transform') as string;
    const result = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform);
    return (result !== null) ?
      [parseInt(result[1], 10), parseInt(result[2], 10)] : [0, 0];
  }

  static translateAll(elements: Iterable<SVGElement>,
                      x: number,
                      y: number,
                      renderer: Renderer2
  ): void {
    for (const element of elements) {
      this.translate(element, x, y, renderer);
    }
  }

}
