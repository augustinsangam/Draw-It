import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  instance: ElementRef<SVGElement>;

  changeBackgroundColor(color: string) {
    this.instance.nativeElement.style.backgroundColor = color;
  }

  clearDom(): void {
    const childrens = Array.from(this.instance.nativeElement.children);
    childrens.forEach(element => {
      element.remove();
    });
  }

}
