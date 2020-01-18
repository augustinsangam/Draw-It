import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DrawComponent } from './draw.component';

const routes: Routes = [
  {
    path: '',
    component: DrawComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class DrawRoutingModule { }
