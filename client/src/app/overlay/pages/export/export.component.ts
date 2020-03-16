
import { AfterViewInit, Component, ElementRef, Optional, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatRadioChange } from '@angular/material';
import { SvgShape } from 'src/app/svg/svg-shape';
import { SvgService } from 'src/app/svg/svg.service';
import { FilterService } from 'src/app/tool/drawing-instruments/brush/filter.service';

const SVG_NS = 'http://www.w3.org/2000/svg' ;

export enum FilterChoice {
  None = 'Aucun',
  Saturate = 'Saturation',
  BlackWhite = 'Noir et blanc',
  Inverse = 'Inversion',
  Sepia = 'Sepia',
  Grey = 'Gris épatant',
}

export enum FormatChoice {
  Svg = 'SVG',
  Png = 'PNG',
  Jpeg = 'JPEG',
}

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})

export class ExportComponent implements AfterViewInit {

  @ViewChild('svgView', {
    static: false
  }) protected svgView: ElementRef<SVGSVGElement>;

  protected innerSVG: SVGSVGElement;
  protected svgShape: SvgShape;
  protected pictureView: SVGImageElement;
  private filtersChooser: Map<string, string>;
  protected form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              @Optional() public dialogRef: MatDialogRef<ExportComponent>,
              private renderer: Renderer2,
              private filterService: FilterService,
              private svgService: SvgService
  ) {

    this.filtersChooser = new Map<string, string>();
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, (control: FormControl) => {
        const input = (control.value as string).trim();
        const NOT_FOUND = -1;
        if (input.indexOf(' ') === NOT_FOUND && input !== '') {
          return null;
        }
        return {spaceError: { value: 'No whitespace allowed' }};
      }]],
      filter: [FilterChoice.None, [Validators.required]],
      format: [FormatChoice.Png, [Validators.required]]
    });
  }

  protected getFilters(): FilterChoice[] {
    return [
      FilterChoice.None,
      FilterChoice.Saturate,
      FilterChoice.BlackWhite,
      FilterChoice.Inverse,
      FilterChoice.Sepia,
      FilterChoice.Grey
    ];
  }

  protected getFormats(): FormatChoice[] {
    return [
      FormatChoice.Svg,
      FormatChoice.Png,
      FormatChoice.Jpeg
    ];
  }

  protected onOptionChange($change: MatRadioChange): void {
    this.createView(String($change.value));
  }

  protected onConfirm(): void {
    this.exportDrawing(this.form.controls.format.value);
    this.dialogRef.close();
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    const filterZone = this.filterService.generateExportFilters(this.renderer);
    this.renderer.appendChild(this.svgView.nativeElement, filterZone);
    this.initializeElements();
    this.initializeFiltersChooser();
    this.createView(FilterChoice.None);
  }

  private initializeFiltersChooser(): void {
    this.filtersChooser.set(FilterChoice.None, '');
    this.filtersChooser.set(FilterChoice.Saturate, 'url(#saturate)');
    this.filtersChooser.set( FilterChoice.BlackWhite, 'url(#blackWhite)' );
    this.filtersChooser.set(FilterChoice.Sepia, 'url(#sepia)');
    this.filtersChooser.set(FilterChoice.Inverse , 'url(#invertion)');
    this.filtersChooser.set(FilterChoice.Grey, 'url(#greyscale)');
  }

  private initializeElements(): void {
    this.svgShape = this.svgService.shape;
    this.innerSVG = this.renderer.createElement('svg', SVG_NS);
    Array.from(this.svgService.structure.defsZone.children)
    .forEach((element: SVGElement) => {
      this.renderer.appendChild(this.innerSVG, element.cloneNode(true));
    });
    this.renderer.appendChild(this.innerSVG, this.generateBackground());
    Array.from(this.svgService.structure.drawZone.children)
      .forEach((element: SVGElement) => {
        this.renderer.appendChild(this.innerSVG, element.cloneNode(true));
    });
    this.renderer.setAttribute(this.innerSVG, 'width', this.svgShape.width.toString());
    this.renderer.setAttribute(this.innerSVG, 'height', this.svgShape.height.toString());
  }

  private serializeSVG(): string {
    return (new XMLSerializer().serializeToString(this.innerSVG));
  }

  private convertSVGToBase64(): string {
    return `data:image/svg+xml;base64,${btoa(this.serializeSVG())}`;
  }

  private convertToBlob(): Blob {
    this.innerSVG.setAttribute('xmlns', SVG_NS);
    return new Blob([this.serializeSVG()], {type: 'image/svg+xml;charset=utf-8'});
  }

  private downloadImage(pictureUrl: string): void {
    const downloadLink: HTMLAnchorElement = this.renderer.createElement('a');
    const format = this.form.controls.format.value.toLocaleLowerCase();
    downloadLink.href = pictureUrl;
    const name: string = this.form.controls.name.value.trim().toLocaleLowerCase();
    downloadLink.download = `${name}.${format}`;
    downloadLink.click();
  }

  private generateCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
    canvas.height = this.svgShape.height;
    canvas.width = this.svgShape.width;
    return canvas;
  }

  private exportSVG(): void {
    const uri = `data:image/svg+xml,${encodeURIComponent(this.serializeSVG())}`;
    this.downloadImage(uri);
  }

  private exportDrawing(format: FormatChoice): void {
    this.resetInnerSVG();
    const canvas: HTMLCanvasElement = this.generateCanvas();
    if (format as FormatChoice === FormatChoice.Svg) {
      this.exportSVG();
    } else {
      const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
      const URL = self.URL || self;
      const img: HTMLImageElement = this.renderer.createElement('img');
      const svgBlob = this.convertToBlob();
      const url = URL.createObjectURL(svgBlob);
      this.renderer.setAttribute(img, 'src', url);
      img.onload = () => {
        canvasContext.drawImage(img, 0, 0);
        const pictureUrl = canvas.toDataURL(`image/${format}`);
        this.downloadImage(pictureUrl);
        URL.revokeObjectURL(url);
      };
    }
  }

  private createView(filterName: string): void {
    this.pictureView = this.renderer.createElement('image', SVG_NS);
    const viewZone = this.svgView.nativeElement;
    this.configurePicture(this.pictureView, filterName);
    const child = viewZone.lastElementChild;
    if (child && (child.getAttribute('id') === 'pictureView')) {
      viewZone.removeChild(child);
    }
    this.renderer.appendChild(viewZone, this.pictureView);

  }

  private configurePicture(picture: SVGImageElement, filterName: string ): void {
    const viewZoneHeigth = Number(this.svgView.nativeElement.getAttribute('height'));
    const viewZoneWidth = Number(this.svgView.nativeElement.getAttribute('width'));

    const factor = Math.max(this.svgShape.height / viewZoneHeigth,
        this.svgShape.width / viewZoneWidth);
    const pictureHeigth = this.svgShape.height / factor;
    const pictureWidth = this.svgShape.width / factor;

    this.renderer.setAttribute(picture, 'id', 'pictureView');
    this.renderer.setAttribute(picture, 'href', this.convertSVGToBase64());
    this.renderer.setAttribute(picture, 'width', pictureWidth.toString());
    this.renderer.setAttribute(picture, 'height', pictureHeigth.toString());
    const filter = this.filtersChooser.get(this.form.controls.filter.value.toString()) as string;
    picture.setAttribute('filter', filter);
  }

  private resetInnerSVG(): void {
    const filterZone: SVGGElement = this.renderer.createElement('g', SVG_NS);
    const filter = this.filtersChooser.get(this.form.controls.filter.value.toString()) as string;
    this.renderer.setAttribute(this.innerSVG, 'filter', filter);
    this.configureSize(filterZone, this.svgShape);
    this.renderer.removeChild(this.svgView, this.pictureView);
    Array.from(this.svgView.nativeElement.children).forEach((element: SVGElement) => {
        if (element !== this.pictureView) {
          this.renderer.appendChild(filterZone, element.cloneNode(true));
        }
    });
    this.configureSize(this.innerSVG, this.svgShape);
    this.renderer.appendChild(this.innerSVG, filterZone);
  }

  private configureSize(element: SVGElement, shape: SvgShape): void {
    this.renderer.setAttribute(element, 'width', String(shape.width));
    this.renderer.setAttribute(element, 'height', String(shape.height));
  }

  private generateBackground(): SVGRectElement {
    const rect: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    this.renderer.setAttribute(rect, 'y', '0');
    this.renderer.setAttribute(rect, 'x', '0');
    this.renderer.setAttribute(rect, 'height', String(this.svgShape.height));
    this.renderer.setAttribute(rect, 'width', String(this.svgShape.width));
    this.renderer.setAttribute(rect, 'fill', this.svgShape.color);
    return rect;
  }
}
