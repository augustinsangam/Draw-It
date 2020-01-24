import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentationComponent } from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: 'draw',
    loadChildren: () => import('./draw/draw.module').then(m => m.DrawModule),
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'new',
    component: NewDrawComponent,
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
