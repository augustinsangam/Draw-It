 // tslint:disable: no-any no-string-literal no-magic-numbers max-classes-per-file max-file-line-count

import { Component, Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { flatbuffers } from 'flatbuffers';

import { SvgHeader } from '../svg/svg-header';
import { SvgShape } from '../svg/svg-shape';
import { CommunicationService, ContentType, StatusCode } from './communication.service';
import {
 Attr as AttrT,
 Element as ElementT,
} from './data_generated';

@Component({
  selector: 'stub',
  template: '',
})
class StubComponent {
  constructor(
    readonly communication: CommunicationService,
    readonly renderer: Renderer2,
    ) {}
}

class XMLHttpRequestMock {
  method: string;
  url: string;
  responseType: string;
  sent: boolean;
  readyState: number;
  responseText: string;
  response: any;
  status: number;
  headers: Map<string, string>;
  constructor() {
    this.sent = false;
    this.readyState = 0;
    this.status = 0;
    this.headers = new Map();
  }
  onreadystatechange: () => void;
  ontimeout: () => void;
  onerror: () => void;
  open(method: string, url: string): void {
    this.method = method;
    this.url = url;
  }
  send(): void {
    this.sent = true;
  }
  setRequestHeader(name: string, value: string): void {
    this.headers.set(name, value);
  }
}

describe('CommunicationService', () => {
  let xhrMock: XMLHttpRequestMock;
  let component: StubComponent;
  let service: CommunicationService;
  let renderer: Renderer2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StubComponent,
      ],
      providers: [
        CommunicationService,
        Renderer2,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    const fixture = TestBed.createComponent(StubComponent);
    component = fixture.componentInstance;
    service = component.communication;
    renderer = component.renderer;
    xhrMock = new XMLHttpRequestMock();
    service['xhr'] = xhrMock as any;
  });

  it('#get should use method GET', () => {
    service.get();

    expect(xhrMock.method).toBe('GET');
  });

  it('#get should expect arraybuffer response type', () => {
    service.get();

    expect(xhrMock.responseType).toBe('arraybuffer');
  });

  it('#get should call send', () => {
    const spy = spyOn(xhrMock, 'send');
    service.get();

    expect(spy).toHaveBeenCalled();
  });

  it('#onreadystatechange from #get should do nothing if not done', async () => {
    let done = false;
    const promise = service.get();
    promise.then(() => done = true);

    xhrMock.readyState = 1;
    xhrMock.onreadystatechange();

    expect(done).toBeFalsy();

    xhrMock.status = StatusCode.OK;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    await promise;
  });

  it('#onreadystatechange from #get should do nothing if status is zero', async () => {
    let done = false;
    const promise = service.get();
    promise.then(() => done = true);

    xhrMock.status = 0;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    expect(done).toBeFalsy();

    xhrMock.status = StatusCode.OK;
    xhrMock.onreadystatechange();

    await promise;
  });

  it('#get should reject if INTERNAL SERVER ERROR', async () => {
    const promise = service.get();
    xhrMock.status = StatusCode.INTERNAL_SERVER_ERROR;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    return expectAsync(promise).toBeRejected();
  });

  it('#get should reject if timeout', async () => {
    const promise = service.get();
    xhrMock.ontimeout();

    return expectAsync(promise).toBeRejected();
  });

  it('#get should reject if error', async () => {
    const promise = service.get();
    xhrMock.onerror();

    return expectAsync(promise).toBeRejected();
  });

  it('#post should use method POST', () => {
    service.post();

    expect(xhrMock.method).toBe('POST');
  });

  it('#post should call send', () => {
    const spy = spyOn(xhrMock, 'send');
    service.post();

    expect(spy).toHaveBeenCalled();
  });

  it('#post should set Content-Type header', () => {
    service.post();

    expect(xhrMock.headers.get('Content-Type')).toBe(ContentType.OCTET_STREAM);
  });

  it('#onreadystatechange from #post should do nothing if not done', async () => {
    let done = false;
    const promise = service.post();
    promise.then(() => done = true);

    xhrMock.readyState = 1;
    xhrMock.onreadystatechange();

    expect(done).toBeFalsy();

    xhrMock.status = StatusCode.CREATED;
    xhrMock.readyState = 4;
    xhrMock.response = '42';
    xhrMock.onreadystatechange();

    await promise;
  });

  it('#onreadystatechange from #post should do nothing if status is zero', async () => {
    let done = false;
    const promise = service.post();
    promise.then(() => done = true);

    xhrMock.status = 0;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    expect(done).toBeFalsy();

    xhrMock.status = StatusCode.CREATED;
    xhrMock.response = '42';
    xhrMock.onreadystatechange();

    await promise;
  });

  it('#post should reject if INTERNAL SERVER ERROR', async () => {
    const promise = service.post();
    xhrMock.status = StatusCode.INTERNAL_SERVER_ERROR;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    return expectAsync(promise).toBeRejected();
  });

  it('#post should reject if timeout', async () => {
    const promise = service.post();
    xhrMock.ontimeout();

    return expectAsync(promise).toBeRejected();
  });

  it('#post should reject if error', async () => {
    const promise = service.post();
    xhrMock.onerror();

    return expectAsync(promise).toBeRejected();
  });

  it('#put should use method PUT', () => {
    service.put(42);

    expect(xhrMock.method).toBe('PUT');
  });

  it('#put should call send', () => {
    const spy = spyOn(xhrMock, 'send');
    service.put(42);

    expect(spy).toHaveBeenCalled();
  });

  it('#put should set Content-Type header', () => {
    service.post();

    expect(xhrMock.headers.get('Content-Type')).toBe(ContentType.OCTET_STREAM);
  });

  it('#onreadystatechange from #put should do nothing if not done', async () => {
    let done = false;
    const promise = service.put(42);
    promise.then(() => done = true);

    xhrMock.readyState = 1;
    xhrMock.onreadystatechange();

    expect(done).toBeFalsy();

    xhrMock.status = StatusCode.ACCEPTED;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    await promise;
  });

  it('#onreadystatechange from #put should do nothing if status is zero', async () => {
    let done = false;
    const promise = service.put(42);
    promise.then(() => done = true);

    xhrMock.status = 0;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    expect(done).toBeFalsy();

    xhrMock.status = StatusCode.ACCEPTED;
    xhrMock.onreadystatechange();

    await promise;
  });

  it('#put should reject if INTERNAL SERVER ERROR', async () => {
    const promise = service.put(42);
    xhrMock.status = StatusCode.INTERNAL_SERVER_ERROR;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    return expectAsync(promise).toBeRejected();
  });

  it('#put should reject if timeout', async () => {
    const promise = service.put(42);
    xhrMock.ontimeout();

    return expectAsync(promise).toBeRejected();
  });

  it('#put should reject if error', async () => {
    const promise = service.put(42);
    xhrMock.onerror();

    return expectAsync(promise).toBeRejected();
  });

  it('#delete should use method DELETE', () => {
    service.delete(42);

    expect(xhrMock.method).toBe('DELETE');
  });

  it('#delete should call send', () => {
    const spy = spyOn(xhrMock, 'send');
    service.delete(42);

    expect(spy).toHaveBeenCalled();
  });

  it('#onreadystatechange from #delete should do nothing if not done', async () => {
    let done = false;
    const promise = service.delete(42);
    promise.then(() => done = true);

    xhrMock.readyState = 1;
    xhrMock.onreadystatechange();

    expect(done).toBeFalsy();

    xhrMock.status = StatusCode.ACCEPTED;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    await promise;
  });

  it('#onreadystatechange from #delete should do nothing if status is zero', async () => {
    let done = false;
    const promise = service.delete(42);
    promise.then(() => done = true);

    xhrMock.status = 0;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    expect(done).toBeFalsy();

    xhrMock.status = StatusCode.ACCEPTED;
    xhrMock.onreadystatechange();

    await promise;
  });

  it('#delete should reject if INTERNAL SERVER ERROR', async () => {
    const promise = service.delete(42);
    xhrMock.status = StatusCode.INTERNAL_SERVER_ERROR;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    return expectAsync(promise).toBeRejected();
  });

  it('#delete should reject if timeout', async () => {
    const promise = service.delete(42);
    xhrMock.ontimeout();

    return expectAsync(promise).toBeRejected();
  });

  it('#delete should reject if error', async () => {
    const promise = service.delete(42);
    xhrMock.onerror();

    return expectAsync(promise).toBeRejected();
  });

  it('#sendEmail should use method POST', () => {
    service.sendEmail('foo', 'bar@example.com', new Blob());

    expect(xhrMock.method).toBe('POST');
  });

  it('#sendEmail should call send', () => {
    const spy = spyOn(xhrMock, 'send');
    service.sendEmail('foo', 'bar@example.com', new Blob());

    expect(spy).toHaveBeenCalled();
  });

  it('#onreadystatechange from #sendEmail should do nothing if not done', async () => {
    let done = false;
    const promise = service.sendEmail('foo', 'bar@example.com', new Blob());
    promise.then(() => done = true);

    xhrMock.readyState = 1;
    xhrMock.onreadystatechange();

    expect(done).toBeFalsy();

    xhrMock.status = StatusCode.ACCEPTED;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    await promise;
  });

  it('#onreadystatechange from #sendEmail should do nothing if status is zero', async () => {
    let done = false;
    const promise = service.sendEmail('foo', 'bar@example.com', new Blob());
    promise.then(() => done = true);

    xhrMock.status = 0;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    expect(done).toBeFalsy();

    xhrMock.status = StatusCode.ACCEPTED;
    xhrMock.onreadystatechange();

    await promise;
  });

  it('#sendEmail should reject if INTERNAL SERVER ERROR', async () => {
    const promise = service.sendEmail('foo', 'bar@example.com', new Blob());
    xhrMock.status = StatusCode.INTERNAL_SERVER_ERROR;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    return expectAsync(promise).toBeRejected();
  });

  it('#sendEmail should reject if timeout', async () => {
    const promise = service.sendEmail('foo', 'bar@example.com', new Blob());
    xhrMock.ontimeout();

    return expectAsync(promise).toBeRejected();
  });

  it('#sendEmail should reject if error', async () => {
    const promise = service.sendEmail('foo', 'bar@example.com', new Blob());
    xhrMock.onerror();

    return expectAsync(promise).toBeRejected();
  });

  it('#decodeElementRecursively should return null if no name', () => {
    const fbBuilder = new flatbuffers.Builder();
    ElementT.start(fbBuilder);
    const elementOffset = ElementT.end(fbBuilder);
    fbBuilder.finish(elementOffset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(fbBuilder.asUint8Array());
    const val = service.decodeElementRecursively(ElementT.getRoot(fbByteBuffer), renderer);
    expect(val).toBeNull();
  });

  it('#decodeElementRecursively should return an element if name is set', () => {
    const fbBuilder = new flatbuffers.Builder();
    const nameOffset = fbBuilder.createString('foobar');
    ElementT.start(fbBuilder);
    ElementT.addName(fbBuilder, nameOffset);
    const elementOffset = ElementT.end(fbBuilder);
    fbBuilder.finish(elementOffset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(fbBuilder.asUint8Array());
    const svgEl = service.decodeElementRecursively(ElementT.getRoot(fbByteBuffer), renderer);
    expect(svgEl).not.toBeNull();
  });

  it('#decodeElementRecursively should return an element with no attribuutes if attribute is null', () => {
    const fbBuilder = new flatbuffers.Builder();
    const nameOffset = fbBuilder.createString('foobar');
    ElementT.start(fbBuilder);
    ElementT.addName(fbBuilder, nameOffset);
    const elementOffset = ElementT.end(fbBuilder);
    fbBuilder.finish(elementOffset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(fbBuilder.asUint8Array());
    const element = ElementT.getRoot(fbByteBuffer);
    const elementAttrsLengthStub = spyOn(element, 'attrsLength');
    elementAttrsLengthStub.and.returnValue(1);

    const svgEl = service.decodeElementRecursively(element, renderer);
    if (svgEl == null) {
      fail('Element should not be null');
      return;
    }
    expect(svgEl.attributes.length).toBe(0);
  });

  it('#decodeElementRecursively should not set attributes if empty value', () => {
    const fbBuilder = new flatbuffers.Builder();

    const nameOffset = fbBuilder.createString('foobar');

    const keyOffset = fbBuilder.createString('foo');
    AttrT.start(fbBuilder);
    AttrT.addK(fbBuilder, keyOffset);
    const attrOffset = AttrT.end(fbBuilder);
    const attrsOffset = ElementT.createAttrsVector(fbBuilder, [attrOffset]);

    ElementT.start(fbBuilder);
    ElementT.addName(fbBuilder, nameOffset);
    ElementT.addAttrs(fbBuilder, attrsOffset);
    const elementOffset = ElementT.end(fbBuilder);

    fbBuilder.finish(elementOffset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(fbBuilder.asUint8Array());
    const svgEl = service.decodeElementRecursively(ElementT.getRoot(fbByteBuffer), renderer);
    if (svgEl == null) {
      fail('Element should not be null');
      return;
    }
    expect(svgEl.getAttribute('foo')).toBeNull();
  });

  it('#decodeElementRecursively should set attributes', () => {
    const fbBuilder = new flatbuffers.Builder();
    const nameOffset = fbBuilder.createString('foobar');
    const keyOffset = fbBuilder.createString('foo');
    const valOffset = fbBuilder.createString('bar');
    const attrOffset = AttrT.create(fbBuilder, keyOffset, valOffset);
    const attrsOffset = ElementT.createAttrsVector(fbBuilder, [attrOffset]);
    ElementT.start(fbBuilder);
    ElementT.addName(fbBuilder, nameOffset);
    ElementT.addAttrs(fbBuilder, attrsOffset);
    const elementOffset = ElementT.end(fbBuilder);
    fbBuilder.finish(elementOffset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(fbBuilder.asUint8Array());
    const svgEl = service.decodeElementRecursively(ElementT.getRoot(fbByteBuffer), renderer);
    if (svgEl == null) {
      fail('Element should not be null');
      return;
    }
    expect(svgEl.getAttribute('foo')).toEqual('bar');
  });

  it('#decodeElementRecursively should return an element with no children if children is null', () => {
    const fbBuilder = new flatbuffers.Builder();
    const nameOffset = fbBuilder.createString('foobar');
    ElementT.start(fbBuilder);
    ElementT.addName(fbBuilder, nameOffset);
    const elementOffset = ElementT.end(fbBuilder);
    fbBuilder.finish(elementOffset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(fbBuilder.asUint8Array());
    const element = ElementT.getRoot(fbByteBuffer);
    const elementChildrenLengthStub = spyOn(element, 'childrenLength');
    elementChildrenLengthStub.and.returnValue(1);

    const svgEl = service.decodeElementRecursively(element, renderer);
    if (svgEl == null) {
      fail('Element should not be null');
      return;
    }
    expect(svgEl.childElementCount).toBe(0);
  });

  it('#decodeElementRecursively should return an element with no children if children has no name', () => {
    const fbBuilder = new flatbuffers.Builder();

    const nameOffset = fbBuilder.createString('foobar');

    ElementT.start(fbBuilder);
    const childOffset = ElementT.end(fbBuilder);
    const childrenOffset = ElementT.createChildrenVector(fbBuilder, [childOffset]);

    ElementT.start(fbBuilder);
    ElementT.addName(fbBuilder, nameOffset);
    ElementT.addChildren(fbBuilder, childrenOffset);
    const elementOffset = ElementT.end(fbBuilder);
    fbBuilder.finish(elementOffset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(fbBuilder.asUint8Array());
    const svgEl = service.decodeElementRecursively(ElementT.getRoot(fbByteBuffer), renderer);
    if (svgEl == null) {
      fail('Element should not be null');
      return;
    }
    expect(svgEl.childElementCount).toBe(0);
  });

  it('#decodeElementRecursively should return an element with one child', () => {
    const fbBuilder = new flatbuffers.Builder();

    const nameOffset = fbBuilder.createString('foo');

    const name2Offset = fbBuilder.createString('bar');

    ElementT.start(fbBuilder);
    ElementT.addName(fbBuilder, name2Offset);
    const childOffset = ElementT.end(fbBuilder);
    const childrenOffset = ElementT.createChildrenVector(fbBuilder, [childOffset]);

    ElementT.start(fbBuilder);
    ElementT.addName(fbBuilder, nameOffset);
    ElementT.addChildren(fbBuilder, childrenOffset);
    const elementOffset = ElementT.end(fbBuilder);
    fbBuilder.finish(elementOffset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(fbBuilder.asUint8Array());
    const svgEl = service.decodeElementRecursively(ElementT.getRoot(fbByteBuffer), renderer);
    if (svgEl == null) {
      fail('Element should not be null');
      return;
    }
    expect(svgEl.childElementCount).toBe(1);
  });

  it('#encodeElementRecursively should create an element with only a name', () => {
    const divElement = renderer.createElement('DIV') as HTMLDivElement;

    service.clear();
    const { offset } = service.encodeElementRecursively(divElement);
    service['fbBuilder'].finish(offset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(service['fbBuilder'].asUint8Array());
    const elementT = ElementT.getRoot(fbByteBuffer);
    expect(elementT.name()).toEqual('DIV');
    expect(elementT.attrsLength()).toEqual(0);
    expect(elementT.childrenLength()).toEqual(0);
  });

  it('#encodeElementRecursively should create an element without tags starting with underscore', () => {
    const divElement = renderer.createElement('DIV') as HTMLDivElement;
    divElement.setAttribute('_foo', 'bar');

    service.clear();
    const { offset } = service.encodeElementRecursively(divElement);
    service['fbBuilder'].finish(offset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(service['fbBuilder'].asUint8Array());
    const elementT = ElementT.getRoot(fbByteBuffer);
    expect(elementT.attrsLength()).toEqual(0);
  });

  it('#encodeElementRecursively should create an element without tags', () => {
    const divElement = renderer.createElement('DIV') as HTMLDivElement;
    divElement.setAttribute('foo', 'bar');

    service.clear();
    const { offset } = service.encodeElementRecursively(divElement);
    service['fbBuilder'].finish(offset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(service['fbBuilder'].asUint8Array());
    const elementT = ElementT.getRoot(fbByteBuffer);
    expect(elementT.attrsLength()).toEqual(1);

    const attr = elementT.attrs(0);
    if (attr == null) {
      fail('Attribute 0 should not be null');
      return;
    }

    expect(attr.k()).toEqual('foo');
    expect(attr.v()).toEqual('bar');
  });

  it('#encodeElementRecursively should create an element with a child', () => {
    const divElement = renderer.createElement('DIV') as HTMLDivElement;
    const pElement = renderer.createElement('P') as HTMLParagraphElement;
    divElement.appendChild(pElement);

    service.clear();
    const { offset } = service.encodeElementRecursively(divElement);
    service['fbBuilder'].finish(offset);

    const fbByteBuffer = new flatbuffers.ByteBuffer(service['fbBuilder'].asUint8Array());
    const elementT = ElementT.getRoot(fbByteBuffer);
    expect(elementT.childrenLength()).toEqual(1);

    const elementT2 = new ElementT();
    const childElement = elementT.children(0, elementT2);
    if (childElement == null) {
      fail('Child 0 should not be null');
      return;
    }

    expect(childElement.name()).toEqual('P');
  });

  it('#encode should call encodeTags', () => {
    const serviceEncodeTagsStub = spyOn<any>(service, 'encodeTags');
    serviceEncodeTagsStub.and.callThrough();

    const svgHeader: SvgHeader = {
      id: 42,
      name: 'foobar',
      tags: ['foo', 'bar'],
    };

    const svgShape: SvgShape = {
      width: 42,
      height: 42,
      color: 'rgba(0, 0, 0, 1)',
    };

    service.clear();

    const divElement = renderer.createElement('DIV') as HTMLDivElement;
    const { offset } = service.encodeElementRecursively(divElement);

    service.encode(svgHeader, svgShape, offset, ['foobar']);

    expect(serviceEncodeTagsStub).toHaveBeenCalled();
  });
});
