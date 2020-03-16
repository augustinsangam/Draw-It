 // tslint:disable: no-any no-string-literal

import { TestBed } from '@angular/core/testing';

import { CommunicationService, ContentType, StatusCode } from './communication.service';

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

fdescribe('CommunicationService', () => {
  let xhrMock: XMLHttpRequestMock;
  let service: CommunicationService;

  beforeAll(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(CommunicationService);
    xhrMock = new XMLHttpRequestMock();
    service['xhr'] = xhrMock as any;
  });

  it('get should use method GET', () => {
    service.get();

    expect(xhrMock.method).toBe('GET');
  });

  it('get should expect arraybuffer response type', () => {
    service.get();

    expect(xhrMock.responseType).toBe('arraybuffer');
  });

  it('get should call send', () => {
    const spy = spyOn(xhrMock, 'send');
    service.get();

    expect(spy).toHaveBeenCalled();
  });

  it('onreadystatechange from get should do nothing if not done', async () => {
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

  it('onreadystatechange from get should do nothing if status is zero', async () => {
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

  it('get should reject if INTERNAL SERVER ERROR', async () => {
    const promise = service.get();
    xhrMock.status = StatusCode.INTERNAL_SERVER_ERROR;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    await expectAsync(promise).toBeRejected();
  });

  it('post should use method POST', () => {
    service.post();

    expect(xhrMock.method).toBe('POST');
  });

  it('post should call send', () => {
    const spy = spyOn(xhrMock, 'send');
    service.post();

    expect(spy).toHaveBeenCalled();
  });

  it('post should set Content-Type header', () => {
    service.post();

    expect(xhrMock.headers.get('Content-Type')).toBe(ContentType.OCTET_STREAM);
  });

  it('onreadystatechange from post should do nothing if not done', async () => {
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

  it('onreadystatechange from post should do nothing if status is zero', async () => {
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

  it('post should reject if INTERNAL SERVER ERROR', async () => {
    const promise = service.post();
    xhrMock.status = StatusCode.INTERNAL_SERVER_ERROR;
    xhrMock.readyState = 4;
    xhrMock.onreadystatechange();

    await expectAsync(promise).toBeRejected();
  });
});
