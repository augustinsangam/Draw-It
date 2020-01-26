import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { CanvasComponent } from './canvas/canvas.component';
import { DrawRoutingModule } from './draw-routing.module';
import { DrawComponent } from './draw.component';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolComponent } from './tool/tool.component';
import { PencilComponent } from './tool/pencil/pencil.component';

@NgModule({
  declarations: [
    CanvasComponent,
    DrawComponent,
    PanelComponent,
    SidebarComponent,
    ToolComponent,
    PencilComponent,
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
