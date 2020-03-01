import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, Optional, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { CommunicationService } from 'src/app/communication/communication.service';
import { SvgService } from 'src/app/svg/svg.service';

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
  protected tags: string[] = ['Mes dessins'];
  readonly separatorKeysCodes: number[];
  private gElOffset?: flatbuffers.Offset;
  // private saving: boolean;

  constructor(private formBuilder: FormBuilder,
              private svgService: SvgService,
              private renderer: Renderer2,
              private communicationService: CommunicationService,
              @Optional() private dialogRef: MatDialogRef<SaveComponent>) {
    // this.saving = false;
    this.addOnBlur = true;
    this.separatorKeysCodes = [ENTER, COMMA];
    this.form = this.formBuilder.group({
      name: [, [Validators.required, Validators.pattern('.{3,21}')]]
    });
  }

  ngOnInit(): void {
    const clone = this.svgService.structure.drawZone.cloneNode(true);
    const h = this.svgService.shape.height;
    const w = this.svgService.shape.width;
    this.elementRef.nativeElement.setAttribute('viewBox', `0 0 ${w} ${h}`);
    this.elementRef.nativeElement.style.backgroundColor = this.svgService.shape.color;
    this.renderer.appendChild(this.elementRef.nativeElement, clone);
    this.communicationService.clear();
    this.gElOffset = this.communicationService
      .encodeElementRecursively(clone as Element);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const toAdd = (value || '').trim();
    if (toAdd.length >= 3 && toAdd.length <= 21) {
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
    // this.saving = true;
    this.svgService.header.name = this.form.controls.name.value;
    this.svgService.header.tags = Array.from(this.tags);
    this.communicationService.encode(
      this.svgService.header.name,
      this.svgService.header.tags,
      this.svgService.shape.color,
      this.svgService.shape.width,
      this.svgService.shape.height,
      this.gElOffset);
    console.log(this.svgService.header.id);
    if (this.svgService.header.id) {
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
