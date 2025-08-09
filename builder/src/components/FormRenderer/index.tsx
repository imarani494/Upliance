import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store/store";
import FormField from "../Shared/FormField";
import { Container, Typography, Button } from "@mui/material";

const FormRenderer: React.FC = () => {
  const { currentForm } = useAppSelector((s) => s.form);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const init: Record<string, any> = {};
    currentForm.fields.forEach((f) => {
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

  function validateField(field: any, value: any) {
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
        if (
          v.type === "minLength" &&
          typeof value === "string" &&
          value.length < Number(v.value)
        )
          return v.message;
        if (
          v.type === "maxLength" &&
          typeof value === "string" &&
          value.length > Number(v.value)
        )
          return v.message;
        if (
          v.type === "email" &&
          value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        )
          return v.message;
        if (
          v.type === "password" &&
          value &&
          (value.length < 8 || !/\d/.test(value))
        )
          return v.message;
      }
    }
    return "";
  }

  // derived fields evaluation
  useEffect(() => {
    const derived = currentForm.fields.filter((f) => f.isDerived);
    derived.forEach((f) => {
      if (!f.derivationLogic) return;
      try {
        let expr = f.derivationLogic(f.parentFields || []).forEach((pid) => {
          const val = values[pid];
          const replacement =
            typeof val === "string"
              ? `'${String(val).replace(/'/g, "\\'")}'`
              : JSON.stringify(val ?? "");
          expr = expr.replace(new RegExp(pid, "g"), replacement);
        });
        // Note: eval used for simplicity; in production prefer safe parser
        // eslint-disable-next-line no-eval
        const res = eval(expr);
        setValues((p) => ({ ...p, [f.id]: res }));
      } catch (e) {
        console.warn("Derived eval failed", e);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    currentForm.fields.forEach((f) => {
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
        {currentForm.fields.map((f) => (
          <div key={f.id} style={{ marginBottom: 12 }}>
            <FormField
              field={f}
              value={values[f.id]}
              onChange={(v) => handleFieldChange(f.id, v)}
              error={errors[f.id]}
            />
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
