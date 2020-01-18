import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { CanvasComponent } from './canvas/canvas.component';
import { DrawRoutingModule } from './draw-routing.module';
import { DrawComponent } from './draw.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    CanvasComponent,
    DrawComponent,
    SidebarComponent,
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
