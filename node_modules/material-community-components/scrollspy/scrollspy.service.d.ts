import { OnDestroy } from '@angular/core';
import { MccScrollspyItemDirective } from './scrollspy.directives';
import { MccScrollspyGroup } from './scrollspy';
import { Observable } from 'rxjs';
export declare class MccScrollspyService implements OnDestroy {
    private window;
    /**
     * When scroll is from click event, change this attr to true
     * So scroll event obeservable doesn't emit any update
     */
    private _fromClick;
    /**
     * List of scrollspy group
     */
    private data;
    /**
     * Scroll event subscription
     */
    private _scrollSub;
    constructor(window: any);
    ngOnDestroy(): void;
    /**
     * Update information about wich element is on focus
     * @param position number
     */
    private _updateFocused;
    /**
     * Create new group of items
     * @param name string
     * @param items MccScrollspyItemDirective[]
     * @param animation ScrollBehavior
     */
    create(name: string, items?: MccScrollspyItemDirective[], animation?: ScrollBehavior): MccScrollspyGroup;
    /**
     * Return observable of the group
     * @param name string
     */
    group(name: string): Observable<MccScrollspyItemDirective[]>;
    /**
     * Scroll to one of the items
     * @param name string
     * @param id string
     */
    scrollTo(name: string, id: string): void;
}
