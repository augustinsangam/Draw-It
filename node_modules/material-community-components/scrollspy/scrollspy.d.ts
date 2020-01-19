import { MccScrollspyItemDirective } from './scrollspy.directives';
import { BehaviorSubject } from 'rxjs';
export declare const SCROLLSPY_ANIMATION_SMOOTH = "smooth";
export declare const SCROLLSPY_ANIMATION_INSTANT = "instant";
export declare const SCROLLSPY_ANIMATION_AUTO = "auto";
/**
 * Scrollspy group
 */
export interface MccScrollspyGroup {
    name: string;
    animation: ScrollBehavior;
    items: BehaviorSubject<MccScrollspyItemDirective[]>;
}
