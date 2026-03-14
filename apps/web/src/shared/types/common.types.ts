export type Currency = "VND" | "USD";
export type UserRole = "ADMIN" | "USER";

export interface SelectOption<TValue extends string = string> {
  label: string;
  value: TValue;
}
