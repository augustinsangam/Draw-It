import { Injectable, Renderer2 } from '@angular/core';
import { flatbuffers } from 'flatbuffers';

import { SvgHeader, SvgShape } from '../svg/svg.service';
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

/* Failed to read the 'responseText' property from
 * 'XMLHttpRequest': The value is only accessible if the object's
 * 'responseType' is '' or 'text' (was 'arraybuffer').
 * at XMLHttpRequest.xhr.onreadystatechange
 * [as __zone_symbol__ON_PROPERTYreadystatechange]
 */
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
    this.xhr.timeout = 7000;
    // by default, xhr is async
  }
  private readonly fbb: flatbuffers.Builder;
  private readonly host: string;
  private readonly xhr: XMLHttpRequest;

  private static deserialize( data: ArrayBuffer ): flatbuffers.ByteBuffer {
    return new flatbuffers.ByteBuffer(new Uint8Array(data));
  }

  clear(): void {
    this.fbb.clear();
  }

  async get(): Promise<flatbuffers.ByteBuffer> {
    // return Promise.reject('nope');
    this.xhr.open('GET', `${this.host}/draw`);
    this.xhr.responseType = 'arraybuffer';
    const promise = new Promise<flatbuffers.ByteBuffer>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === StatusCode.OK) {
            resolve(CommunicationService.deserialize(this.xhr.response));
          } else if (this.xhr.status) {
            reject(String.fromCharCode.apply(null,
              new Uint8Array(this.xhr.response)));
          }
        }
      };
      this.xhr.ontimeout = () => reject('Délai d’attente dépassé');
      this.xhr.onerror = () => reject(
        'Communication impossible avec le serveur');
    });
    this.xhr.send();
    return promise;
  }

  async post(): Promise<number> {
    this.xhr.open('POST', `${this.host}/draw`);
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
      };
      this.xhr.ontimeout = () => reject('Délai d’attente dépassé');
      this.xhr.onerror = () => reject(
        'Communication impossible avec le serveur');
    });
    this.xhr.send(this.fbb.asUint8Array());
    return promise;
  }

  async put(id: number): Promise<null> {
    this.xhr.open('PUT', `${this.host}/draw/${id}`);
    this.xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    const promise = new Promise<null>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === StatusCode.ACCEPTED) {
            resolve();
          } else if (this.xhr.status) {
            reject(this.xhr.responseText);
          }
        }
      };
      this.xhr.ontimeout = () => reject('Délai d’attente dépassé');
      this.xhr.onerror = () => reject(
        'Communication impossible avec le serveur');
    });
    this.xhr.send(this.fbb.asUint8Array());
    return promise;
  }

  async delete(id: number): Promise<null> {
    this.xhr.open('DELETE', `${this.host}/draw/${id}`);
    const promise = new Promise<null>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === StatusCode.ACCEPTED) {
            resolve();
          } else if (this.xhr.status) {
            reject(this.xhr.responseText);
          }
        }
      };
      this.xhr.ontimeout = () => reject('Délai d’attente dépassé');
      this.xhr.onerror = () => reject(
        'Communication impossible avec le serveur');
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
          const [k, v] = [attr.k(), attr.v()];
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

  encodeElementRecursively(el: Element): flatbuffers.Offset {
    const childrenList =  Array.from(el.childNodes)
      .filter((node) => node.nodeType === 1)
      .map((node) => node as Element)
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

  encode(header: SvgHeader, shape: SvgShape, elOffset: flatbuffers.Offset): void {
    const tagsOffset = this.encodeTags(header.tags);
    const nameOffset = this.fbb.createString(header.name);
    const colorOffset = this.fbb.createString(shape.color);
    // TODO: colors
    DrawT.start(this.fbb);
    DrawT.addSvg(this.fbb, elOffset);
    DrawT.addTags(this.fbb, tagsOffset);
    DrawT.addName(this.fbb, nameOffset);
    DrawT.addColor(this.fbb, colorOffset);
    DrawT.addWidth(this.fbb, shape.width);
    DrawT.addHeight(this.fbb, shape.height);
    const draw = DrawT.end(this.fbb);
    this.fbb.finish(draw);
  }

  private encodeTags(tags: string[]): number {
    const tagsOffsets = tags.map((tag) => this.fbb.createString(tag));
    return DrawT.createTagsVector(this.fbb, tagsOffsets);
  }
}
