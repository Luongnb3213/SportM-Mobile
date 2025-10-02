import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility for merging Tailwind CSS classes without style conflicts.
 * Can be used with or without NativeWind.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPriceVND = (input: number | string, isTrunc = true) => {
  if (!input) return '';
  input = isTrunc ? Math.trunc(Number(input)) : input;
  return input
    .toString()
    .replace(/,/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};