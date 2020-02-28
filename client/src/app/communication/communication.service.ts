import { Injectable, Renderer2 } from '@angular/core';
import { flatbuffers } from 'flatbuffers';

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

  constructor() {
    this.fbb = new flatbuffers.Builder();
    this.host = 'http://[::1]:8080';
    this.xhr = new XMLHttpRequest();
  }
  private readonly fbb: flatbuffers.Builder;
  private readonly host: string;
  private readonly xhr: XMLHttpRequest;

  private static deserialize(
		data: ArrayBuffer,
	): flatbuffers.ByteBuffer {
		return new flatbuffers.ByteBuffer(new Uint8Array(data));
	}

  // Must be public
  clear() {
    this.fbb.clear();
  }

  getAll() {
    this.xhr.open('GET', this.host + '/draw', true);
    this.xhr.responseType = 'arraybuffer';
    const promise = new Promise<flatbuffers.ByteBuffer>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === StatusCode.OK) {
            // response type is ArrayBuffer
            resolve(CommunicationService.deserialize(this.xhr.response));
          } else {
            reject(this.xhr.responseText);
          }
        }
      }
    });
    this.xhr.send();
    return promise;
  }

  decodeElementRecursively(el: ElementT, renderer: Renderer2): SVGElement | null {
    const name = el.name();
    if (!!name) {
      const svgEl: SVGElement = renderer.createElement(name, 'http://www.w3.org/2000/svg');
      const attrsLen = el.attrsLength();
      for (let i = 0; i < attrsLen; i++) {
        const attr = el.attrs(i);
        if (!!attr) {
          const k = attr.k(), v = attr.v();
          // v may be empty, so !!v is not suitable
          if (!!k && v != null) {
            svgEl.setAttribute(k, v);
          }
        }
      }
      const childrenLen = el.childrenLength();
      for (let i = 0; i < childrenLen; i++) {
        const child = el.children(i);
        if (!!child) {
          renderer.appendChild(svgEl,
            this.decodeElementRecursively(child, renderer));
        }
      }
      return svgEl;
    }
    return null;
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
  encode(name: string, tags: string[], color: string,
    width: number, height: number, elOffset: flatbuffers.Offset) {
    const tagsOffset = this.encodeTags(tags);
    const nameOffset = this.fbb.createString(name);
    const colorOffset = this.fbb.createString(color);
    // TODO: colors
    DrawT.start(this.fbb);
    DrawT.addSvg(this.fbb, elOffset);
    DrawT.addTags(this.fbb, tagsOffset);
    DrawT.addName(this.fbb, nameOffset);
    DrawT.addColor(this.fbb, colorOffset);
    DrawT.addWidth(this.fbb, width);
    DrawT.addHeight(this.fbb, height);
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
          } else if (this.xhr.status) {
            reject(this.xhr.responseText);
          }
        }
      }
      this.xhr.ontimeout = () => reject('Temps de repos dépassé');
      this.xhr.onerror = () => reject(
        'Communication impossible avec le serveur');
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
      this.xhr.onerror = (err) => reject(err);
    });
    this.xhr.send(this.fbb.asUint8Array());
    return promise;
  }

  delete(id: number): Promise<null> {
    this.xhr.open('DELETE', `${this.host}/draw/${id}`, true);
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
      this.xhr.onerror = (err) => reject(err);
    });
    this.xhr.send();
    return promise;
  }
}
