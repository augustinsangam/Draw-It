import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, Optional, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { ImageFile } from 'src/app/image-file';
import { SvgService } from 'src/app/svg/svg.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {

  private static readonly MIN_LETTERS: number = 3;
  private static readonly MAX_LETTERS: number = 21;

  @ViewChild('preview', {
    static: true,
  }) private readonly elementRef: ElementRef<SVGSVGElement>;

  protected form: FormGroup;
  protected addOnBlur: boolean;
  protected tags: string[];
  readonly separatorKeysCodes: number[];
  protected saving: boolean;

  constructor(private formBuilder: FormBuilder,
              private svgService: SvgService,
              private renderer: Renderer2,
              @Optional() private dialogRef: MatDialogRef<SaveComponent>) {
    this.saving = false;
    this.addOnBlur = true;
    this.separatorKeysCodes = [ENTER, COMMA];
    this.form = this.formBuilder.group({
      name: [
        this.svgService.header.name,
        [
          Validators.required,
          Validators.pattern(`.{${SaveComponent.MIN_LETTERS},${SaveComponent.MAX_LETTERS}}`)
        ]
      ]
    });
    this.tags = this.svgService.header.tags;
  }

  ngOnInit(): void {
    const clone = this.svgService.structure.drawZone.cloneNode(true);
    const height = this.svgService.shape.height;
    const width = this.svgService.shape.width;

    if (height > width) {
      const max = 400;
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'width',
        (max * width / height).toString()
      );
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'height',
        max.toString()
      );
    }

    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'viewBox',
      `0 0 ${width} ${height}`
    );
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'background-color',
      this.svgService.shape.color
    );
    this.renderer.appendChild(this.elementRef.nativeElement, clone);
  }

  protected add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const toAdd = (value || '').trim();
    if (toAdd.length < SaveComponent.MIN_LETTERS || toAdd.length > SaveComponent.MAX_LETTERS) {
      return;
    }
    if (this.tags.includes(toAdd)) {
      return;
    }
    this.tags.push(toAdd);
    input.value = '';
  }

  protected remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  protected onSubmit(): void {
    this.saving = true;
    this.svgService.header.name = this.form.controls.name.value;
    this.svgService.header.tags = Array.from(this.tags);

    const fileToSave: ImageFile = {
      header: this.svgService.header,
      shape: this.svgService.shape,
      draws: new XMLSerializer().serializeToString(this.svgService.structure.drawZone)
    };

    const stringToSave = JSON.stringify(fileToSave);
    const blob = new Blob([stringToSave], {type : 'text/plain;charset=utf-8'});
    const fileName = `${fileToSave.header.name}.di`;

    const downloadLink: HTMLAnchorElement = this.renderer.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click();

    this.saving = false;

    this.dialogRef.close();
  }

  protected onCancel(): void {
    this.dialogRef.close('Opération annulée');
  }

}
