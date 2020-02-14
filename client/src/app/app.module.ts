import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatListModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule, NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import {
  DocumentationComponent
} from './pages/documentation/documentation.component';
import {
  HomeComponent
} from './pages/home/home.component';
import {
  ConfirmationDialogComponent
} from './pages/new-draw/confirmation-dialog.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import {
  PaletteDialogComponent
} from './pages/new-draw/palette-dialog.component';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SvgComponent } from './svg/svg.component';
import {
  ColorPanelComponent
} from './tool/color/color-panel/color-panel.component';
import {
  ColorPickerContentComponent
// tslint:disable-next-line: max-line-length
} from './tool/color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from './tool/color/color-panel/color-picker-item/color-picker-item.component';
import {
  BrushLogicComponent
} from './tool/drawing-instruments/brush/brush-logic/brush-logic.component';
import {
  BrushPanelComponent
} from './tool/drawing-instruments/brush/brush-panel/brush-panel.component';
import {
  PencilLogicComponent
} from './tool/drawing-instruments/pencil/pencil-logic/pencil-logic.component';
import {
  PencilPanelComponent
} from './tool/drawing-instruments/pencil/pencil-panel/pencil-panel.component';
import {
  EraserLogicComponent
} from './tool/eraser/eraser-logic/eraser-logic.component';
import {
  EraserPanelComponent
} from './tool/eraser/eraser-panel/eraser-panel.component';
import {
  SelectionLogicComponent
} from './tool/selection/selection-logic/selection-logic.component';
import {
  SelectionPanelComponent
} from './tool/selection/selection-panel/selection-panel.component';
import {
  LineLogicComponent
} from './tool/shape/line/line-logic/line-logic.component';
import {
  LinePanelComponent
} from './tool/shape/line/line-panel/line-panel.component';
import {
  RectangleLogicComponent
} from './tool/shape/rectangle/rectangle-logic/rectangle-logic.component';
import {
  RectanglePanelComponent
} from './tool/shape/rectangle/rectangle-panel/rectangle-panel.component';

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
    SelectionPanelComponent,
    SelectionLogicComponent,
    EraserPanelComponent,
    EraserLogicComponent,
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
    NoopAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  entryComponents: [
    BrushLogicComponent,
    BrushPanelComponent,
    ColorPanelComponent,
    EraserLogicComponent,
    EraserPanelComponent,
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
    SelectionLogicComponent,
    SelectionPanelComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
