import { Injectable } from '@angular/core';
import { flatbuffers } from 'flatbuffers';

import { Attr as AttrT, Element as ElementT } from './data_generated';

enum StatusCode {
  CREATED = 201,
  ACCEPTED,
  NO_CONTENT = 204,
}

// developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data#Sending_typed_arrays_as_binary_data
// gomakethings.com/promise-based-xhr/
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

  private static serialize(fbbb: flatbuffers.ByteBuffer): Uint8Array {
    return fbbb.bytes().subarray(fbbb.position(), fbbb.capacity());
  }

  // FIXME: HTMLElement => dom.Element
  private encode(el: Element): flatbuffers.Offset {
    const childrenList =  Array.from(el.childNodes)
      .filter(node => node.nodeType == 1)
      .map(node => node as Element)
      .map(el => this.encode(el));
    const children = ElementT.createChildrenVector(this.fbb, childrenList);
    const attrsList = Array.from(el.attributes)
      .map(attr => AttrT.create(
        this.fbb, this.fbb.createString(attr.name),
        this.fbb.createString(attr.value)))
    const attrs = ElementT.createAttrsVector(this.fbb, attrsList);
    const name = this.fbb.createString(el.tagName);
    return ElementT.create(this.fbb, name, attrs, children);
  }

  ping(el: Element) {
    const end = this.encode(el);
    this.fbb.finish(end);
    const encoded = this.fbb.dataBuffer();
    const serialized = CommunicationService.serialize(encoded);
    this.xhr.open('POST', 'http://[::1]:8080/draw', true);
    this.xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    const promise = new Promise<void>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === StatusCode.CREATED) {
            resolve();
          } else {
            reject();
          }
        }
      }
    });
    this.xhr.send(serialized);
    this.fbb.clear();
    return promise;
  }
}
