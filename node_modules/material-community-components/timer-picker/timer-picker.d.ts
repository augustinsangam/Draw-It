export declare type MccTimerPickerHour = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
export declare type MccTimerPickerMinute = '00' | '05' | '10' | '15' | '20' | '25' | '30' | '35' | '40' | '45' | '50' | '55';
/**
 * format 12 return hours with 'am' or 'pm'. Examples:
 * 12:00 am
 * 3:00 pm
 * 5:35 pm
 *
 * format 24 return hours in 24h period. Examples:
 * 12:00
 * 15:00
 * 17:35
 */
export declare type MccTimerPickerFormat = '12' | '24';
export declare type MccTimerPickerPeriod = 'am' | 'pm';
export declare type MccTimerPickerTimeType = 'hour' | 'min';
/**
 * contants to create timer with HOURS or MINUTES
 */
export declare const HOURS: string[];
export declare const MINUTES: string[];
