import { AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { MccTimerPickerComponent } from './timer-picker.component';
import { BehaviorSubject } from 'rxjs';
export declare class MccTimerPickerOriginDirective {
    elementRef: ElementRef;
    private renderer;
    /**
     * Emit changes from the origin
     */
    change: BehaviorSubject<string>;
    /**
     * Emit changes from the origin
     */
    hasFocus: BehaviorSubject<boolean>;
    /**
     * Propagate changes to angular
     */
    propagateChanges: (_: any) => {};
    /**
     * Reference to the element on which the directive is applied.
     */
    constructor(elementRef: ElementRef, renderer: Renderer2);
    /**
     * This method will be called by the forms API to write to the view when
     * programmatic (model -> view) changes are requested.
     */
    writeValue(time: string): void;
    /**
     * This method will be called by the time picker
     */
    writeValueFromTimerPicker(time: string): void;
    /**
     * This method will be called from origin whe key is up
     */
    writeValueFromKeyup(time: string): void;
    /**
     * This is called by the forms API on initialization so it can update the
     * form model when values propagate from the view (view -> model).
     * @param fn any
     */
    registerOnChange(fn: any): void;
    /**
     * This is called by the forms API on initialization so it can update the form model on blur
     * @param fn any
     */
    registerOnTouched(fn: any): void;
    /**
     * called by the forms API when the control status changes to or from "DISABLED"
     * @param isDisabled boolean
     */
    setDisabledState(isDisabled: boolean): void;
}
export declare class MccConnectedTimerPickerDirective implements AfterViewInit, OnDestroy {
    private timerPicker;
    changeDetectorRef: ChangeDetectorRef;
    /**
     * origin of the connected timer picker
     */
    origin: MccTimerPickerOriginDirective;
    /**
     * subscription of the origin focus observable
     */
    private _originFocus;
    /**
     * subscription of the timer picker selected change
     */
    private _timerPickerSub;
    constructor(timerPicker: MccTimerPickerComponent, changeDetectorRef: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Attach the timer picker to origin element (input)
     */
    private _attachTimerPicker;
}
