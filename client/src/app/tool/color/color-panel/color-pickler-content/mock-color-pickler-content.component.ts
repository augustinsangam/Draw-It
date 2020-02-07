import { Component, ElementRef, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { ColorPicklerItemComponent } from '../color-pickler-item/color-pickler-item.component';

@Component({
    selector: 'app-color-pickler-content',
    template: '',
})
export class MockColorPicklerContentComponent {

    @Input()
    startColor: string;

    @Output()
    colorChange = new EventEmitter();

    baseColors = [];

    canvas: ElementRef;

    actualColor: ColorPicklerItemComponent;

    baseColorsCircles: QueryList<ColorPicklerItemComponent>;

    context: CanvasRenderingContext2D;

    colorForm: FormGroup;

    static ValidatorHex(formControl: AbstractControl) { }

    static ValidatorInteger(formControl: AbstractControl) { }

    constructor() { }

    initialiseStartingColor() { }

    buildCanvas(redValue: number) { }

    onSlide($event: MatSliderChange) { }

    placeSlider(value: number) { }

    onChangeR($event: Event) { }

    onChangeG($event: Event) { }

    onChangeB($event: Event) { }

    onChangeA($event: Event) { }

    onChangeHex($event: Event) { }

    drawTracker(blue: number, green: number) { }

    reDrawTracker() { }

    updateHex() { }

    getActualRgba() { }

    onConfirm() { }

}
