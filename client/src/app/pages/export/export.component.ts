import { Component, OnInit, Optional, Renderer2 } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup, Validators
} from '@angular/forms';
import { MatDialogRef, MatRadioChange } from '@angular/material';
import { SvgService } from 'src/app/svg/svg.service';
// import { ColorService } from 'src/app/tool/color/color.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  /////////////////////
  innerSVG: SVGSVGElement;
  svgDimension: DOMRect | ClientRect;
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
              private svgElementService: SvgService,
    // private colorService: ColorService
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
    this.innerSVG = this.svgElementService.structure.root;
    // const drawing = this.svgElementService.structure.root;
    // this.innerSVG = drawing.cloneNode(true) as SVGSVGElement;
    this.svgDimension = this.innerSVG.getBoundingClientRect() as DOMRect;
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

  encodeImage(): HTMLImageElement {
    const picture: HTMLImageElement = this.renderer.createElement('img');
    picture.width = this.svgDimension.width;
    picture.height = this.svgDimension.height;
    picture.src = this.convertSVGToBase64();
    return picture;
  }

  downloadFile(canvaRecu: HTMLCanvasElement) {

    // ensuite recupérons le canvas dans le navigateur
    const canvas: HTMLCanvasElement = canvaRecu;
    // création de l'ancre pour le telechargement
    const downloadLink: HTMLAnchorElement = this.renderer.createElement('a');

    // recuperons l'url du canvas par defaut c'est png
    const url = canvas.toDataURL('image/' + this.format);
    // l'ajout et la suppression ne sont pas obligé pour chrome
    this.innerSVG.appendChild(downloadLink);

    // Ajout de l'url du canvas dans href
    downloadLink.href = (this.format === 'svg') ?
      this.convertSVGToBase64() : url;

    // download reprsente le nom de l'image à telecharger
    downloadLink.download = this.name + '.' + this.format;

    // simulation du click
    downloadLink.click();

    this.innerSVG.removeChild(downloadLink);
  }

  configureCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
    canvas.height = this.svgDimension.height;
    canvas.width = this.svgDimension.width;
    return canvas;
  }

  exportSVG() {
    // const backColor: string = this.colorService.backgroundColor;
    // const rect: SVGRectElement = this.renderer.createElement('rect');
    // rect.setAttribute('x', '0');
    // rect.setAttribute('y', '0');
    // rect.setAttribute('height', String(this.svgDimension.height));
    // rect.setAttribute('width', String(this.svgDimension.width));
    // rect.setAttribute('fill', backColor);

    const uri = 'data:image/svg+xml,' + encodeURIComponent(this.serializeSVG());
    const downloadLink: HTMLAnchorElement = this.renderer.createElement('a');

    // l'ajout et la suppression ne sont pas obligé pour chrome
    this.innerSVG.appendChild(downloadLink);

    // Ajout de l'url du canvas dans href
    downloadLink.href = uri;

    // download reprsente le nom de l'image à telecharger
    downloadLink.download = this.name + '.' + this.format;

    // simulation du click
    downloadLink.click();

    this.innerSVG.removeChild(downloadLink);
  }

  exportDrawing(): HTMLCanvasElement {
    this.resetInnerSVG();
    const canvas: HTMLCanvasElement = this.configureCanvas();
    if (this.format === 'svg') { // Test juste du if
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
    const viewZone = document.getElementById('picture-view-zone');
    if (viewZone) {
      const viewZoneHeigth = Number(viewZone.getAttribute('height'));
      const viewZoneWidth = Number(viewZone.getAttribute('width'));

      const factor = Math.max((this.svgDimension.height / viewZoneHeigth), (this.svgDimension.width / viewZoneWidth));
      console.log('heigth ' + this.svgDimension.height + ' / ' + viewZoneHeigth);
      console.log('resultat ' + this.svgDimension.height / viewZoneHeigth);
      console.log('width ' + this.svgDimension.width + ' / ' + viewZoneWidth);
      console.log('resultat ' + this.svgDimension.width / viewZoneWidth);
      console.log('factor ' + factor);

      const pictureHeigth = this.svgDimension.height / factor;
      const pictureWidth = this.svgDimension.width / factor;

      // this.innerSVG.setAttribute('width', pictureWidth.toString());
      // this.innerSVG.setAttribute('height', pictureHeigth.toString());
      // const factor = Math.max( viewZoneHeigth / this.svgDimension.height,
      //   viewZoneWidth / this.svgDimension.height);
      // const pictureHeigth = this.svgDimension.height * factor;
      // const pictureWidth = this.svgDimension.width * factor;

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
    this.innerSVG = (document.getElementById(
      'picture-view-zone'
      ) as unknown as SVGSVGElement);
    this.innerSVG.setAttribute('width', String(this.svgDimension.width));
    this.innerSVG.setAttribute('height', String(this.svgDimension.height));
    const picture = this.innerSVG.getElementById('pictureView');
    if (picture) {
      picture.setAttribute('width', String(this.svgDimension.width));
      picture.setAttribute('height', String(this.svgDimension.height));
    }
    console.log('fin reset');
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
