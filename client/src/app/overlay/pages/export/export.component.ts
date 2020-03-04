
import { AfterViewInit, Component, ElementRef, Optional, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatRadioChange } from '@angular/material';
import { SvgService, SvgShape } from 'src/app/svg/svg.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements AfterViewInit {

  @ViewChild('svgView', {
    static: false
  }) protected svgView: ElementRef<SVGSVGElement>;

  innerSVG: SVGSVGElement;
  svgShape: SvgShape;
  downloadLink: HTMLAnchorElement;
  canvasDownload: HTMLCanvasElement;
  protected form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              @Optional() public dialogRef: MatDialogRef<ExportComponent>,
              private renderer: Renderer2,
              private svgService: SvgService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, (control: FormControl) => {
        const input = (control.value as string).trim();
        return (input.indexOf(' ') === -1 && input !== '') ? null : {
          spaceError: { value: 'No whitespace allowed' }
        };
      }]],
      filter: [FilterChoice.None, [Validators.required]],
      format: [FormatChoice.Png, [Validators.required]]
    });
  }

  protected getFilters(): FilterChoice[] {
    return [
      FilterChoice.None,
      FilterChoice.Blur,
      FilterChoice.BlackWhite,
      FilterChoice.Inverse,
      FilterChoice.Artifice,
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
    this.svgShape = this.svgService.shape;
    this.innerSVG = this.renderer.createElement(
      'svg', 'http://www.w3.org/2000/svg');

    Array.from(this.svgService.structure.defsZone.children)
      .forEach((element: SVGElement) => {
        this.renderer.appendChild(this.innerSVG, element.cloneNode(true)); });

    this.renderer.appendChild(this.innerSVG, this.generateBackground());

    Array.from(this.svgService.structure.drawZone.children)
    .forEach((element: SVGElement) => {
      this.renderer.appendChild(this.innerSVG, element.cloneNode(true)); });

    this.innerSVG.setAttribute('width', this.svgShape.width.toString());
    this.innerSVG.setAttribute('height', this.svgShape.height.toString());
    this.createView(FilterChoice.None);
  }

  serializeSVG(): string {
    return (new XMLSerializer().serializeToString(this.innerSVG));
  }

  convertSVGToBase64(): string {
    return 'data:image/svg+xml;base64,' + btoa(this.serializeSVG());
  }

  convertToBlob(): Blob {
    this.innerSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    return new Blob([this.serializeSVG()], {
      type: 'image/svg+xml;charset=utf-8'
    });
  }

  encodeImage(): SVGImageElement {
    const picture: SVGImageElement = this.renderer.createElement(
      'img', 'http://www.w3.org/2000/svg' );
    picture.setAttribute('width', this.svgShape.width.toString());
    picture.setAttribute('height', this.svgShape.height.toString());
    picture.setAttribute('href', this.convertSVGToBase64());
    return picture;
  }

  downloadFile(canvaRecu: HTMLCanvasElement): void {
    const canvas: HTMLCanvasElement = canvaRecu;
    const downloadLink: HTMLAnchorElement = this.renderer.createElement('a');
    const format = this.form.controls.format.value;
    const url = canvas.toDataURL('image/' + format);
    this.innerSVG.appendChild(downloadLink);
    downloadLink.href = (format === 'svg') ?
      this.convertSVGToBase64() : url;
    const name = this.form.controls.name.value.trim();
    downloadLink.download = name + '.' + format;
    downloadLink.click();
    this.innerSVG.removeChild(downloadLink);
  }

  configureCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
    canvas.height = this.svgShape.height;
    canvas.width = this.svgShape.width;
    return canvas;
  }

  exportSVG(): void {
    const uri = 'data:image/svg+xml,' + encodeURIComponent(this.serializeSVG());
    const downloadLink: HTMLAnchorElement = this.renderer.createElement('a');
    this.innerSVG.appendChild(downloadLink);
    downloadLink.href = uri;
    const name = this.form.controls.name.value.trim();
    const format = this.form.controls.format.value;
    downloadLink.download = name + '.' + format;
    downloadLink.click();
    this.innerSVG.removeChild(downloadLink);
  }

  exportDrawing(): HTMLCanvasElement {
    this.resetInnerSVG();
    const canvas: HTMLCanvasElement = this.configureCanvas();
    const format = this.form.controls.format.value;
    if (format as FormatChoice === FormatChoice.Svg) {
      this.exportSVG();
    } else {
      const ctx = canvas.getContext('2d');
      const URL = self.URL || self;
      const img = new Image();
      const svgBlob = this.convertToBlob();
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          this.downloadFile(canvas);
          URL.revokeObjectURL(url);
        }
      };
      img.src = url;
    }
    return canvas;
  }

  createView(filterName: string): void {
    const picture: SVGImageElement = this.renderer.createElement('image',
      'http://www.w3.org/2000/svg');
    const viewZone = this.svgView.nativeElement;
    this.configurePicture(picture, filterName);
    if (viewZone) {
      const child = viewZone.lastElementChild;
      if (child && (child.getAttribute('id') === 'pictureView')) {
        viewZone.removeChild(child);
      }
      this.renderer.appendChild(viewZone, picture);
    }
  }

  configurePicture(picture: SVGImageElement, filterName: string ): void {
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
      case FilterChoice.Blur:
        filterName = 'url(#saturate)';  // A revoir concordance
        break;
      case FilterChoice.BlackWhite:
        filterName = 'url(#blackWhite)';
        break;
      case FilterChoice.Inverse:
        filterName = 'url(#invertion)';
        break;
      case FilterChoice.Artifice: // a modifier
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
    Array.from(this.svgView.nativeElement.children).forEach(
      (element: SVGElement) => {
        this.renderer.appendChild(this.innerSVG, element.cloneNode(true)); });
    Array.from(this.innerSVG.children).forEach(
      (element: SVGElement) => {
        element.setAttribute('filter', this.chooseFilter(this.form.controls.filter.value.toString())); });
    this.innerSVG.setAttribute('width', String(this.svgShape.width));
    this.innerSVG.setAttribute('height', String(this.svgShape.height));
    const picture = this.innerSVG.getElementById('pictureView');
    if (picture) {
      picture.setAttribute('width', String(this.svgShape.width));
      picture.setAttribute('height', String(this.svgShape.height));
      picture.setAttribute('filter', this.chooseFilter(this.form.controls.filter.value.toString()));
    }
  }

  generateBackground(): SVGRectElement {
    const rect: SVGRectElement = this.renderer.createElement(
      'rect', 'http://www.w3.org/2000/svg');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('height', String(this.svgShape.height));
    rect.setAttribute('width', String(this.svgShape.width));
    rect.setAttribute('fill', this.svgShape.color);
    return rect;
  }
}

enum FilterChoice {
  None = 'Aucun',
  Blur = 'Flou',
  BlackWhite = 'Noir et blanc',
  Inverse = 'Inversion',
  Artifice = 'Artifice',
  Grey = 'Gris épatant'
}

enum FormatChoice {
  Svg = 'SVG',
  Png = 'PNG',
  Jpeg = 'JPEG'
}
