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
import { ConfirmationDialogComponent } from './pages/new-draw/confirmation-dialog.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
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
    ConfirmationDialogComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
