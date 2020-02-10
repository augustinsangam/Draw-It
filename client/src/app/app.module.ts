import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatListModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MccColorPickerModule } from 'material-community-components';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { ConfirmationDialogComponent } from './pages/new-draw/confirmation-dialog.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { PaletteDialogComponent } from './pages/new-draw/palette-dialog.component';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SvgComponent } from './svg/svg.component';
import { BrushLogicComponent } from './tool/brush/brush-logic/brush-logic.component';
import { BrushPanelComponent } from './tool/brush/brush-panel/brush-panel.component';
import { ColorPanelComponent } from './tool/color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from './tool/color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from './tool/color/color-panel/color-picker-item/color-picker-item.component';
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
    ColorPanelComponent,
    ColorPickerContentComponent,
    ColorPickerItemComponent,
    ConfirmationDialogComponent,
    DocumentationComponent,
    HomeComponent,
    LineLogicComponent,
    LinePanelComponent,
    NewDrawComponent,
    PanelComponent,
    PaletteDialogComponent,
    PencilLogicComponent,
    PencilPanelComponent,
    RectangleLogicComponent,
    RectanglePanelComponent,
    SidebarComponent,
    SvgComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MccColorPickerModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  entryComponents: [
    BrushLogicComponent,
    BrushPanelComponent,
    ColorPanelComponent,
    PaletteDialogComponent,
    ConfirmationDialogComponent,
    DocumentationComponent,
    LineLogicComponent,
    LinePanelComponent,
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
