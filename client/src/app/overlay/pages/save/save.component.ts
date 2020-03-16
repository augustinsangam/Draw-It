import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, Optional, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { CommunicationService } from 'src/app/communication/communication.service';
import { SvgService } from 'src/app/svg/svg.service';

const MIN_LETTERS = 3;
const MAX_LETTERS = 21;

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {

  @ViewChild('preview', {
    static: true,
  }) private readonly elementRef: ElementRef<SVGSVGElement>;

  protected form: FormGroup;
  protected addOnBlur: boolean;
  protected tags: string[];
  readonly separatorKeysCodes: number[];
  private gElOffset?: flatbuffers.Offset;
  protected saving: boolean;

  constructor(private formBuilder: FormBuilder,
              private svgService: SvgService,
              private renderer: Renderer2,
              private communicationService: CommunicationService,
              @Optional() private dialogRef: MatDialogRef<SaveComponent>) {
    this.saving = false;
    this.addOnBlur = true;
    this.separatorKeysCodes = [ENTER, COMMA];
    this.form = this.formBuilder.group({
      name: [
        this.svgService.header.name,
        [
          Validators.required,
          Validators.pattern(`.{${MIN_LETTERS},${MAX_LETTERS}}`)
        ]
      ]
    });
    this.tags = (this.svgService.header.tags.length === 0) ? ['Mes dessins'] :
                this.svgService.header.tags;
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
    this.communicationService.clear();
    this.gElOffset = this.communicationService
      .encodeElementRecursively(clone as Element);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const toAdd = (value || '').trim();
    if (toAdd.length >= MIN_LETTERS && toAdd.length <= MAX_LETTERS) {
      this.tags.push(value.trim());
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.gElOffset == null) {
      return;
    }
    this.saving = true;
    this.svgService.header.name = this.form.controls.name.value;
    this.svgService.header.tags = Array.from(this.tags);
    this.communicationService.encode(
      this.svgService.header,
      this.svgService.shape,
      this.gElOffset);
    if (this.svgService.header.id !== 0) {
      this.communicationService.put(this.svgService.header.id)
        .then(() => this.dialogRef.close())
        .catch((err) => this.dialogRef.close(err));
    } else {
      this.communicationService.post()
        .then((newID) => {
          this.svgService.header.id = newID;
          this.dialogRef.close();
        })
        .catch((err) => this.dialogRef.close(err));
    }
  }

  onCancel(): void {
    this.dialogRef.close('Opération annulée');
  }

}
