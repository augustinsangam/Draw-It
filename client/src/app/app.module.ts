import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './pages/home/home.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

/****************************** Angular Material ******************************/
import { MaterialModule } from './material.module';

/********************************** Rooting ***********************************/
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'documentation', component: DocumentationComponent },
  { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DocumentationComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
