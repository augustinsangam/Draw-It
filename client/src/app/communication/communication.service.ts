import { Injectable } from '@angular/core';
import { flatbuffers } from 'flatbuffers';

import { Attr, Element } from './data_generated';

interface AttrT {
  k: string;
  v: string;
}
interface ElementT {
  name: string;
  attrs: AttrT[];
  children?: ElementT[];
}
const data = {
  name: 'Mother',
  attrs: [
    {
      k: 'damn',
      v: 'wow',
    },
    {
      k: 'trop',
      v: 'fresh',
    },
  ],
  children: [
    {
      name: 'Alice',
      attrs: [
        {
          k: 'size',
          v: '1.8m',
        },
        {
          k: 'weight',
          v: '55kg',
        },
        {
          k: 'strength',
          v: 'none',
        },
      ],
      children: [
        {
          name: 'Seb',
          attrs: [
            {
              k: 'foo',
              v: 'bar',
            },
          ],
        },
        {
          name: 'Kev',
          attrs: [
            {
              k: 'hello',
              v: 'world',
            },
          ],
          children: [
            {
              name: 'Khalid',
              attrs: [
                {
                  k: 'weight',
                  v: '42k',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Bob',
      attrs: [
        {
          k: 'smart',
          v: 'yes',
        },
      ],
    },
  ],
};

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

  private encode(el: ElementT): flatbuffers.Offset {
    const childrenList = new Array<number>();
    if (!!el.children) {
      for (const child of el.children) {
        childrenList.push(this.encode(child));
      }
    }
    const children = Element.createChildrenVector(this.fbb, childrenList);
    const attrsList = new Array<number>();
    for (const attr of el.attrs) {
      const k = this.fbb.createString(attr.k);
      const v = this.fbb.createString(attr.v);
      attrsList.push(Attr.create(this.fbb, k, v));
    }
    const attrs = Element.createAttrsVector(this.fbb, attrsList);
    const name = this.fbb.createString(el.name);
    return Element.create(this.fbb, name, attrs, children);
  }

  ping() {
    const end = this.encode(data);
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
