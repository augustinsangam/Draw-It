import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DrawComponent } from './draw.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '',
    component : DrawComponent,
  },
  {
    path: 'documentation',
    component: DocumentationComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule { }
