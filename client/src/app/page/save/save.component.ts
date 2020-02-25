import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  CommunicationService,
} from '../../communication/communication.service';
import { DrawConfig } from '../../constants/constants';

@Component({
  selector: 'app-save',
  styleUrls: [
    './save.component.css',
  ],
  templateUrl: './save.component.html',
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
    // Must be public
    readonly dialogRef: MatDialogRef<SaveComponent>,
    // Must be public
    @Inject(MAT_DIALOG_DATA)
    readonly drawConfig: DrawConfig,
    private readonly renderer: Renderer2,
  ) {
    this.saving = false;
    this.tags = new Set(drawConfig.tags);
  }

  ngOnInit(): void {
    if (this.drawConfig.gEl == null) {
      return;
    }
    const clone = this.drawConfig.gEl.cloneNode(true);
    this.elementRef.nativeElement.setAttribute(
      'viewBox', `0 0 ${this.drawConfig.width} ${this.drawConfig.height}`);
    this.renderer.appendChild(this.elementRef.nativeElement, clone);

    this.communicationService.clear();
    this.gElOffset = this.communicationService
      .encodeElementRecursively(this.drawConfig.gEl);
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
    this.drawConfig.name = f.value.name;
    this.drawConfig.tags = Array.from(this.tags);
    this.communicationService.encode(this.drawConfig, this.gElOffset);
    if (this.drawConfig.id) {
      this.communicationService.put(this.drawConfig.id)
        .then(() => this.dialogRef.close())
        .catch((err) => this.dialogRef.close(err));
    } else {
      this.communicationService.post()
        .then((newID) => {
          this.drawConfig.id = newID;
          this.dialogRef.close();
        })
        .catch((err) => this.dialogRef.close(err));
    }
  }
}
