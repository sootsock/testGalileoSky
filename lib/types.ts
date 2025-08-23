export type FieldType = "integer" | "decimal" | "string" | "datetime";

export type IntegerValidation = {
  required?: boolean;
  min?: number;
  max?: number;
};

export type DecimalValidation = {
  required?: boolean;
  min?: number;
  max?: number;
  decimalPlaces?: number;
};

export type StringValidation = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

export type DatetimeValidation = {
  required?: boolean;
  min?: string;
  max?: string;
};

export type FieldValidation =
  | { type: "integer"; rules: IntegerValidation }
  | { type: "decimal"; rules: DecimalValidation }
  | { type: "string"; rules: StringValidation }
  | { type: "datetime"; rules: DatetimeValidation };

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  validation: FieldValidation;
  rank: number;
}

export interface FormSchema {
  id: string;
  title: string;
  fields: FormField[];
  version: number;
}

export type FormValues = Record<string, string>;


