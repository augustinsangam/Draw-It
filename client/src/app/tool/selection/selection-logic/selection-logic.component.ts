import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { SvgService } from 'src/app/svg/svg.service';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { MultipleSelection } from '../MultipleSelection';
import { Offset } from '../Offset';
import { Point } from '../Point';
import { SelectionReturn } from '../SelectionReturn';
import { SingleSelection } from '../SingleSelection';
import { ElementSelectedType } from './ElementSelectedType';
import { MouseTracking } from './MouseTracking';

type MouseEventCallBack = ($event: MouseEvent) => void;

@Component({
  selector: 'app-selection-logic',
  template: '',
  styleUrls: ['./selection-logic.component.scss']
})
export class SelectionLogicComponent
  extends ToolLogicDirective implements OnDestroy {

  private rectangles: {
    selection: ElementRef<SVGElement>,
    inversion: ElementRef<SVGElement>
  }
  private actualRectangle: ElementRef<SVGElement>;
  private circles: ElementRef<SVGElement>[];
  private allListenners: (() => void)[];
  private selectedElements: Set<SVGElement>;
  private mouse: {
    left: MouseTracking,
    right: MouseTracking
  };

  constructor(private renderer: Renderer2, private svgService: SvgService) {
    super();
    this.allListenners = [];
    this.selectedElements = new Set();
  }

  private handlers = new Map<string, Map<string, MouseEventCallBack>>([
    ['leftButton', new Map<string, MouseEventCallBack>([
      ['mousedown', ($event: MouseEvent) => {
        if ($event.button === 0) {
          this.mouse.left.startPoint =
            new Point($event.offsetX, $event.offsetY);
          this.mouse.left.currentPoint = new Point( $event.offsetX,
                                                    $event.offsetY);
          this.mouse.left.mouseIsDown = true;
          this.actualRectangle = this.rectangles.selection;
          this.mouse.left.selectedElement = this.elementSelectedType(
            $event.target as SVGElement
          );
          this.mouse.left.onDrag =
            this.isInTheSelectionZone($event.offsetX, $event.offsetY);
        }
      }],
      ['mousemove', ($event: MouseEvent) => {
        if (this.mouse.left.mouseIsDown) {
          if (this.mouse.left.onDrag) {
            const offsetX = $event.offsetX - this.mouse.left.currentPoint.x;
            const offsetY = $event.offsetY - this.mouse.left.currentPoint.y;
            this.mouse.left.currentPoint = new Point( $event.offsetX,
                                                      $event.offsetY);
            this.translateAll(offsetX, offsetY);
          } else {
            this.mouse.left.currentPoint = new Point( $event.offsetX,
                                                      $event.offsetY);
            this.drawSelection( this.mouse.left.startPoint,
                                this.mouse.left.currentPoint);
          }
        }
      }],
      ['mouseup', ($event: MouseEvent) => {
        if ($event.button === 0) {
          this.mouse.left.endPoint = new Point($event.offsetX, $event.offsetY);
          this.mouse.left.mouseIsDown = false;
          if (!this.mouse.left.onDrag) {
            // S'il s'agit d'un vrai déplacement
            if (!this.mouse.left.startPoint.equals(this.mouse.left.endPoint)) {
              const [startPoint, endPoint] = this.orderPoint(
                this.mouse.left.startPoint, this.mouse.left.endPoint
              );
              this.deleteSelection();
              this.applyMultipleSelection(startPoint, endPoint);
            }
          }
        }
      }],
      ['click', ($event: MouseEvent) => {
        if ($event.button === 0) {
          const type = this.elementSelectedType($event.target as SVGElement);
          // On s'assure d'avoir un vrai click
          if (this.mouse.left.startPoint.equals(this.mouse.left.endPoint)) {
            if (type === ElementSelectedType.DRAW_ELEMENT) {
              this.applySingleSelection($event.target as SVGElement);
            } else if (type === ElementSelectedType.NOTHING) {
              this.deleteSelection();
              this.selectedElements.clear();
            }
          }
        }
      }]
    ])],
    ['rightButton', new Map<string, MouseEventCallBack>([
      ['mousedown', ($event: MouseEvent) => {
        if ($event.button === 2) {
          this.mouse.right.startPoint =
            new Point($event.offsetX, $event.offsetY);
          this.mouse.right.currentPoint =
            new Point($event.offsetX, $event.offsetY);
          this.mouse.right.mouseIsDown = true;
          this.actualRectangle = this.rectangles.inversion;
          this.mouse.right.selectedElement = this.elementSelectedType(
            $event.target as SVGElement
          );
        }
      }],
      ['mousemove', ($event: MouseEvent) => {
        if (this.mouse.right.mouseIsDown) {
          if (this.mouse.right.mouseIsDown) {
              this.mouse.right.currentPoint =
                new Point($event.offsetX, $event.offsetY);
              this.drawInversion( this.mouse.right.startPoint,
                                  this.mouse.right.currentPoint);
          }
        }
      }],
      ['mouseup', ($event: MouseEvent) => {
        if ($event.button === 2) {
          this.mouse.right.endPoint = new Point($event.offsetX, $event.offsetY);
          this.mouse.right.mouseIsDown = false;
          if (!this.mouse.right.startPoint.equals(this.mouse.right.endPoint)) {
            const [startPoint, endPoint] = this.orderPoint(
              this.mouse.right.startPoint, this.mouse.right.endPoint
            );
            this.deleteInversion();
            this.applyMultipleInversion(startPoint, endPoint);
          }
        }
      }],
      ['contextmenu', ($event: MouseEvent) => {
        $event.preventDefault();
        $event.stopImmediatePropagation();
        // On s'assure d'avoir un vrai click
        if (this.mouse.right.startPoint.equals(this.mouse.right.endPoint)) {
          const type = this.elementSelectedType($event.target as SVGElement);
          if (type === ElementSelectedType.DRAW_ELEMENT) {
            this.applySingleInversion($event.target as SVGElement);
          };
        }
      }]
    ])],
  ]);

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    const fakePoint = new Point(0, 0);
    this.mouse = {
      left : {
        startPoint: fakePoint, currentPoint: fakePoint, endPoint: fakePoint,
        mouseIsDown: false, selectedElement: ElementSelectedType.NOTHING,
        onDrag: false
      },
      right: {
          startPoint: fakePoint, currentPoint: fakePoint, endPoint: fakePoint,
          mouseIsDown: false, selectedElement: ElementSelectedType.NOTHING,
          onDrag: false
      }
    };

    this.renderer.setStyle(this.svgElRef.nativeElement, 'cursor', 'default');

    [['leftButton', ['mousedown', 'mousemove', 'mouseup', 'click']],
      ['rightButton', ['mousedown', 'mousemove', 'mouseup', 'contextmenu']]]
    .forEach((side: [string, string[]]) => {
      side[1].forEach((eventName: string) => {
        this.allListenners.push(
          this.renderer.listen(this.svgElRef.nativeElement, eventName,
            (this.handlers.get(side[0]) as Map<string, MouseEventCallBack>)
            .get(eventName) as MouseEventCallBack)
        );
      });
    });

    this.rectangles = {
      selection:
        new ElementRef(this.renderer.createElement('rect', this.svgNS)),
      inversion:
        new ElementRef(this.renderer.createElement('rect', this.svgNS))
    };

    this.renderer.appendChild(this.svgElRef.nativeElement,
      this.rectangles.selection.nativeElement);
    this.renderer.appendChild(this.svgElRef.nativeElement,
        this.rectangles.inversion.nativeElement);

    this.circles = [];
    [0, 1, 2, 3].forEach((index) => {
      const circle = this.renderer.createElement('circle', this.svgNS);
      const resizeType = index % 2 === 0 ? 'col-resize' : 'ns-resize';
      this.renderer.setStyle(circle, 'cursor', resizeType);
      this.circles.push(new ElementRef(circle));
      this.renderer.appendChild(this.svgElRef.nativeElement, circle);
    });

    const subscription = this.svgService.selectAllElements.subscribe(() => {
      const [startPoint, endPoint] = this.orderPoint(new Point(0, 0),
        new Point(this.svgService.instance.nativeElement.clientWidth,
          this.svgService.instance.nativeElement.clientHeight)
      );
      this.applyMultipleSelection(startPoint, endPoint);
    });
    this.allListenners.push(() => subscription.unsubscribe());
  }

  private applySingleSelection(element: SVGElement): void {
    this.selectedElements.clear();
    this.selectedElements.add(element);
    const points = new SingleSelection(element, this.getSvgOffset()).points();
    this.drawSelection(points[0], points[1]);
    this.drawCircles(points[0], points[1]);
  }

  private applySingleInversion(element: SVGElement) {
    this.applyInversion(new Set([element]));
  }

  private applyMultipleInversion(startPoint: Point, endPoint: Point) {
    const inversion = this.getMultipleSelection(startPoint, endPoint);
    this.applyInversion(inversion.selectedElements);
  }

  private applyMultipleSelection(startPoint: Point, endPoint: Point,
                                 elements?: Set<SVGElement>) {
    const selection = this.getMultipleSelection(startPoint, endPoint, elements);
    this.selectedElements = selection.selectedElements;
    this.drawSelection(selection.points[0], selection.points[1]);
    this.drawCircles(selection.points[0], selection.points[1]);
  }

  private getMultipleSelection( startPoint: Point, endPoint: Point,
                                elements?: Set<SVGElement>)
  : SelectionReturn {
    if (elements === undefined) {
      const allElements = Array.from(
        this.svgElRef.nativeElement.children
        ) as SVGElement[];
      // On enlève les deux rectangles et les les 4 points
      elements = new Set<SVGElement>(allElements.slice(0, -6));
    }
    const multipleSelection = new MultipleSelection(
      elements,
      startPoint, endPoint,
      this.getSvgOffset(),
      (this.svgElRef.nativeElement as SVGSVGElement).createSVGPoint());
    return multipleSelection.getSelection();
  }

  private applyInversion( elements: Set<SVGElement>,
                          startPoint?: Point, endPoint?: Point): void {
    const elementsToSelect = new Set<SVGElement>(this.selectedElements);
    elements.forEach((element: SVGElement) => {
      if (this.selectedElements.has(element)) {
        elementsToSelect.delete(element);
        console.log('On enlève de la selection');
      } else {
        elementsToSelect.add(element);
        console.log('On ajoute dans la selection');
      }
    });
    if (startPoint === undefined || endPoint === undefined) {
      [startPoint, endPoint] = this.orderPoint(new Point(0, 0),
          new Point(this.svgService.instance.nativeElement.clientWidth,
            this.svgService.instance.nativeElement.clientHeight)
        );
    }
    this.applyMultipleSelection(startPoint, endPoint, elementsToSelect);
  }

  private orderPoint(p1: Point, p2: Point): [Point, Point] {
    return [
      new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
      new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y))
    ];
  }

  private drawSelection(p1: Point, p2: Point) {
    this.deleteSelection();
    const rec = this.rectangles.selection.nativeElement;
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    rec.setAttribute('x', startPoint.x.toString());
    rec.setAttribute('y', startPoint.y.toString());
    rec.setAttribute('width', (endPoint.x - startPoint.x).toString());
    rec.setAttribute('height', (endPoint.y - startPoint.y).toString());
    rec.setAttribute('fill', 'none');
    rec.setAttribute('stroke', 'rgba(128, 128, 128, 0.7)');
    rec.setAttribute('stroke-width', '2');
    rec.setAttribute('stroke-dasharray', '10 5');
  }

  private drawInversion(p1: Point, p2: Point) {
    this.deleteInversion();
    const rec = this.rectangles.inversion.nativeElement;
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    rec.setAttribute('x', startPoint.x.toString());
    rec.setAttribute('y', startPoint.y.toString());
    rec.setAttribute('width', (endPoint.x - startPoint.x).toString());
    rec.setAttribute('height', (endPoint.y - startPoint.y).toString());
    rec.setAttribute('fill', 'none');
    rec.setAttribute('stroke', 'rgba(255, 0, 0, 0.7)');
    rec.setAttribute('stroke-width', '2');
    rec.setAttribute('stroke-dasharray', '10 5');
  }

  drawCircles(p1: Point, p2: Point): void {
    const [startPoint, endPoint] = this.orderPoint(p1, p2);
    const centerPoint = new Point(
      (startPoint.x + endPoint.x) / 2,
      (startPoint.y + endPoint.y) / 2);
    this.setCircle(new Point(startPoint.x, centerPoint.y),
      this.circles[0].nativeElement, '8', 'rgba(128, 128, 255, 1)');
    this.setCircle(new Point(centerPoint.x, startPoint.y),
      this.circles[1].nativeElement, '8', 'rgba(128, 128, 255, 1)');
    this.setCircle(new Point(endPoint.x, centerPoint.y),
      this.circles[2].nativeElement, '8', 'rgba(128, 128, 255, 1)');
    this.setCircle(new Point(centerPoint.x, endPoint.y),
      this.circles[3].nativeElement, '8', 'rgba(128, 128, 255, 1)');
  }

  setCircle(center: Point, circle: SVGElement,
            radius: string, color: string) {
    this.renderer.setAttribute(circle, 'cx'   , center.x.toString());
    this.renderer.setAttribute(circle, 'cy'   , center.y.toString());
    this.renderer.setAttribute(circle, 'r'    , radius);
    this.renderer.setAttribute(circle, 'fill' , color);
  }

  private deleteSelection(): void {
    this.rectangles.selection.nativeElement.setAttribute('width', '0');
    this.rectangles.selection.nativeElement.setAttribute('height', '0');
    this.rectangles.selection.nativeElement.setAttribute( 'transform',
                                                          'translate(0,0)');
    this.circles.forEach(element => {
      this.setCircle(new Point(0, 0),
      element.nativeElement, '0', 'rgba(255, 255, 255, 0.0)');
      element.nativeElement.setAttribute('transform', 'translate(0,0)');
    });
  }

  private deleteInversion(): void {
    this.rectangles.inversion.nativeElement.setAttribute('width', '0');
    this.rectangles.inversion.nativeElement.setAttribute('height', '0');
    this.rectangles.inversion.nativeElement.setAttribute( 'transform',
                                                          'translate(0,0)');
  }

  private elementSelectedType(element: SVGElement)
    : ElementSelectedType {
    switch (element) {
      case this.circles[0].nativeElement:
        return ElementSelectedType.LEFT_CIRCLE;
      case this.circles[1].nativeElement:
        return ElementSelectedType.TOP_CIRCLE;
      case this.circles[2].nativeElement:
        return ElementSelectedType.RIGHT_CIRCLE;
      case this.circles[3].nativeElement:
        return ElementSelectedType.BOTTOM_CIRCLE;
      case this.svgElRef.nativeElement:
        return ElementSelectedType.NOTHING;
      case this.rectangles.selection.nativeElement:
        return ElementSelectedType.SELECTION_RECTANGLE;
      case this.rectangles.selection.nativeElement:
        return ElementSelectedType.INVERSION_RECTANGLE;
      default:
        return ElementSelectedType.DRAW_ELEMENT;
    }
  }

  private isInTheSelectionZone(x: number, y: number)
  : boolean {
    const point = this.svgElRef.nativeElement.createSVGPoint();
    const [dx, dy] =
      this.getTransformTranslate(this.actualRectangle.nativeElement);
    [point.x, point.y] = [x - dx, y - dy];
    return (this.actualRectangle.nativeElement as SVGGeometryElement)
          .isPointInFill(point);
  }

  translateAll(x: number, y: number) {
    this.selectedElements.forEach(element => {
      this.translate(element, x, y);
    });
    this.translate(this.rectangles.selection.nativeElement, x, y);
    this.circles.forEach(
      (circle) => this.translate(circle.nativeElement, x, y)
    );
  }

  translate(element: SVGElement, x: number, y: number): void {
    let [dx, dy] = this.getTransformTranslate(element);
    [dx, dy] = [x + dx, y + dy];
    element.setAttribute('transform', `translate(${dx},${dy})`);
  }

  private getTransformTranslate(element: SVGElement): [number, number] {
    const transform = element.getAttribute('transform') as string;
    const result  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform);
    return (result !== null) ?
      [parseInt(result[1], 10), parseInt(result[2], 10)] : [0, 0];
  }

  getSvgOffset(): Offset {
    const svgBoundingRect = this.svgElRef.nativeElement.getBoundingClientRect();
    return { top: svgBoundingRect.top, left: svgBoundingRect.left };
  }

  ngOnDestroy() {
    this.allListenners.forEach(end => end());
    this.renderer.removeChild(this.svgElRef.nativeElement,
      this.rectangles.selection.nativeElement);
    this.renderer.removeChild(this.svgElRef.nativeElement,
        this.rectangles.inversion.nativeElement);
    this.circles.forEach((circle) => this.renderer.removeChild(
      this.svgElRef.nativeElement, circle.nativeElement)
    );
  }

}
