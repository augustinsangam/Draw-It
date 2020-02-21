import {
  CommonModule
} from '@angular/common';
import {
  HttpClientModule
} from '@angular/common/http';
import {
  NgModule
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatFormFieldModule,
  MatListModule
} from '@angular/material';
import {
  MatIconModule
} from '@angular/material/icon';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import {
  DocumentationComponent
} from './pages/documentation/documentation.component';
import {
  ExportComponent
} from './pages/export/export.component';
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
import {
  PanelComponent } from './panel/panel.component';
import {
  SidebarComponent } from './sidebar/sidebar.component';
import {
  SvgComponent } from './svg/svg.component';
import {
  ApplicatorLogicComponent
} from './tool/applicator/applicator-logic/applicator-logic.component';
import {
  ApplicatorPanelComponent
} from './tool/applicator/applicator-panel/applicator-panel.component';
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
  AerosolLogicComponent
// tslint:disable-next-line: max-line-length
} from './tool/drawing-instruments/aerosol/aerosol-logic/aerosol-logic.component';
import {
  AerosolPanelComponent
// tslint:disable-next-line: max-line-length
} from './tool/drawing-instruments/aerosol/aerosol-panel/aerosol-panel.component';
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
  GridLogicComponent
} from './tool/grid/grid-logic/grid-logic.component';
import {
  GridPanelComponent
} from './tool/grid/grid-panel/grid-panel.component';
import {
  PipetteLogicComponent
} from './tool/pipette/pipette-logic/pipette-logic.component';
import {
  PipettePanelComponent
} from './tool/pipette/pipette-panel/pipette-panel.component';
import {
  SelectionLogicComponent
} from './tool/selection/selection-logic/selection-logic.component';
import {
  SelectionPanelComponent
} from './tool/selection/selection-panel/selection-panel.component';
import {
  EllipseLogicComponent
} from './tool/shape/ellipse/ellipse-logic/ellipse-logic.component';
import {
  EllipsePanelComponent
} from './tool/shape/ellipse/ellipse-panel/ellipse-panel.component';
import {
  LineLogicComponent
} from './tool/shape/line/line-logic/line-logic.component';
import {
  LinePanelComponent
} from './tool/shape/line/line-panel/line-panel.component';
import {
  PolygoneLogicComponent
} from './tool/shape/polygone/polygone-logic/polygone-logic.component';
import {
  PolygonePanelComponent
} from './tool/shape/polygone/polygone-panel/polygone-panel.component';
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
    EllipseLogicComponent,
    EllipsePanelComponent,
    EraserPanelComponent,
    EraserLogicComponent,
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
    PolygoneLogicComponent,
    PolygonePanelComponent,
    PipetteLogicComponent,
    PipettePanelComponent,
    AerosolLogicComponent,
    AerosolPanelComponent,
    ExportComponent,
    ApplicatorPanelComponent,
    ApplicatorLogicComponent,
    GridLogicComponent,
    GridPanelComponent,
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
    AerosolLogicComponent,
    AerosolPanelComponent,
    ApplicatorLogicComponent,
    ApplicatorPanelComponent,
    BrushLogicComponent,
    BrushPanelComponent,
    ColorPanelComponent,
    EraserLogicComponent,
    EraserPanelComponent,
    PaletteDialogComponent,
    ConfirmationDialogComponent,
    DocumentationComponent,
    EllipseLogicComponent,
    EllipsePanelComponent,
    ExportComponent,
    LineLogicComponent,
    LinePanelComponent,
    HomeComponent,
    NewDrawComponent,
    PencilLogicComponent,
    PencilPanelComponent,
    PipetteLogicComponent,
    PipettePanelComponent,
    RectangleLogicComponent,
    RectanglePanelComponent,
    PolygoneLogicComponent,
    PolygonePanelComponent,
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
