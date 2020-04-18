import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatSlider} from '@angular/material/slider';
import { OverlayService } from 'src/app/overlay/overlay.service';
import { DocEnum } from 'src/app/overlay/pages/documentation/doc-enum';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';
import {GridService} from '../grid.service';

@Component({
  selector: 'app-grid-panel',
  templateUrl: './grid-panel.component.html',
  styleUrls: ['./grid-panel.component.scss']
})

export class GridPanelComponent extends ToolPanelDirective {

  @ViewChild('activeToggle', {
    static: false,
    read: MatSlideToggle
  }) private activeToggleRef: MatSlideToggle;

  @ViewChild('squareSizeSlider', {
    static: false,
  }) private squareSizeSlider: MatSlider;

  @ViewChild('opacitySlider', {
    static: false,
  }) private opacitySlider: MatSlider;

  readonly GridService: typeof GridService = GridService;

  private gridForm: FormGroup;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private readonly formBuilder: FormBuilder,
    private readonly service: GridService,
    private overlay: OverlayService
  ) {
    super(elementRef);
    this.gridForm = this.formBuilder.group({
      activeToggleForm: [this.service.active, []],
      squareSizeFormField: [this.service.squareSize, [Validators.required]],
      squareSizeSlider: [this.service.squareSize, []],
      opacityFormField: [this.service.opacity, [Validators.required]],
      opacitySlider: [this.service.opacity, []],
    });
  }

  protected onSquareSizeChange(): void {
    this.gridForm.patchValue({
      squareSizeFormField: this.squareSizeSlider.value
    });
    this.service.squareSize = this.squareSizeSlider.value as number;
    this.service.handleGrid();
  }

  protected onOpacityChange(): void {
    this.gridForm.patchValue({
      opacityFormField: this.opacitySlider.value
    });
    this.service.opacity = this.opacitySlider.value as number;
    this.service.handleGrid();
  }

  protected onActiveChange(): void {
    this.gridForm.patchValue({
      activeToggleForm: this.activeToggleRef.checked
    });
    this.service.active = this.activeToggleRef.checked;
    this.service.handleGrid();
  }

  protected showDocumentation(): void {
    this.overlay.openDocumentationDialog(false, DocEnum.GRID);
  }

}
