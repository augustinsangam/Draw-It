import { Injectable } from '@angular/core';
import { flatbuffers } from 'flatbuffers';

import { DrawConfig } from '../constants/constants';
import {
  Attr as AttrT,
  Draw as DrawT,
  Element as ElementT,
} from './data_generated';

enum StatusCode {
  OK = 200,
  CREATED,
  ACCEPTED,
}

// developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/
//   Sending_and_Receiving_Binary_Data#Sending_typed_arrays_as_binary_data
// gomakethings.com/promise-based-xhr/
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private readonly fbb: flatbuffers.Builder;
  private readonly host: string;
  private readonly xhr: XMLHttpRequest;

  constructor() {
    this.fbb = new flatbuffers.Builder();
    this.host = 'http://[::1]:8080';
    this.xhr = new XMLHttpRequest();
  }

  // Must be public
  clear() {
    this.fbb.clear();
  }

  // Must be public
  encodeElementRecursively(el: Element): flatbuffers.Offset {
    const childrenList =  Array.from(el.childNodes)
      .filter((node) => node.nodeType === 1)
      .map((node) => node as Element)
      // TODO : Fix Lint
      .map((childEl) => this.encodeElementRecursively(childEl));
    const children = ElementT.createChildrenVector(this.fbb, childrenList);
    const attrsList = Array.from(el.attributes)
      .filter((attr) => attr.name.charAt(0) !== '_')
      .map((attr) => AttrT.create(
        this.fbb, this.fbb.createString(attr.name),
        this.fbb.createString(attr.value)));
    const attrs = ElementT.createAttrsVector(this.fbb, attrsList);
    const name = this.fbb.createString(el.tagName);
    return ElementT.create(this.fbb, name, attrs, children);
  }

  private encodeTags(tags: string[]) {
    const tagsOffsets = tags.map((tag) => this.fbb.createString(tag));
    return DrawT.createTagsVector(this.fbb, tagsOffsets);
  }

  // Must be public
  encode(config: DrawConfig) {
    const tags = this.encodeTags(config.tags);
    const name = this.fbb.createString(config.name);
    const color = this.fbb.createString(config.color);
    // TODO: colors
    DrawT.start(this.fbb);
    DrawT.addSvg(this.fbb, config.offset);
    DrawT.addTags(this.fbb, tags);
    DrawT.addName(this.fbb, name);
    DrawT.addColor(this.fbb, color);
    DrawT.addWidth(this.fbb, config.width);
    DrawT.addHeight(this.fbb, config.height);
    const draw = DrawT.end(this.fbb);
    this.fbb.finish(draw);
  }

  post(): Promise<number> {
    this.xhr.open('POST', this.host + '/draw', true);
    this.xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    const promise = new Promise<number>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === StatusCode.CREATED) {
            resolve(Number(this.xhr.response));
          } else {
            reject(this.xhr.responseText);
          }
        }
      }
    });
    this.xhr.send(this.fbb.asUint8Array());
    return promise;
  }

  put(id: number): Promise<null> {
    this.xhr.open('PUT', `${this.host}/draw/${id}`, true);
    this.xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    const promise = new Promise<null>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === StatusCode.ACCEPTED) {
            resolve();
          } else {
            reject(this.xhr.responseText);
          }
        }
      }
    });
    this.xhr.send(this.fbb.asUint8Array());
    return promise;
  }
}
