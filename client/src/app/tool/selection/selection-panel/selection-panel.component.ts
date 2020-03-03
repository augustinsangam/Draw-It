import { Component, ElementRef, OnInit } from '@angular/core';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';

@Component({
  selector: 'app-selection-panel',
  templateUrl: './selection-panel.component.html',
  styleUrls: ['./selection-panel.component.scss']
})
export class SelectionPanelComponent extends ToolPanelDirective
  implements OnInit {

  constructor(elementRef: ElementRef<HTMLElement>) {
      super(elementRef);
  }

  // TODO : On n'a encore rien à mettre ici car il n'il y a encore rien dans le pannel
  // Les fonctionnalités arriveront au sprint 3
  // Notre architecture impose de définir ngOnInit car c'est à ce moment de certains attributs
  // seront disponibles
  // tslint:disable-next-line: no-empty
  ngOnInit(): void { }

}
