import { Component, Optional, Renderer2, OnInit } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup, Validators
} from '@angular/forms';
import { MatDialogRef, MatRadioChange } from '@angular/material';
import { SvgService } from 'src/app/svg/svg.service';

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
    FilterChoice.BandW,
    FilterChoice.Inverse,
    FilterChoice.Artifice,
    FilterChoice.Grey
  ];

  constructor(private formBuilder: FormBuilder,
              @Optional() public dialogRef: MatDialogRef<ExportComponent>,
              private renderer: Renderer2,
              private svgElementService: SvgService
              ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, (control: FormControl) => {
        const input = (control.value as string).trim();
        return (input.indexOf(' ') === -1 && input !== '') ? null : {
          spaceError: { value: 'No whitespace allowed' }
        };
      }]]
    });
  }

  protected onOptionChange($change: MatRadioChange) {
    console.log($change);
  }

  protected onConfirm() {
    console.log('On confirme');
    this.exportDrawing();
    this.dialogRef.close();
  }

  protected onCancel() {
    console.log('On cancel');
    this.dialogRef.close();
  }

  ngOnInit() {
    this.name = 'test';
    this.format = 'svg';
    this.innerSVG = this.svgElementService.instance.nativeElement ;
    this.svgDimension = this.innerSVG.getBoundingClientRect() as DOMRect;
    console.log('taille ' + this.svgDimension.height
    + ' ' + this.svgDimension.width);
  }

  serializeSVG(): string {
    console.log('serializing');
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
    picture.width = 1000;
    picture.height = 1000;
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
    downloadLink.href = (this.format === 'svg') ? this.convertSVGToBase64() : url;

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

}

enum FilterChoice {
  None = 'Aucun',
  Blur = 'Flou',
  BandW = 'Noir et blanc',
  Inverse = 'Inversion',
  Artifice = 'Artifice',
  Grey = 'Gris épatant'
}
