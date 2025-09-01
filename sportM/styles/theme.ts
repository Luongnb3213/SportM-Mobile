// styles/theme.ts
export type ThemePalette = {
  foreground: string;   // màu chữ/icon chính
  background: string;   // nền chung của app
  card: string;         // nền thẻ / surface
  border: string;       // viền nhạt
  muted: string;        // chữ phụ / placeholder
  primary: string;      // màu thương hiệu chính
  accent: string;       // điểm nhấn (vd: số trang banner)
};

export const theme: { light: ThemePalette; dark: ThemePalette } = {
  light: {
    foreground: "#0a0a0a",
    background: "#ffffff",
    card: "#ffffff",
    border: "#e5e7eb",   // slate-200
    muted: "#6b7280",    // slate-500
    primary: "#4D8A43",
    accent: "#ffd60a",
  },
  dark: {
    foreground: "#e5e7eb", // slate-200
    background: "#0b0f0b", // tối nhưng không đen tuyệt đối
    card: "#111827",       // slate-900-ish
    border: "#1f2937",     // slate-800
    muted: "#9ca3af",      // slate-400
    primary: "#4D8A43",
    accent: "#ffd60a",
  },
};

// Hook tiện dụng để lấy palette theo hệ thống
import { useColorScheme } from "react-native";
export function useAppTheme(): ThemePalette {
  const scheme = useColorScheme();
  return scheme === "dark" ? theme.dark : theme.light;
}
