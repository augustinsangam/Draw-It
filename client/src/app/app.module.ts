import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MccColorPickerModule } from 'material-community-components';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { ConfirmationDialogComponent } from './pages/new-draw/confirmation-dialog.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SvgComponent } from './svg/svg.component';
import { BrushLogicComponent } from './tool/brush/brush-logic/brush-logic.component';
import { BrushPanelComponent } from './tool/brush/brush-panel/brush-panel.component';
import { ColorLogicComponent } from './tool/color/color-logic/color-logic.component';
import { ColorPanelComponent } from './tool/color/color-panel/color-panel.component';
import { ColorPicklerContentComponent } from './tool/color/color-panel/color-pickler-content/color-pickler-content.component';
import { ColorPicklerItemComponent } from './tool/color/color-panel/color-pickler-item/color-pickler-item.component';
import { LineLogicComponent } from './tool/line/line-logic/line-logic.component';
import { LinePanelComponent } from './tool/line/line-panel/line-panel.component';
import { PencilLogicComponent } from './tool/pencil/pencil-logic/pencil-logic.component';
import { PencilPanelComponent } from './tool/pencil/pencil-panel/pencil-panel.component';
import { RectangleLogicComponent } from './tool/rectangle/rectangle-logic/rectangle-logic.component';
import { RectanglePanelComponent } from './tool/rectangle/rectangle-panel/rectangle-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    BrushLogicComponent,
    BrushPanelComponent,
    ColorLogicComponent,
    ColorPanelComponent,
    ColorPicklerContentComponent,
    ColorPicklerItemComponent,
    ConfirmationDialogComponent,
    DocumentationComponent,
    HomeComponent,
    LineLogicComponent,
    LinePanelComponent,
    NewDrawComponent,
    NotFoundPageComponent,
    PanelComponent,
    PencilLogicComponent,
    PencilPanelComponent,
    SidebarComponent,
    SvgComponent,
    RectangleLogicComponent,
    RectanglePanelComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    MaterialModule,
    MatIconModule,
    MatListModule,
    MccColorPickerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  entryComponents: [
    BrushLogicComponent,
    BrushPanelComponent,
    ColorLogicComponent,
    ColorPanelComponent,
    ConfirmationDialogComponent,
    LinePanelComponent,
    LineLogicComponent,
    HomeComponent,
    NewDrawComponent,
    PencilLogicComponent,
    PencilPanelComponent,
    RectangleLogicComponent,
    RectanglePanelComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
