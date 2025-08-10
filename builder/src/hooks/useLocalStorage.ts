import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setSavedForms } from "../store/formSlice";
import type { FormSchema } from "../models/formModels";

const STORAGE_KEY = "formBuilderSavedForms";

export const useLocalStorage = () => {
  const dispatch = useAppDispatch();
  const savedForms = useAppSelector((s) => s.form.savedForms);

 
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as FormSchema[];
      dispatch(setSavedForms(parsed));
    } catch (e) {
      console.error("Failed to load saved forms", e);
    }
  }, [dispatch]);

  
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedForms));
    } catch (e) {
      console.error("Failed to save forms to localStorage", e);
    }
  }, [savedForms]);

  return {};
};
