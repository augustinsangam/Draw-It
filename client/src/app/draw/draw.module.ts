import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanvasComponent } from './canvas/canvas.component';
import { DrawComponent } from './draw.component';
import { DrawRoutingModule } from './draw-routing.module';

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
