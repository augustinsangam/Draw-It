
import { AfterViewInit, Component, ElementRef, Optional, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleChange, MatDialog, MatDialogRef, MatRadioChange } from '@angular/material';
import { CommunicationService } from 'src/app/communication/communication.service';
import { NOT_FOUND } from 'src/app/not-found';
import { SvgToCanvas } from 'src/app/svg-to-canvas/svg-to-canvas';
import { SvgShape } from 'src/app/svg/svg-shape';
import { SvgService } from 'src/app/svg/svg.service';
import { FilterService } from 'src/app/tool/drawing-instruments/brush/filter.service';
import { ConfirmationExportComponent } from './confirmation-export.component';
import { ExportType } from './export-type';
import { ProgressExportComponent } from './progress-export.component';

export enum FilterChoice {
  NONE = 'Aucun',
  SATURATE = 'Saturation',
  BLACKWHITE = 'Noir et blanc',
  INVERSE = 'Inversion',
  SEPIA = 'Sepia',
  GREY = 'Gris épatant',
}

export enum FormatChoice {
  SVG = 'SVG',
  PNG = 'PNG',
  JPEG = 'JPEG',
}

export interface DialogRefs {
  confirm: MatDialogRef<ConfirmationExportComponent>;
  progress: MatDialogRef<ProgressExportComponent>;
}

export interface ExportHeader {
  name: string;
  exportType: ExportType;
  email: string;
}

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})

export class ExportComponent implements AfterViewInit {

  private static readonly SVG_NS: string = 'http://www.w3.org/2000/svg';
  private static readonly TIMEOUT: number = 3000;

  @ViewChild('svgView', {
    static: false
  }) protected svgView: ElementRef<SVGSVGElement>;

  private innerSVG: SVGSVGElement;
  private svgShape: SvgShape;
  private pictureView: SVGImageElement;
  private filtersChooser: Map<string, string>;
  private form: FormGroup;
  private exportType: ExportType;
  private dialogRefs: DialogRefs;

  static validator(control: FormControl): null | { spaceError: { value: string } } {
    const input = (control.value as string).trim();
    if (input.indexOf(' ') === NOT_FOUND && input !== '') {
      return null;
    }
    return { spaceError: { value: 'No whitespace allowed' } };
  }

  constructor(private readonly communicationService: CommunicationService,
              private formBuilder: FormBuilder,
              @Optional() public epxortDialog: MatDialogRef<ExportComponent>,
              private renderer: Renderer2,
              private filterService: FilterService,
              private svgService: SvgService,
              private matDialog: MatDialog
  ) {
    this.exportType = ExportType.LOCAL;
    this.filtersChooser = new Map();
    this.form = this.formBuilder.group({
      name  : ['', [Validators.required, ExportComponent.validator]],
      email : [{value: '', disabled: true}],
      filter: [FilterChoice.NONE, [Validators.required]],
      format: [FormatChoice.PNG, [Validators.required]]
    });
    this.dialogRefs = {
      confirm: (undefined as unknown) as MatDialogRef<ConfirmationExportComponent>,
      progress: (undefined as unknown) as MatDialogRef<ProgressExportComponent>,
    };
  }

  protected getFilters(): FilterChoice[] {
    return [
      FilterChoice.NONE,
      FilterChoice.SATURATE,
      FilterChoice.BLACKWHITE,
      FilterChoice.INVERSE,
      FilterChoice.SEPIA,
      FilterChoice.GREY
    ];
  }

  protected getFormats(): FormatChoice[] {
    return [
      FormatChoice.SVG,
      FormatChoice.PNG,
      FormatChoice.JPEG
    ];
  }

  protected onOptionChange($change: MatRadioChange): void {
    this.createView(String($change.value));
  }

  private getFormat(): FormatChoice {
    return this.form.controls.format.value;
  }

  private getEmail(): string {
    return this.form.controls.email.value;
  }

  private getName(): string {
    return this.form.controls.name.value;
  }

  protected async onConfirm(confirmed: boolean): Promise<void> {
    if (!confirmed) {
      return;
    }

    this.dialogRefs.progress = this.matDialog.open(ProgressExportComponent, { width: '400px'});
    const format = this.getFormat();
    let succeded = true;
    if (this.exportType === ExportType.EMAIL) {
      const blob = await this.getImageAsBlob(format);
      const email = this.getEmail();
      const name = `${this.getName()}.${format.toLowerCase()}`;
      try {
        const response = await this.communicationService.sendEmail(
          name, email, blob);
        this.dialogRefs.progress.componentInstance.message = response;
      } catch (err) {
        succeded = false;
        this.dialogRefs.progress.componentInstance.message = err.message;
      }
      this.dialogRefs.progress.componentInstance.error = !succeded;
    } else {
      const url = await this.getImageAsURL(format);
      this.downloadImage(url);
      this.dialogRefs.progress.componentInstance.message = 'Le téléchargement commencera sous peu !';
    }
    this.dialogRefs.progress.componentInstance.inProgress = false;
    this.dialogRefs.progress.afterClosed().subscribe(this.onExportDialogClose);
    if (succeded) {
      setTimeout(() => this.dialogRefs.progress.close(), ExportComponent.TIMEOUT);
    }
  }

  private onExportDialogClose = () => this.epxortDialog.close();

  protected popUpConfirm(): void {
    const exportHeader: ExportHeader = {
      name: `${this.getName()}.${this.getFormat().toLowerCase()}`,
      exportType: this.exportType,
      email: this.getEmail()
    };
    this.dialogRefs.confirm = this.matDialog.open(
      ConfirmationExportComponent,
      { data: exportHeader, width: '400px' }
    );
    this.dialogRefs.confirm.disableClose = true;
    this.dialogRefs.confirm.afterClosed().subscribe(this.onConfirmDialogClose);
  }

  private onConfirmDialogClose = (result: boolean) => this.onConfirm(result);

  ngAfterViewInit(): void {
    const filterZone = this.filterService.generateExportFilters(this.renderer);
    this.renderer.appendChild(this.svgView.nativeElement, filterZone);
    this.initializeElements();
    this.initializeFiltersChooser();
    this.createView(FilterChoice.NONE);
  }

  private initializeFiltersChooser(): void {
    this.filtersChooser.set(FilterChoice.NONE, '');
    this.filtersChooser.set(FilterChoice.SATURATE, 'url(#saturate)');
    this.filtersChooser.set(FilterChoice.BLACKWHITE, 'url(#blackWhite)');
    this.filtersChooser.set(FilterChoice.INVERSE, 'url(#sepia)');
    this.filtersChooser.set(FilterChoice.SEPIA, 'url(#invertion)');
    this.filtersChooser.set(FilterChoice.GREY, 'url(#greyscale)');
  }

  private initializeElements(): void {
    this.svgShape = this.svgService.shape;
    this.innerSVG = this.renderer.createElement('svg', ExportComponent.SVG_NS);
    Array.from(this.svgService.structure.defsZone.children).forEach((element: SVGElement) => {
      this.renderer.appendChild(this.innerSVG, element.cloneNode(true));
    });
    this.renderer.appendChild(this.innerSVG, this.generateBackground());
    Array.from(this.svgService.structure.drawZone.children).forEach((element: SVGElement) => {
      this.renderer.appendChild(this.innerSVG, element.cloneNode(true));
    });
    this.renderer.setAttribute(this.innerSVG, 'width', this.svgShape.width.toString());
    this.renderer.setAttribute(this.innerSVG, 'height', this.svgShape.height.toString());
  }

  private serializeSVG(): string {
    return new XMLSerializer().serializeToString(this.innerSVG);
  }

  private convertSVGToBase64(): string {
    return `data:image/svg+xml;base64,${btoa(this.serializeSVG())}`;
  }

  private downloadImage(pictureUrl: string): void {
    const downloadLink: HTMLAnchorElement = this.renderer.createElement('a');
    const format = this.getFormat().toLowerCase();
    downloadLink.href = pictureUrl;
    const name: string = this.getName().trim().toLowerCase();
    downloadLink.download = `${name}.${format}`;
    downloadLink.click();
  }

  private formatToMime(format: FormatChoice): string {
    if (format === FormatChoice.SVG) {
      return 'image/svg+xml';
    }
    return `image/${format.toLowerCase()}`;
  }

  private async svgToCanvas(): Promise<HTMLCanvasElement> {
    const svgToCanvas = new SvgToCanvas(this.innerSVG, this.svgService.shape,
      this.renderer);
    return svgToCanvas.getCanvas();
  }

  private async getImageAsURL(format: FormatChoice): Promise<string> {
    this.resetInnerSVG();
    const type = this.formatToMime(format);

    if (format as FormatChoice === FormatChoice.SVG) {
      return `data:${type},${encodeURIComponent(this.serializeSVG())}`;
    }

    const canvas = await this.svgToCanvas();
    return canvas.toDataURL(type);
  }

  private async getImageAsBlob(format: FormatChoice): Promise<Blob> {
    this.resetInnerSVG();
    const type = this.formatToMime(format);

    let byteString: string;
    if (format === FormatChoice.SVG) {
      byteString = this.serializeSVG();
    } else {
      const canvas = await this.svgToCanvas();
      const dataURL = canvas.toDataURL(type);
      const asciiString = dataURL.split(',')[1];
      byteString = atob(asciiString);
    }

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const byteArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; ++i) {
      byteArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type });
  }

  private createView(filterName: string): void {
    this.pictureView = this.renderer.createElement('image', ExportComponent.SVG_NS);
    const viewZone = this.svgView.nativeElement;
    this.configurePicture(this.pictureView, filterName);
    const child = viewZone.lastElementChild;
    if (child && (child.getAttribute('id') === 'pictureView')) {
      viewZone.removeChild(child);
    }
    this.renderer.appendChild(viewZone, this.pictureView);
  }

  private configurePicture(picture: SVGImageElement, filterName: string): void {
    const viewZoneHeigth = Number(this.svgView.nativeElement.getAttribute('height'));
    const viewZoneWidth = Number(this.svgView.nativeElement.getAttribute('width'));
    const factor = Math.max(this.svgShape.height / viewZoneHeigth,
      this.svgShape.width / viewZoneWidth);
    const pictureHeigth = this.svgShape.height / factor - 2;
    const pictureWidth = this.svgShape.width / factor - 2;
    this.renderer.setAttribute(picture, 'x', '1');
    this.renderer.setAttribute(picture, 'y', '1');
    this.renderer.setAttribute(picture, 'id', 'pictureView');
    this.renderer.setAttribute(picture, 'href', this.convertSVGToBase64());
    this.renderer.setAttribute(picture, 'width', pictureWidth.toString());
    this.renderer.setAttribute(picture, 'height', pictureHeigth.toString());
    const filter = this.filtersChooser.get(this.form.controls.filter.value.toString()) as string;
    picture.setAttribute('filter', filter);
  }

  private resetInnerSVG(): void {
    const filterZone: SVGGElement = this.renderer.createElement('g', ExportComponent.SVG_NS);
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
    const rect: SVGRectElement = this.renderer.createElement('rect', ExportComponent.SVG_NS);
    this.renderer.setAttribute(rect, 'y', '0');
    this.renderer.setAttribute(rect, 'x', '0');
    this.renderer.setAttribute(rect, 'height', String(this.svgShape.height));
    this.renderer.setAttribute(rect, 'width', String(this.svgShape.width));
    this.renderer.setAttribute(rect, 'fill', this.svgShape.color);
    return rect;
  }

  protected onExportTypeChange({value}: MatButtonToggleChange): void {
    this.exportType = value;
    const input = this.form.get('email');
    if (input == null) {
      return;
    }

    if (value === ExportType.LOCAL) {
      input.disable();
      return;
    }

    input.setValidators([Validators.required, Validators.email]);
    input.enable();
  }
}
