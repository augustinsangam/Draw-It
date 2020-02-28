import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommunicationService } from 'src/app/communication/communication.service';
import { MatDialogRef } from '@angular/material';
import { SvgService } from 'src/app/svg/svg.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {
  @ViewChild('preview', {
    static: true,
  })
  private readonly elementRef: ElementRef<SVGSVGElement>;

  // Must be public
  saving: boolean;
  // Must be public
  readonly tags: Set<string>;

  private gElOffset?: flatbuffers.Offset;

  constructor(
    private readonly communicationService: CommunicationService,
    readonly dialogRef: MatDialogRef<SaveComponent>,
    private readonly renderer: Renderer2,
    private svgService: SvgService,
  ) {
    this.saving = false;
    this.tags = new Set(svgService.tags);
  }


  ngOnInit(): void {
    const clone = this.svgService.structure.drawZone.cloneNode(true);
    const h = this.svgService.shape.height;
    const w = this.svgService.shape.width;
    this.elementRef.nativeElement.setAttribute('viewBox', `0 0 ${w} ${h}`);
    this.renderer.appendChild(this.elementRef.nativeElement, clone);

    this.communicationService.clear();
    this.gElOffset = this.communicationService
      .encodeElementRecursively(clone as Element);
  }

  // angular.io/guide/user-input#type-the-event
  // Must be public
  add(keyEv: KeyboardEvent) {
    const inputEl = keyEv.target as HTMLInputElement;
    if (inputEl.checkValidity()) {
      // Do not submit
      keyEv.preventDefault();
      this.tags.add(inputEl.value);
      inputEl.value = '';
    }
  }

  // Must be public
  submit(f: NgForm): void {
    if (this.gElOffset == null) {
      return;
    }
    this.saving = true;
    this.svgService.name = f.value.name;
    this.svgService.tags = Array.from(this.tags);
    this.communicationService.encode(
      this.svgService.name,
      this.svgService.tags,
      this.svgService.shape.color,
      this.svgService.shape.width,
      this.svgService.shape.height,
      this.gElOffset);
    console.log(this.svgService.id);
    if (this.svgService.id) {
      this.communicationService.put(this.svgService.id)
        .then(() => this.dialogRef.close())
        .catch((err) => this.dialogRef.close(err));
    } else {
      this.communicationService.post()
        .then((newID) => {
          this.svgService.id = newID;
          this.dialogRef.close();
        })
        .catch((err) => this.dialogRef.close(err));
    }
  }

}
