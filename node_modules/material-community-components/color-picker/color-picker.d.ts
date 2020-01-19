import { InjectionToken } from '@angular/core';
/** Contant used as empty color */
export declare const EMPTY_COLOR: InjectionToken<string>;
/** Constante to set usedColorStart from the module import */
export declare const USED_COLORS: InjectionToken<string[]>;
/**
 *
 */
export interface ColorPickerConfig {
    empty_color?: string;
    used_colors?: string[];
}
/**
 * This interface represents one color. Using this interface instead simple string
 * will help screen readers, because the text attribute ir set to the aria-label of
 * the option
 */
export interface MccColorPickerItem {
    text: string;
    value: string;
}
export declare type MccColorPickerOption = string | MccColorPickerItem;
/**
 * Verify if color has # as a first char. If not, add this char
 * to the color
 * @param color string
 */
export declare function coerceHexaColor(color: string): string;
/**
 * Validate if the color is valid
 * @param color string
 */
export declare function isValidColor(color: string): boolean;
