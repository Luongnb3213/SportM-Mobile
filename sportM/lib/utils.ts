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

type RawSlot = {
  id: string;
  start: string; // "18:00"
  end: string;   // "19:00"
  locked: boolean;
};

type UiSlot = {
  id: string;    // "pm_slot-0600-0700" | "am_slot-0500-0600"
  label: string; // "06:00 - 07:00"
  locked: boolean;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const toMorningTime = (hh: number, mm: number) => {
  let h12 = hh % 12;         // 13→1 … 23→11, 12→0
  if (h12 === 0) h12 = 12;   // 12 PM -> 12
  return `${pad2(h12)}:${pad2(mm)}`;
};

export function transformSlots(slots: RawSlot[]): UiSlot[] {
  const mapped = slots
    .map(({ start, end, locked }) => {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);

      // ❌ Ẩn đúng khung 12:00 → 13:00
      if (sh === 12) return null;

      const isPM = sh >= 12;

      const labelStart = isPM ? toMorningTime(sh, sm) : start;
      const labelEnd = isPM ? toMorningTime(eh, em) : end;

      const idTime = `${labelStart.replace(":", "")}-${labelEnd.replace(":", "")}`;
      const newId = `${isPM ? "pm" : "am"}_slot-${idTime}`;

      // Dùng sortHour 1..11 cho cả AM/PM (AM trước, rồi PM)
      const sortHour = isPM ? (sh === 12 ? 12 : sh - 12) : sh; // AM giữ nguyên 1..11

      return {
        id: newId,
        label: `${labelStart} - ${labelEnd}`,
        locked,
        isPM,
        sortHour,
      };
    })
    .filter(Boolean) as (UiSlot & { isPM: boolean; sortHour: number })[];

  // AM trước PM, và trong mỗi nhóm: 01 → 11
  mapped.sort((a, b) => {
    if (a.isPM !== b.isPM) return a.isPM ? 1 : -1;
    return a.sortHour - b.sortHour;
  });

  // Bỏ field phụ
  return mapped.map(({ id, label, locked }) => ({ id, label, locked }));
}

export const apiSlotIdToFixedTimeSlotId = (apiTimeSlotId: string): { fixedId: string; type: 'am' | 'pm' } | null => {
  const [startHourStr] = apiTimeSlotId.split('-');
  const startHour = parseInt(startHourStr.substring(0, 2), 10);

  let mappedHour = startHour;
  let type: 'am' | 'pm';

  if (startHour >= 1 && startHour <= 12) {
    type = 'am';
    //mappedHour = startHour; // Giữ nguyên giờ sáng
  } else if (startHour >= 13 && startHour <= 23) {
    type = 'pm';
    mappedHour = startHour - 12;
  } else {

    return null;
  }

  if (mappedHour >= 1 && mappedHour <= 11) {
    const mappedStartId = String(mappedHour).padStart(2, '0') + '00';
    const mappedEndId = String(mappedHour + 1).padStart(2, '0') + '00';
    return { fixedId: `${mappedStartId}-${mappedEndId}`, type: type };
  }
  return null;
};

export const processApiLockedSlots = (apiSlots: any[]) => {
  const lockedKeys = new Set<string>();
  apiSlots.forEach(apiSlot => {
    if (apiSlot.locked) {
      const rawTimeSlotId = apiSlot.id.replace('slot-', '');

      const mappingResult = apiSlotIdToFixedTimeSlotId(rawTimeSlotId);

      if (mappingResult) {
        const { fixedId, type } = mappingResult;
        lockedKeys.add(`${type}_slot-${fixedId}`);
      } else {
        console.warn(`Could not map API slot ID: ${rawTimeSlotId} to a fixed time slot or determine its type.`);
      }
    }
  });
  return lockedKeys;
};

export const fixedTimeSlotIdToApiTimeSlotId = (timeSlotId: string, courtId: 'am' | 'pm'): string | null => {
  const [startHourStr] = timeSlotId.split('-');
  const startHour = parseInt(startHourStr.substring(0, 2), 10);

  let apiStartHour = startHour;

  if (courtId === 'pm') {
    apiStartHour = startHour + 12;
  }

  const apiEndHour = apiStartHour + 1;


  const formattedStartId = String(apiStartHour).padStart(2, '0') + '00';
  const formattedEndId = String(apiEndHour).padStart(2, '0') + '00';

  return `slot-${formattedStartId}-${formattedEndId}`;
};