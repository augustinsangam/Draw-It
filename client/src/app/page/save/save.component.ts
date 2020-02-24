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

  private readonly drawConfig: DrawConfig;
  // Must be public
  readonly tags: Set<string>;

  constructor(
    private readonly communicationService: CommunicationService,
    // Must be public
    readonly dialogRef: MatDialogRef<SaveComponent>,
    private readonly renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA)
    private readonly svgElRef: ElementRef<SVGSVGElement>,
  ) {
    this.drawConfig = {
      color: '',
      height: 0,
      width: 0,
    };
    this.tags = new Set();
  }

  ngOnInit(): void {
    const svgEl = this.svgElRef.nativeElement;
    const h = svgEl.getAttribute('height');
    const w = svgEl.getAttribute('width');
    const drawZone = svgEl.getElementById('zone');

    const clone = drawZone.cloneNode(true);
    this.elementRef.nativeElement.setAttribute('viewBox', `0 0 ${w} ${h}`);
    this.renderer.appendChild(this.elementRef.nativeElement, clone);

    this.communicationService.clear();
    this.drawConfig.color = svgEl.style.backgroundColor;
    this.drawConfig.height = Number(h);
    this.drawConfig.width = Number(w);
    this.drawConfig.offset = this.communicationService
      .encodeElementRecursively(drawZone);
  }

  // angular.io/guide/user-input#type-the-event
  // Must be public
  add(keyEv: KeyboardEvent) {
    // Do not submit
    keyEv.preventDefault();
    const inputEl = keyEv.target as HTMLInputElement;
    this.tags.add(inputEl.value);
    inputEl.value = '';
  }

  foo() {
    console.log('foo');
  }

  // Must be public
  submit(f: NgForm) {
    this.drawConfig.name = f.value.name;
    this.drawConfig.tags = Array.from(this.tags);
    this.communicationService.encode(this.drawConfig);
    const id = Number(this.svgElRef.nativeElement.id);
    if (id) {
      this.communicationService.put(id)
        .then(() => {
          console.log('ok');
          this.dialogRef.close();
        })
        .catch(() => console.log('err'));
    } else {
      this.communicationService.post()
        .then((newID) => {
          console.log('ok');
          this.svgElRef.nativeElement.id = newID.toString();
          this.dialogRef.close();
        })
        .catch(() => console.log('err'));
    }
  }
}
