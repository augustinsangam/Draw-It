import { Component, ElementRef, OnInit,
  Optional, Renderer2, ViewChild } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup, Validators
} from '@angular/forms';
import { MatDialogRef, MatRadioChange } from '@angular/material';
import { SvgService, SvgShape } from 'src/app/svg/svg.service';
// import { ColorService } from 'src/app/tool/color/color.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  @ViewChild('svgView', { static: false })
  protected svgView: ElementRef<SVGSVGElement>;
  /////////////////////
  innerSVG: SVGSVGElement;
  // svgShape: DOMRect | ClientRect;
  svgShape: SvgShape;
  downloadLink: HTMLAnchorElement;
  canvasDownload: HTMLCanvasElement;
  img: HTMLImageElement;
  name: string;
  format: string;

  ////////////////////
  protected form: FormGroup;

  protected filters = [
    FilterChoice.None,
    FilterChoice.Blur,
    FilterChoice.BlackWhite,
    FilterChoice.Inverse,
    FilterChoice.Artifice,
    FilterChoice.Grey
  ];

  protected formats = [
    FormatChoice.Svg,
    FormatChoice.Png,
    FormatChoice.Jpeg
  ]

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

  protected onOptionChange($change: MatRadioChange) {
    this.createView(String($change.value));
    console.log($change);
  }

  protected onConfirm() {
    console.log('On confirme');
    this.name = this.form.controls.name.value;
    this.format = (this.form.controls.format.value).toLocaleLowerCase();
    this.exportDrawing();
    this.dialogRef.close();
  }

  protected onCancel() {
    console.log('On cancel');
    this.dialogRef.close();
  }

  ngOnInit() {
    this.svgShape = this.svgService.shape;
    this.innerSVG = this.renderer.createElement(
      'svg', 'http://www.w3.org/2000/svg');
    this.renderer.appendChild(this.innerSVG, this.generateBackground());
    Array.from(this.svgService.structure.drawZone.children)
    .forEach((element: SVGElement) => {
      this.renderer.appendChild(this.innerSVG, element.cloneNode(true))});
    this.innerSVG.setAttribute('width', this.svgShape.width.toString());
    this.innerSVG.setAttribute('height', this.svgShape.height.toString());
  }

  ngAfterViewInit() {
    this.createView(FilterChoice.None);
  }

  serializeSVG(): string {
    return (new XMLSerializer().serializeToString(this.innerSVG));
  }

  // Encodage des données binaire comme executable ou image utilité base64
  convertSVGToBase64(): string {
    // entete de base64 pour image
    return 'data:image/svg+xml;base64,' + btoa(this.serializeSVG());
  }

  convertToBlob(): Blob {
    this.innerSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    return new Blob([this.serializeSVG()], {
      type: 'image/svg+xml;charset=utf-8'
    });
  }

  encodeImage(): SVGImageElement {
    // const picture: HTMLImageElement = this.renderer.createElement('img');
    // picture.width = this.svgShape.width;
    // picture.height = this.svgShape.height;
    // picture.src = this.convertSVGToBase64();
    // return picture;
    const picture: SVGImageElement = this.renderer.createElement(
      'img', 'http://www.w3.org/2000/svg' );
    picture.setAttribute('width', this.svgShape.width.toString());
    picture.setAttribute('height', this.svgShape.height.toString());
    picture.setAttribute('href', this.convertSVGToBase64());
    return picture;
  }

  downloadFile(canvaRecu: HTMLCanvasElement) {
    const canvas: HTMLCanvasElement = canvaRecu;
    const downloadLink: HTMLAnchorElement = this.renderer.createElement('a');
    const url = canvas.toDataURL('image/' + this.format);
    this.innerSVG.appendChild(downloadLink);
    downloadLink.href = (this.format === 'svg') ?
      this.convertSVGToBase64() : url;
    downloadLink.download = this.name + '.' + this.format;
    downloadLink.click();
    this.innerSVG.removeChild(downloadLink);
  }

  configureCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
    canvas.height = this.svgShape.height;
    canvas.width = this.svgShape.width;
    return canvas;
  }

  exportSVG() {

    const uri = 'data:image/svg+xml,' + encodeURIComponent(this.serializeSVG());
    const downloadLink: HTMLAnchorElement = this.renderer.createElement('a');
    this.innerSVG.appendChild(downloadLink);
    downloadLink.href = uri;
    downloadLink.download = this.name + '.' + this.format;
    downloadLink.click();
    this.innerSVG.removeChild(downloadLink);
  }

  exportDrawing(): HTMLCanvasElement {
    this.resetInnerSVG();
    const canvas: HTMLCanvasElement = this.configureCanvas();
    if (this.format === 'svg') {
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
      }
      img.src = url;
    }
    return canvas;
  }

  createView(filterName: string) {
    const picture: SVGImageElement = this.renderer.createElement('image',
      'http://www.w3.org/2000/svg');
    // const viewZone = document.getElementById('picture-view-zone');
    const viewZone = this.svgView.nativeElement;
    if (viewZone) {
      const viewZoneHeigth = Number(viewZone.getAttribute('height'));
      const viewZoneWidth = Number(viewZone.getAttribute('width'));

      const factor = Math.max(this.svgShape.height / viewZoneHeigth,
        this.svgShape.width / viewZoneWidth);
      console.log('heigth ' + this.svgShape.height + ' / ' + viewZoneHeigth);
      console.log('resultat ' + this.svgShape.height / viewZoneHeigth);
      console.log('width ' + this.svgShape.width + ' / ' + viewZoneWidth);
      console.log('resultat ' + this.svgShape.width / viewZoneWidth);
      console.log('factor ' + factor);

      const pictureHeigth = this.svgShape.height / factor;
      const pictureWidth = this.svgShape.width / factor;

      picture.setAttribute('id', 'pictureView');
      picture.setAttribute('href', this.convertSVGToBase64());
      picture.setAttribute('width', pictureWidth.toString());
      picture.setAttribute('height', pictureHeigth.toString());
      picture.setAttribute('filter', this.chooseFilter(filterName));
      const child = viewZone.lastElementChild;
      if (child && (child.getAttribute('id') === 'pictureView')) {
        viewZone.removeChild(child);
      }
      this.renderer.appendChild(viewZone, picture);
    }
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

  resetInnerSVG() {
    // this.innerSVG = (document.getElementById(
    //   'picture-view-zone'
    //   ) as unknown as SVGSVGElement);
    // this.innerSVG = this.svgView.nativeElement ;
    Array.from(this.svgView.nativeElement.children).forEach(
      (element: SVGElement) => {
      this.renderer.appendChild(this.innerSVG, element.cloneNode(true))});
    this.innerSVG.setAttribute('width', String(this.svgShape.width));
    this.innerSVG.setAttribute('height', String(this.svgShape.height));
    console.log('ele ' + this.svgShape.width + ' ' + this.svgShape.height );
    const picture = this.innerSVG.getElementById('pictureView');
    if (picture) {
      picture.setAttribute('width', String(this.svgShape.width));
      picture.setAttribute('height', String(this.svgShape.height));
      console.log('pict ' + picture.getAttribute('href'));
      console.log('icicici');
    }
    console.log('fin reset');
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
