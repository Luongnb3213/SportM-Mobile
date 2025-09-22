export type Court = { id: string; name: string };
export type Slot = { id: string; label: string; locked?: boolean };
export type Day = {
  id: string;
  thu: string;
  day: string;
  suffix: string;
  isActive?: boolean;
};
