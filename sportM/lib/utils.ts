import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios, { AxiosError } from 'axios';
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

export function getErrorMessage(error: unknown): string {
  // Axios error
  if (axios.isAxiosError(error)) {
    const res = error.response;
    // Các dạng payload phổ biến
    const msg =
      (res?.data as any)?.message ||
      (res?.data as any)?.error ||
      (res?.data as any)?.msg;

    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) return msg.join('; ');
    if (error.code === 'ECONNABORTED') return 'Yêu cầu quá thời gian. Vui lòng thử lại.';
    if (!res) return 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.';

    return `Lỗi ${res.status}`;
  }

  if (error instanceof Error) return error.message;
  return 'Đã xảy ra lỗi không xác định.';
}

export function toAmPm(isoString: any) {
  const date = new Date(isoString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const mm = minutes.toString().padStart(2, "0");
  return `${h12}:${mm} ${ampm}`;
}