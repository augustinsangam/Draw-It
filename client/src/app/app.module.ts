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
import {
  AppComponent
} from './app.component';
import {
  MaterialModule
} from './material.module';
import {
  DocumentationComponent
} from './overlay/pages/documentation/documentation.component';
import {
  ExportComponent
} from './overlay/pages/export/export.component';
import {
  DeleteConfirmationDialogComponent
} from './overlay/pages/gallery/deleteconfirmation-dialog.component';
import {
  GalleryCardComponent
} from './overlay/pages/gallery/gallery-card/gallery-card.component';
import {
  GalleryComponent
} from './overlay/pages/gallery/gallery.component';
import {
  TagsFilterComponent
} from './overlay/pages/gallery/tags-filter/tags-filter.component';
import {
  HomeComponent
} from './overlay/pages/home/home.component';
import {
  ConfirmationDialogComponent
} from './overlay/pages/new-draw/confirmation-dialog.component';
import {
  NewDrawComponent
} from './overlay/pages/new-draw/new-draw.component';
import {
  PaletteDialogComponent
} from './overlay/pages/new-draw/palette-dialog.component';
import { SaveComponent } from './overlay/pages/save/save.component';
import {
  PanelComponent
} from './panel/panel.component';
import {
  SidebarComponent
} from './sidebar/sidebar.component';
import {
  SvgComponent
} from './svg/svg.component';
import {
  ApplicatorLogicComponent
} from './tool/applicator/applicator-logic/applicator-logic.component';
import {
  ApplicatorPanelComponent
} from './tool/applicator/applicator-panel/applicator-panel.component';
import {
  BucketLogicComponent
} from './tool/bucket/bucket-logic/bucket-logic.component';
import {
  BucketPanelComponent
} from './tool/bucket/bucket-panel/bucket-panel.component';
import {
  ColorBoxComponent
} from './tool/color/color-box/color-box.component';
import {
  ColorPanelComponent
} from './tool/color/color-panel/color-panel.component';
import {
  ColorPickerContentComponent
} from './tool/color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from './tool/color/color-panel/color-picker-item/color-picker-item.component';
import {
  AerosolLogicComponent
} from './tool/drawing-instruments/aerosol/aerosol-logic/aerosol-logic.component';
import {
  AerosolPanelComponent
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
import {
  TextLogicComponent
} from './tool/text/text-logic/text-logic.component';
import {
  TextPanelComponent
} from './tool/text/text-panel/text-panel.component';
import { FeatherpenLogicComponent } from './tool/drawing-instruments/featherpen/featherpen-logic/featherpen-logic.component';
import { FeatherpenPanelComponent } from './tool/drawing-instruments/featherpen/featherpen-panel/featherpen-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    BrushLogicComponent,
    BrushPanelComponent,
    ColorBoxComponent,
    ColorPanelComponent,
    ColorPickerContentComponent,
    ColorPickerItemComponent,
    ConfirmationDialogComponent,
    DeleteConfirmationDialogComponent,
    DocumentationComponent,
    EllipseLogicComponent,
    EllipsePanelComponent,
    GalleryComponent,
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
    PolygoneLogicComponent,
    PolygonePanelComponent,
    RectangleLogicComponent,
    RectanglePanelComponent,
    SidebarComponent,
    SvgComponent,
    GalleryCardComponent,
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
    SaveComponent,
    TagsFilterComponent,
    BucketLogicComponent,
    BucketPanelComponent,
    ColorBoxComponent,
    TextLogicComponent,
    TextPanelComponent,
    FeatherpenLogicComponent,
    FeatherpenPanelComponent
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
    BucketLogicComponent,
    BucketPanelComponent,
    BrushLogicComponent,
    BrushPanelComponent,
    ColorBoxComponent,
    ColorPanelComponent,
    EraserLogicComponent,
    EraserPanelComponent,
    PaletteDialogComponent,
    ConfirmationDialogComponent,
    DeleteConfirmationDialogComponent,
    DocumentationComponent,
    EllipseLogicComponent,
    EllipsePanelComponent,
    GalleryComponent,
    HomeComponent,
    ExportComponent,
    LineLogicComponent,
    LinePanelComponent,
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
    GridLogicComponent,
    GridPanelComponent,
    SaveComponent,
    TextLogicComponent,
    TextPanelComponent,
    FeatherpenLogicComponent,
    FeatherpenPanelComponent
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
