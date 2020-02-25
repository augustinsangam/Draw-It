import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {
  DocumentationComponent,
} from './page/documentation/documentation.component';
import { HomeComponent } from './page/home/home.component';
import {
  ConfirmationDialogComponent,
} from './page/new-draw/confirmation-dialog/confirmation-dialog.component';
import { NewDrawComponent } from './page/new-draw/new-draw.component';
import {
  PaletteDialogComponent,
} from './page/new-draw/palette-dialog/palette-dialog.component';
import { SaveComponent } from './page/save/save.component';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SvgComponent } from './svg/svg.component';
import {
  ColorPickerContentComponent,
} from './tool/color/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent,
} from './tool/color/color-picker-item/color-picker-item.component';
import { ColorComponent } from './tool/color/color.component';
import { PencilComponent } from './tool/paint/pencil/pencil.component';
import { PencilDirective } from './tool/paint/pencil/pencil.directive';
import { LineComponent } from './tool/shape/line/line.component';
import { LineDirective } from './tool/shape/line/line.directive';
import { RectangleComponent } from './tool/shape/rectangle/rectangle.component';
import { RectangleDirective } from './tool/shape/rectangle/rectangle.directive';
import { ToolComponent } from './tool/tool.component';
import { ToolDirective } from './tool/tool.directive';

@NgModule({
  bootstrap: [
    AppComponent,
  ],
  declarations: [
    AppComponent,
    ColorComponent,
    ColorPickerContentComponent,
    ColorPickerItemComponent,
    ConfirmationDialogComponent,
    DocumentationComponent,
    HomeComponent,
    LineComponent,
    LineDirective,
    NewDrawComponent,
    PaletteDialogComponent,
    PanelComponent,
    // PencilBrushCommonDirective,
    PencilComponent,
    PencilDirective,
    RectangleComponent,
    RectangleDirective,
    SaveComponent,
    SidebarComponent,
    SvgComponent,
    ToolComponent,
    ToolDirective,
  ],
  entryComponents: [
    LineComponent,
    SvgComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTreeModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [
  ],
})
export class AppModule { }
