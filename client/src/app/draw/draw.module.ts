import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { CanvasComponent } from './canvas/canvas.component';
import { DrawRoutingModule } from './draw-routing.module';
import { DrawComponent } from './draw.component';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrushLogicComponent } from './tool/brush/brush-logic/brush-logic.component';
import { BrushPanelComponent } from './tool/brush/brush-panel/brush-panel.component';
import { PencilLogicComponent } from './tool/pencil/pencil-logic/pencil-logic.component';
import { PencilPanelComponent } from './tool/pencil/pencil-panel/pencil-panel.component';
import { ToolLogicComponent } from './tool/tool-logic/tool-logic.component';
import { ToolPanelComponent } from './tool/tool-panel/tool-panel.component';

@NgModule({
  declarations: [
    CanvasComponent,
    DrawComponent,
    PanelComponent,
    SidebarComponent,
    ToolPanelComponent,
    ToolLogicComponent,
    BrushPanelComponent,
    BrushLogicComponent,
    PencilLogicComponent,
    PencilPanelComponent,
  ],
  imports: [
    CommonModule,
    DrawRoutingModule,
    MatIconModule,
    MatListModule,
  ],
  exports: [
    DrawComponent,
  ],
})
export class DrawModule { }
