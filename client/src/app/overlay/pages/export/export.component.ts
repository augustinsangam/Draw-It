
import { AfterViewInit, Component, ElementRef, Optional, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatRadioChange } from '@angular/material';
import { SvgService, SvgShape } from 'src/app/svg/svg.service';
import { FilterService } from 'src/app/tool/drawing-instruments/brush/filter.service';

const SVG_NS = 'http://www.w3.org/2000/svg' ;

enum FilterChoice {
  None = 'Aucun',
  Saturate = 'Saturation',
  BlackWhite = 'Noir et blanc',
  Inverse = 'Inversion',
  Sepia = 'Sepia',
  Grey = 'Gris épatant',
}

enum FormatChoice {
  Svg = 'SVG',
  Png = 'PNG',
  Jpeg = 'JPEG',
}

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
// TODO: protected atributes, utilisation du renderer partout, map pour le grand
// switch case
export class ExportComponent implements AfterViewInit {

  @ViewChild('svgView', {
    static: false
  }) protected svgView: ElementRef<SVGSVGElement>;

  innerSVG: SVGSVGElement;
  svgShape: SvgShape;
  pictureView: SVGImageElement;
  protected form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              @Optional() public dialogRef: MatDialogRef<ExportComponent>,
              private renderer: Renderer2,
              private filterService: FilterService,
              private svgService: SvgService
  ) {
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
    this.exportDrawing();
    this.dialogRef.close();
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    const filterZone = this.filterService.generateExportFilters(this.renderer);
    this.renderer.appendChild(this.svgView.nativeElement, filterZone);
    this.initializeElements();
    this.createView(FilterChoice.None);
  }

  initializeElements(): void {
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

  serializeSVG(): string {
    return (new XMLSerializer().serializeToString(this.innerSVG));
  }

  convertSVGToBase64(): string {
    return `data:image/svg+xml;base64,${btoa(this.serializeSVG())}`;
  }

  convertToBlob(): Blob {
    this.innerSVG.setAttribute('xmlns', SVG_NS);
    return new Blob([this.serializeSVG()], {
      type: 'image/svg+xml;charset=utf-8'
    });
  }

  downloadImage(pictureUrl: string): void {
    const downloadLink: HTMLAnchorElement = this.renderer.createElement('a');
    const format = this.form.controls.format.value.toLocaleLowerCase();
    downloadLink.href = pictureUrl;
    const name: string = this.form.controls.name.value.trim().toLocaleLowerCase();
    downloadLink.download = `${name}.${format}`;
    downloadLink.click();
  }

  generateCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
    canvas.height = this.svgShape.height;
    canvas.width = this.svgShape.width;
    return canvas;
  }

  exportSVG(): void {
    const uri = `data:image/svg+xml,${encodeURIComponent(this.serializeSVG())}`;
    this.downloadImage(uri);
  }

  exportDrawing(): HTMLCanvasElement {
    this.resetInnerSVG();
    const canvas: HTMLCanvasElement = this.generateCanvas();
    const format = this.form.controls.format.value;
    if (format as FormatChoice === FormatChoice.Svg) {
      this.exportSVG();
    } else {
      const canvasContext = canvas.getContext('2d');
      const URL = self.URL || self;
      const img = new Image();
      const svgBlob = this.convertToBlob();
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        if (canvasContext) {
          canvasContext.drawImage(img, 0, 0);
          const pictureUrl = canvas.toDataURL(`image/${format}`);
          this.downloadImage(pictureUrl);
          URL.revokeObjectURL(url);
        }
      };
      img.src = url;
    }
    return canvas;
  }

  createView(filterName: string): void {
    this.pictureView = this.renderer.createElement('image', SVG_NS);
    const viewZone = this.svgView.nativeElement;
    this.configurePicture(this.pictureView, filterName);
    if (viewZone) {
      const child = viewZone.lastElementChild;
      if (child && (child.getAttribute('id') === 'pictureView')) {
        viewZone.removeChild(child);
      }
      this.renderer.appendChild(viewZone, this.pictureView);
    }
  }

  configurePicture(picture: SVGImageElement, filterName: string ): void {
    // TODO: Use renderer
    const viewZoneHeigth = Number(this.svgView.nativeElement.getAttribute('height'));
    const viewZoneWidth = Number(this.svgView.nativeElement.getAttribute('width'));

    const factor = Math.max(this.svgShape.height / viewZoneHeigth,
        this.svgShape.width / viewZoneWidth);
    const pictureHeigth = this.svgShape.height / factor;
    const pictureWidth = this.svgShape.width / factor;

    picture.setAttribute('id', 'pictureView');
    picture.setAttribute('href', this.convertSVGToBase64());
    picture.setAttribute('width', pictureWidth.toString());
    picture.setAttribute('height', pictureHeigth.toString());
    picture.setAttribute('filter', this.chooseFilter(filterName));
  }

  chooseFilter(filter: string): string {
    let filterName: string;
    switch (filter) {
      case FilterChoice.None:
        filterName = '';
        break;
      case FilterChoice.Saturate:
        filterName = 'url(#saturate)';
        break;
      case FilterChoice.BlackWhite:
        filterName = 'url(#blackWhite)';
        break;
      case FilterChoice.Inverse:
        filterName = 'url(#invertion)';
        break;
      case FilterChoice.Sepia:
        filterName = 'url(#sepia)';
        break;
      case FilterChoice.Grey:
        filterName = 'url(#greyscale)';
        break;
      default:
        filterName = '';
    }
    return filterName;
  }

  resetInnerSVG(): void {

    // TODO : Use renderer everywhere
    const filterZone: SVGGElement = this.renderer.createElement('g', SVG_NS);
    this.innerSVG.setAttribute('filter', this.chooseFilter(this.form.controls.filter.value.toString()));
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

  configureSize(element: SVGElement, shape: SvgShape): void {
    // TODO : Use renderer
    this.innerSVG.setAttribute('width', String(shape.width));
    this.innerSVG.setAttribute('height', String(shape.height));
  }

  generateBackground(): SVGRectElement {
    const rect: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    // TODO : Use renderer
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('height', String(this.svgShape.height));
    rect.setAttribute('width', String(this.svgShape.width));
    rect.setAttribute('fill', this.svgShape.color);
    return rect;
  }
}
