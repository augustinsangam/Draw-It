import { Observable } from 'rxjs';
export declare class MccColorPickerService {
    private emptyColor;
    private usedColors;
    /**
     * Array of all used colors
     */
    private _colors;
    constructor(emptyColor: string, usedColors: string[]);
    /**
     * Add new color to used colors
     * @param color string
     */
    addColor(color: string): void;
    /**
     * Return Observable of colors
     */
    getColors(): Observable<string[]>;
    /**
     * Reset the array of used colors
     */
    resetUseColors(): void;
}
