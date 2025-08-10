// src/components/FormRenderer/index.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store/store";
import FormField from "../Shared/FormField";
import { Container, Typography, Button } from "@mui/material";
import type { FormField as FormFieldType } from "../../models/formModels";

const FormRenderer: React.FC = () => {
  const { currentForm } = useAppSelector((s) => s.form);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const init: Record<string, any> = {};
    currentForm.fields.forEach((f: FormFieldType) => {
      if (f.defaultValue !== undefined) init[f.id] = f.defaultValue;
      else if (f.type === "checkbox") init[f.id] = false;
      else init[f.id] = "";
    });
    setValues(init);
    setErrors({});
  }, [currentForm.fields]);

  const handleFieldChange = (id: string, val: any) => {
    setValues((p) => ({ ...p, [id]: val }));
    setErrors((p) => ({ ...p, [id]: "" }));
  };

  function validateField(field: FormFieldType, value: any) {
    if (
      field.required &&
      (value === "" ||
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0))
    ) {
      return "This field is required";
    }

    if (field.validations) {
      for (const v of field.validations) {
        if (v.type === "minLength" && typeof value === "string" && value.length < Number(v.value))
          return v.message;
        if (v.type === "maxLength" && typeof value === "string" && value.length > Number(v.value))
          return v.message;
        if (v.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return v.message;
        if (v.type === "password" && value && (value.length < 8 || !/\d/.test(value))) return v.message;
      }
    }
    return "";
  }

  // Derived fields evaluation
  useEffect(() => {
    const derived = currentForm.fields.filter((f: FormFieldType) => f.isDerived);
    derived.forEach((f: FormFieldType) => {
      if (!f.derivationLogic) return;

      try {
        // Obtain expression string
        const exprStart =
          typeof f.derivationLogic === "function"
            ? f.derivationLogic(f.parentFields || [])
            : String(f.derivationLogic);

        // Replace parent field IDs with their values
        let expr = exprStart;
        (f.parentFields || []).forEach((pid: string) => {
          const val = values[pid];
          const replacement = typeof val === "string" ? `'${String(val).replace(/'/g, "\\'")}'` : JSON.stringify(val ?? "");
          expr = expr.replace(new RegExp(pid, "g"), replacement);
        });

        // Evaluate
        // eslint-disable-next-line no-eval
        const res = eval(expr);
        setValues((p) => ({ ...p, [f.id]: res }));
      } catch (e) {
        console.warn("Derived eval failed", e);
      }
    });
    // include currentForm.fields so derived logic reacts to form structure changes
  }, [values, currentForm.fields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    currentForm.fields.forEach((f: FormFieldType) => {
      const err = validateField(f, values[f.id]);
      if (err) newErrors[f.id] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted — see console for values");
      console.log("Form values", values);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {currentForm.name || "Form Preview"}
      </Typography>

      <form onSubmit={handleSubmit}>
        {currentForm.fields.map((f: FormFieldType) => (
          <div key={f.id} style={{ marginBottom: 12 }}>
            <FormField field={f} value={values[f.id]} onChange={(v) => handleFieldChange(f.id, v)} error={errors[f.id]} />
          </div>
        ))}

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default FormRenderer;
