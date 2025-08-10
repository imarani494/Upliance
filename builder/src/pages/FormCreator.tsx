
import { useAppDispatch, useAppSelector } from "../store/store";
import { addField } from "../store/formSlice";
import type { FieldType, FormField } from "../models/formModels";

export default function FormCreator() {
  const dispatch = useAppDispatch();
  const fields = useAppSelector(
    (state) => state.form.currentForm.fields as FormField[]
  );

  const handleAddField = (type: FieldType) => {
    dispatch(addField({ type }));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Form Creator</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => handleAddField("text")}>Add Text</button>
        <button onClick={() => handleAddField("number")}>Add Number</button>
        <button onClick={() => handleAddField("textarea")}>Add Textarea</button>
        <button onClick={() => handleAddField("select")}>Add Select</button>
        <button onClick={() => handleAddField("radio")}>Add Radio</button>
        <button onClick={() => handleAddField("checkbox")}>Add Checkbox</button>
        <button onClick={() => handleAddField("date")}>Add Date</button>
      </div>

      <ul>
        {fields.map((field: FormField) => (
          <li key={field.id}>
            {field.label} ({field.type})
          </li>
        ))}
      </ul>
    </div>
  );
}
