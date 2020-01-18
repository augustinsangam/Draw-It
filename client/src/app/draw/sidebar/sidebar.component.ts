import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'draw-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  settings: string[];

  constructor() {
    this.settings = [
      "First",
      "Second",
      "Third",
    ];
  }

  ngOnInit() {
  }

}
