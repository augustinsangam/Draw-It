import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { OverlayService } from 'src/app/overlay/overlay.service';
import { DocEnum } from 'src/app/overlay/pages/documentation/doc-enum';
import { Point } from 'src/app/tool/shape/common/point';
import { ColorService } from '../../../color/color.service';
import { ToolPanelDirective } from '../../../tool-panel/tool-panel.directive';
import { AerosolService } from '../aerosol.service';

@Component({
  selector: 'app-aerosol-panel',
  templateUrl: './aerosol-panel.component.html',
  styleUrls: ['./aerosol-panel.component.scss']
})

export class AerosolPanelComponent extends ToolPanelDirective
  implements AfterViewInit {

  // tslint:disable-next-line: no-magic-numbers
  private static readonly PREVIEW_CENTER: Point = new Point(150, 110);

  @ViewChild('thicknessSlider', {
    static: false,
  }) private thicknessSlider: MatSlider;

  @ViewChild('frequencySlider', {
    static: false,
  }) private frequencySlider: MatSlider;

  @ViewChild('prevPath', {
    static: false,
  }) private prevPathRef: ElementRef<SVGPathElement>;

  readonly AerosolService: typeof AerosolService = AerosolService;

  private aerosolForm: FormGroup;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private readonly service: AerosolService,
    protected readonly colorService: ColorService,
    private readonly formBuilder: FormBuilder,
    private overlay: OverlayService,
    private renderer: Renderer2) {
    super(elementRef);
    this.aerosolForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
      frequencyFormField: [this.service.frequency, [Validators.required]],
      frequencySlider: [this.service.frequency, []],
    });
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateThumbnail();
  }

  protected onThicknessChange(): void {
    this.aerosolForm.patchValue({
      thicknessFormField: this.thicknessSlider.value
    });
    this.service.thickness = this.thicknessSlider.value as number;
    this.updateThumbnail();
  }

  protected onFrequencyChange(): void {
    this.aerosolForm.patchValue({
      frequencyFormField: this.frequencySlider.value
    });
    this.service.frequency = this.frequencySlider.value as number;
    this.updateThumbnail();
  }

  protected updateThumbnail(): void {
    let preview = '';
    for (let i = 0; i < this.service.frequency; i++) {
      preview += this.service.generatePoints(
        new Point(
          AerosolPanelComponent.PREVIEW_CENTER.x,
          AerosolPanelComponent.PREVIEW_CENTER.y
        )
      );
    }
    this.renderer.setAttribute(
      this.prevPathRef.nativeElement,
      'd',
      preview
    );
  }

  protected showDocumentation(): void {
    this.overlay.openDocumentationDialog(false, DocEnum.AEROSOL);
  }
}
