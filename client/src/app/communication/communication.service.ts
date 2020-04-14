import { Injectable, Renderer2 } from '@angular/core';
import { flatbuffers } from 'flatbuffers';

import { SvgHeader } from '../svg/svg-header';
import { SvgShape } from '../svg/svg-shape';
import {
  Attr as AttrT,
  Draw as DrawT,
  Element as ElementT,
  Node as NodeT,
  Text as TextT,
} from './data_generated';

const ERROR_MESSAGE = 'Communication impossible avec le serveur';
const GENERIC_ERROR = new Error(ERROR_MESSAGE);
const TIMEOUT_ERROR_MESSAGE = 'Délai d’attente dépassé';
const TIMEOUT_ERROR = new Error(TIMEOUT_ERROR_MESSAGE);
const TIMEOUT = 7000;
const DONE = 4;

export enum ContentType {
  OCTET_STREAM = 'application/octet-stream',
}

export enum Method {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

export enum StatusCode {
  OK = 200,
  CREATED,
  ACCEPTED,
  INTERNAL_SERVER_ERROR = 500,
}

interface DataTree {
  type: NodeT,
  offset: flatbuffers.Offset,
}

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
    this.xhr.open(Method.GET, `${this.host}/draw`);
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
    this.xhr.open(Method.POST, `${this.host}/draw`);
    this.xhr.setRequestHeader('Content-Type', ContentType.OCTET_STREAM);
    this.xhr.responseType = 'text';
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
    this.xhr.open(Method.PUT, `${this.host}/draw/${id}`);
    this.xhr.setRequestHeader('Content-Type', ContentType.OCTET_STREAM);
    this.xhr.responseType = 'text';
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
    this.xhr.open(Method.DELETE, `${this.host}/draw/${id}`);
    this.xhr.responseType = 'text';
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

  async sendEmail(name: string, email: string, blob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('recipient', email);
    formData.append('media', blob, name);
    this.xhr.open(Method.POST, `${this.host}/send`);
    this.xhr.responseType = 'text';
    const promise = new Promise<string>((resolve, reject) => {
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState !== DONE) {
          return;
        }
        if (this.xhr.status === StatusCode.ACCEPTED) {
          resolve(this.xhr.responseText);
        } else if (this.xhr.status) {
          reject(new Error(this.xhr.responseText));
        }
      };
      this.xhr.ontimeout = () => reject(TIMEOUT_ERROR);
      this.xhr.onerror = () => reject(GENERIC_ERROR);
    });
    this.xhr.send(formData);
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
      if (!!key && value != null) {
        renderer.setAttribute(svgEl, key, value);
      }
    }

    const childrenLen = element.childrenLength();
    for (let i = 0; i < childrenLen; ++i) {
      const type = element.childrenType(i);
      if (type === null) {
        continue;
      }

      if (type === NodeT.Text) {
        const textT = new TextT();
        const child = element.children(i, textT);
        if (child === null) {
          continue;
        }

        const content = child.content();
        if (content === null) {
          continue;
        }

        const childText: Text = renderer.createText(content);
        renderer.appendChild(svgEl, childText);
        continue;
      }

      const elementT = new ElementT();
      const child = element.children(i, elementT);
      if (child === null) {
        continue;
      }

      const childElement = this.decodeElementRecursively(child, renderer);
      if (childElement !== null) {
        renderer.appendChild(svgEl, childElement);
      }
    }

    return svgEl;
  }

  encodeElementRecursively(el: Element): DataTree {
    if (el.nodeType === Node.TEXT_NODE) {
      const text = this.fbBuilder.createString(el.textContent as string);
      return {
        type: NodeT.Text,
        offset: TextT.create(this.fbBuilder, text),
      };
    }

    const childrenTreeList =  Array.from(el.childNodes)
      .filter((node) => node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE)
      .map((node) => node as Element)
      .map((childEl) => this.encodeElementRecursively(childEl));

    const childrenTypeList = childrenTreeList.map(({type}) => type);
    const childrenType = ElementT.createChildrenTypeVector(this.fbBuilder, childrenTypeList);

    const childrenList = childrenTreeList.map(({offset}) => offset);
    const children = ElementT.createChildrenVector(this.fbBuilder, childrenList);

    const attrsList = Array.from(el.attributes)
      .filter((attr) => attr.name.charAt(0) !== '_')
      .map((attr) => AttrT.create(
        this.fbBuilder, this.fbBuilder.createString(attr.name),
        this.fbBuilder.createString(attr.value)));
    const attrs = ElementT.createAttrsVector(this.fbBuilder, attrsList);

    ElementT.createChildrenTypeVector
    const name = this.fbBuilder.createString(el.tagName);

    return {
      type: NodeT.Element,
      offset: ElementT.create(this.fbBuilder, name, attrs, childrenType, children),
    };
  }

  encode(header: SvgHeader, shape: SvgShape, elOffset: flatbuffers.Offset, colors: string[]): void {
    const tagsOffset = this.encodeTags(header.tags);
    const nameOffset = this.fbBuilder.createString(header.name);
    const colorOffset = this.fbBuilder.createString(shape.color);
    const colorsOffsest = this.encodeColors(colors);
    DrawT.start(this.fbBuilder);
    DrawT.addSvg(this.fbBuilder, elOffset);
    DrawT.addTags(this.fbBuilder, tagsOffset);
    DrawT.addName(this.fbBuilder, nameOffset);
    DrawT.addColor(this.fbBuilder, colorOffset);
    DrawT.addColors(this.fbBuilder, colorsOffsest);
    DrawT.addWidth(this.fbBuilder, shape.width);
    DrawT.addHeight(this.fbBuilder, shape.height);
    const draw = DrawT.end(this.fbBuilder);
    this.fbBuilder.finish(draw);
  }

  private encodeTags(tags: string[]): number {
    const tagsOffsets = tags.map((tag) => this.fbBuilder.createString(tag));
    return DrawT.createTagsVector(this.fbBuilder, tagsOffsets);
  }

  private encodeColors(colors: string[]): number {
    const colorsOffsets = colors.map((color) => this.fbBuilder.createString(color));
    return DrawT.createColorsVector(this.fbBuilder, colorsOffsets);
  }
}
