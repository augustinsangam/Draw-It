import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MccColorPickerModule } from 'material-community-components';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { MaterialModule } from './material.module';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { ConfirmationDialog, NewDrawComponent } from './pages/new-draw/new-draw.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialog,
    DocumentationComponent,
    HomeComponent,
    NewDrawComponent,
    NotFoundPageComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    MccColorPickerModule,
    ReactiveFormsModule,
  ],
  providers: [],
  entryComponents: [
    ConfirmationDialog,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
