import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CanvasComponent } from './canvas/canvas.component';
import { DrawRoutingModule } from './draw-routing.module';
import { DrawComponent } from './draw.component';

@NgModule({
  declarations: [
    CanvasComponent,
    DrawComponent,
  ],
  imports: [
    CommonModule,
    DrawRoutingModule,
  ],
  exports: [
    DrawComponent,
  ],
})
export class DrawModule { }
