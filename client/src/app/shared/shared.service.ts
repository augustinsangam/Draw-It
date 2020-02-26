import { Injectable, Type } from '@angular/core';

import { BrushComponent } from '../tool/paint/brush/brush.component';
import { BrushDirective } from '../tool/paint/brush/brush.directive';
import { BrushService } from '../tool/paint/brush/brush.service';
import { PencilComponent } from '../tool/paint/pencil/pencil.component';
import { PencilDirective } from '../tool/paint/pencil/pencil.directive';
import { PencilService } from '../tool/paint/pencil/pencil.service';
import { LineComponent } from '../tool/shape/line/line.component';
import { LineDirective } from '../tool/shape/line/line.directive';
import { LineService } from '../tool/shape/line/line.service';
import {
  RectangleComponent,
} from '../tool/shape/rectangle/rectangle.component';
import {
  RectangleDirective,
} from '../tool/shape/rectangle/rectangle.directive';
import { RectangleService } from '../tool/shape/rectangle/rectangle.service';
import { ToolComponent } from '../tool/tool.component';
import { ToolDirective } from '../tool/tool.directive';
import { Tool } from '../tool/tool.enum';
import { ToolService } from '../tool/tool.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  readonly toolComponents: Type<ToolComponent>[];
  readonly toolDirectives: Type<ToolDirective>[];
  readonly toolServices: ToolService[];

  constructor(
    brushService: BrushService,
    lineService: LineService,
    pencilService: PencilService,
    rectangleService: RectangleService,
  ) {
    this.toolComponents = new Array(Tool._Len);
    this.toolDirectives = new Array(Tool._Len);
    this.toolServices = new Array(Tool._Len);

    this.toolComponents[Tool.Brush] = BrushComponent;
    this.toolDirectives[Tool.Brush] = BrushDirective;
    this.toolServices[Tool.Brush] = brushService;

    this.toolComponents[Tool.Line] = LineComponent;
    this.toolDirectives[Tool.Line] = LineDirective;
    this.toolServices[Tool.Line] = lineService;

    this.toolComponents[Tool.Pencil] = PencilComponent;
    this.toolDirectives[Tool.Pencil] = PencilDirective;
    this.toolServices[Tool.Pencil] = pencilService;

    this.toolComponents[Tool.Rectangle] = RectangleComponent;
    this.toolDirectives[Tool.Rectangle] = RectangleDirective;
    this.toolServices[Tool.Rectangle] = rectangleService;

    /*
    Shortcut.A => Tool.Aerosol | Tool.Selection
    shortcutHandlerService.set(Shortcut.E,
      () => toolSelectorService.set(Tool.Eraser));
    shortcutHandlerService.set(Shortcut.R,
      () => toolSelectorService.set(Tool.Applicator));
    shortcutHandlerService.set(Shortcut.S,
      () => toolSelectorService.set(Tool.Selection));
    shortcutHandlerService.set(Shortcut._2,
      () => toolSelectorService.set(Tool.Ellipse));
    shortcutHandlerService.set(Shortcut._3,
      () => toolSelectorService.set(Tool.Polygon));
    */
  }
}
