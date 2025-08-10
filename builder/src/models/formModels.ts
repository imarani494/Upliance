
export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export type ValidationRule = {
  type: "required" | "minLength" | "maxLength" | "email" | "password";
  value?: number | string;
  message: string;
};

export interface FormField {
  id: string;
  type: FieldType;
  label: string; 
  required?: boolean;
  defaultValue?: string | number | boolean;
  options?: string[];
  validations?: ValidationRule[];
  isDerived?: boolean;
  parentFields?: string[];
  derivationLogic?: string | ((parents: string[]) => string);
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}
