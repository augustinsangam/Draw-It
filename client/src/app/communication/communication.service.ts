import { Injectable, Renderer2 } from '@angular/core';
import { flatbuffers } from 'flatbuffers';

import { SvgHeader } from '../svg/svg-header';
import { SvgShape } from '../svg/svg-shape';
import {
  Attr as AttrT,
  Draw as DrawT,
  Element as ElementT,
} from './data_generated';

const ERROR_MESSAGE = 'Communication impossible avec le serveur';
const TIMEOUT_ERROR_MESSAGE = 'Délai d’attente dépassé';
const TIMEOUT = 7000;
const DONE = 4;

export enum ContentType {
  OCTET_STREAM = 'application/octet-stream',
}

export enum StatusCode {
  OK = 200,
  CREATED,
  ACCEPTED,
  INTERNAL_SERVER_ERROR = 500,
}

// TODO: duplication message, decode element recursively reduire l imbrication,
// enlever les abreviations

// developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/
//   Sending_and_Receiving_Binary_Data#Sending_typed_arrays_as_binary_data
// gomakethings.com/promise-based-xhr/
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private readonly fbBuilder: flatbuffers.Builder;
  private readonly host: string;
  private xhr: XMLHttpRequest;

  constructor() {
    this.fbBuilder = new flatbuffers.Builder();
    this.host = 'http://[::1]:8080';
    this.xhr = new XMLHttpRequest();
    this.xhr.timeout = TIMEOUT;
  }

  private static deserialize(data: ArrayBuffer): flatbuffers.ByteBuffer {
    return new flatbuffers.ByteBuffer(new Uint8Array(data));
  }

  clear(): void {
    this.fbBuilder.clear();
  }

  async get(): Promise<flatbuffers.ByteBuffer> {
    this.xhr.open('GET', `${this.host}/draw`);
    this.xhr.responseType = 'arraybuffer';
    const promise = new Promise<flatbuffers.ByteBuffer>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState !== DONE) {
          return;
        }
        if (this.xhr.status === StatusCode.OK) {
          resolve(CommunicationService.deserialize(this.xhr.response));
        } else if (this.xhr.status) {
          reject(String.fromCharCode.apply(null,
            new Uint8Array(this.xhr.response)));
        }
      };
      this.xhr.ontimeout = () => reject(TIMEOUT_ERROR_MESSAGE);
      this.xhr.onerror = () => reject(ERROR_MESSAGE);
    });
    this.xhr.send();
    return promise;
  }

  async post(): Promise<number> {
    this.xhr.open('POST', `${this.host}/draw`);
    this.xhr.setRequestHeader('Content-Type', ContentType.OCTET_STREAM);
    const promise = new Promise<number>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState !== DONE) {
          return;
        }
        if (this.xhr.status === StatusCode.CREATED) {
          resolve(Number(this.xhr.response));
        } else if (this.xhr.status) {
          reject(this.xhr.responseText);
        }
      };
      this.xhr.ontimeout = () => reject(TIMEOUT_ERROR_MESSAGE);
      this.xhr.onerror = () => reject(ERROR_MESSAGE);
    });
    this.xhr.send(this.fbBuilder.asUint8Array());
    return promise;
  }

  async put(id: number): Promise<null> {
    this.xhr.open('PUT', `${this.host}/draw/${id}`);
    this.xhr.setRequestHeader('Content-Type', ContentType.OCTET_STREAM);
    const promise = new Promise<null>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState !== DONE) {
          return;
        }
        if (this.xhr.status === StatusCode.ACCEPTED) {
          resolve();
        } else if (this.xhr.status) {
          reject(this.xhr.responseText);
        }
      };
      this.xhr.ontimeout = () => reject(TIMEOUT_ERROR_MESSAGE);
      this.xhr.onerror = () => reject(ERROR_MESSAGE);
    });
    this.xhr.send(this.fbBuilder.asUint8Array());
    return promise;
  }

  async delete(id: number): Promise<null> {
    this.xhr.open('DELETE', `${this.host}/draw/${id}`);
    const promise = new Promise<null>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState !== DONE) {
          return;
        }
        if (this.xhr.status === StatusCode.ACCEPTED) {
          resolve();
        } else if (this.xhr.status) {
          reject(this.xhr.responseText);
        }
      };
      this.xhr.ontimeout = () => reject(TIMEOUT_ERROR_MESSAGE);
      this.xhr.onerror = () => reject(ERROR_MESSAGE);
    });
    this.xhr.send();
    return promise;
  }

  decodeElementRecursively(element: ElementT, renderer: Renderer2): SVGElement | null {
    const name = element.name();
    if (name == null) {
      return null;
    }

    const svgEl: SVGElement = renderer.createElement(name, 'http://www.w3.org/2000/svg');

    const attrsLen = element.attrsLength();
    for (let i = 0; i < attrsLen; ++i) {
      const attr = element.attrs(i);
      if (attr == null) {
        continue;
      }

      const [key, value] = [attr.k(), attr.v()];
      // v may be empty, so !!v is not suitable
      if (!!key && value != null) {
        renderer.setAttribute(svgEl, key, value);
      }
    }

    const childrenLen = element.childrenLength();
    for (let i = 0; i < childrenLen; ++i) {
      const child = element.children(i);
      if (child == null) {
        continue;
      }

      const childElement = this.decodeElementRecursively(child, renderer);
      if (!!childElement) {
        renderer.appendChild(svgEl, childElement);
      }
    }

    return svgEl;
  }

  encodeElementRecursively(el: Element): flatbuffers.Offset {
    const childrenList =  Array.from(el.childNodes)
      .filter((node) => node.nodeType === 1)
      .map((node) => node as Element)
      .map((childEl) => this.encodeElementRecursively(childEl));
    const children = ElementT.createChildrenVector(this.fbBuilder, childrenList);

    const attrsList = Array.from(el.attributes)
      .filter((attr) => attr.name.charAt(0) !== '_')
      .map((attr) => AttrT.create(
        this.fbBuilder, this.fbBuilder.createString(attr.name),
        this.fbBuilder.createString(attr.value)));
    const attrs = ElementT.createAttrsVector(this.fbBuilder, attrsList);

    const name = this.fbBuilder.createString(el.tagName);

    return ElementT.create(this.fbBuilder, name, attrs, children);
  }

  encode(header: SvgHeader, shape: SvgShape, elOffset: flatbuffers.Offset): void {
    const tagsOffset = this.encodeTags(header.tags);
    const nameOffset = this.fbBuilder.createString(header.name);
    const colorOffset = this.fbBuilder.createString(shape.color);
    // TODO: colors
    DrawT.start(this.fbBuilder);
    DrawT.addSvg(this.fbBuilder, elOffset);
    DrawT.addTags(this.fbBuilder, tagsOffset);
    DrawT.addName(this.fbBuilder, nameOffset);
    DrawT.addColor(this.fbBuilder, colorOffset);
    DrawT.addWidth(this.fbBuilder, shape.width);
    DrawT.addHeight(this.fbBuilder, shape.height);
    const draw = DrawT.end(this.fbBuilder);
    this.fbBuilder.finish(draw);
  }

  private encodeTags(tags: string[]): number {
    const tagsOffsets = tags.map((tag) => this.fbBuilder.createString(tag));
    return DrawT.createTagsVector(this.fbBuilder, tagsOffsets);
  }
}
