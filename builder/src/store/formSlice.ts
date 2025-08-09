import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FieldType, FormField, FormSchema } from "../models/formModels";

interface FormState {
  currentForm: {
    name: string;
    fields: FormField[];
  };
  savedForms: FormSchema[];
}

const initialState: FormState = {
  currentForm: { name: "", fields: [] },
  savedForms: []
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<{ type: FieldType }>) => {
      const fieldType = action.payload.type;
      const newField: FormField = {
        id: `field-${Date.now()}`,
        type: fieldType,
        label: `${
          fieldType.charAt(0).toUpperCase() + fieldType.slice(1)
        } Field`,
        required: false
      };
      if (fieldType === "select" || fieldType === "radio") {
        newField.options = ["Option 1", "Option 2"];
      }
      state.currentForm.fields.push(newField);
    },
    updateField: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<FormField> }>
    ) => {
      const { id, updates } = action.payload;
      const idx = state.currentForm.fields.findIndex((f) => f.id === id);
      if (idx !== -1) {
        state.currentForm.fields[idx] = {
          ...state.currentForm.fields[idx],
          ...updates
        };
      }
    },
    removeField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(
        (f) => f.id !== action.payload
      );
    },
    reorderFields: (
      state,
      action: PayloadAction<{ startIndex: number; endIndex: number }>
    ) => {
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.currentForm.fields);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      state.currentForm.fields = result;
    },
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    saveForm: (state) => {
      if (!state.currentForm.name.trim()) return;
      const newForm: FormSchema = {
        id: `form-${Date.now()}`,
        name: state.currentForm.name,
        createdAt: new Date().toISOString(),
        fields: [...state.currentForm.fields]
      };
      state.savedForms.push(newForm);
      state.currentForm = { name: "", fields: [] };
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find((f) => f.id === action.payload);
      if (form)
        state.currentForm = { name: form.name, fields: [...form.fields] };
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(
        (f) => f.id !== action.payload
      );
    },
    setSavedForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.savedForms = action.payload;
    },
    resetCurrentForm: (state) => {
      state.currentForm = { name: "", fields: [] };
    }
  }
});

export const {
  addField,
  updateField,
  removeField,
  reorderFields,
  setFormName,
  saveForm,
  loadForm,
  deleteForm,
  setSavedForms,
  resetCurrentForm
} = formSlice.actions;

export default formSlice.reducer;
