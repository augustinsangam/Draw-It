import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MccColorPickerModule } from 'material-community-components';

import { AppRoutingModule } from './app-routing.module';
import { CanvasComponent } from './canvas/canvas.component';
import { AppComponent } from './components/app/app.component';
import { DrawComponent } from './draw.component';
import { MaterialModule } from './material.module';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { ConfirmationDialogComponent } from './pages/new-draw/confirmation-dialog.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrushLogicComponent } from './tool/brush/brush-logic/brush-logic.component';
import { BrushPanelComponent } from './tool/brush/brush-panel/brush-panel.component';
import { PencilLogicComponent } from './tool/pencil/pencil-logic/pencil-logic.component';
import { PencilPanelComponent } from './tool/pencil/pencil-panel/pencil-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    BrushLogicComponent,
    BrushPanelComponent,
    CanvasComponent,
    ConfirmationDialogComponent,
    DocumentationComponent,
    DrawComponent,
    HomeComponent,
    NewDrawComponent,
    NotFoundPageComponent,
    PanelComponent,
    PencilLogicComponent,
    PencilPanelComponent,
    SidebarComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    MaterialModule,
    MatIconModule,
    MatListModule,
    MccColorPickerModule,
    ReactiveFormsModule,
  ],
  providers: [],
  entryComponents: [
    BrushLogicComponent,
    BrushPanelComponent,
    ConfirmationDialogComponent,
    PencilLogicComponent,
    PencilPanelComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
