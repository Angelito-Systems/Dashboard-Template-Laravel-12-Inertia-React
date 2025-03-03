import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Function to capitalize the first letter of a string
 * @param string
 * @returns
 */
export function capitalize_first_letter(string: string) {
    const text = string.split('_').join(' ');
    const transformed = text
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ');
    return transformed;
}

/**
 * Function to capitalize a string
 * @param string
 * @returns
 */
export function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
