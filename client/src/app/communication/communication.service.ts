import { Injectable } from '@angular/core';
import { flatbuffers } from 'flatbuffers';

import { Draw } from './data_generated';

// developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data#Sending_typed_arrays_as_binary_data
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private readonly xhr: XMLHttpRequest;
  private readonly fbb: flatbuffers.Builder;

  constructor() {
    this.xhr = new XMLHttpRequest();
    this.fbb = new flatbuffers.Builder();
  }

  build() {
    //this.fbb.createString();
    console.log(this.fbb);
    console.log(Draw);
  }

  ping() {
    this.xhr.open('POST', 'http://[::1]:8080/draw', true);
    this.xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    const enc = new TextEncoder();
    this.xhr.send(enc.encode('hello world'));
  }
}
