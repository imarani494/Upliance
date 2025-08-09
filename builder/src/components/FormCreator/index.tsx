import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  addField,
  updateField,
  removeField,
  reorderFields,
  setFormName,
  saveForm
} from "../../store/formSlice";
import { FieldList } from "./FieldList";
import { FieldConfigurator } from "./FieldConfigurator";
import {
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Add } from "@mui/icons-material";
import type { FieldType } from "../../models/formModels";
import CustomTextField from "../Shared/CustomTextField";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const FormCreator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector((s) => s.form);
  useLocalStorage();

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formNameInput, setFormNameInput] = useState("");

  // track additions so new field becomes selected
  const prevCount = useRef(currentForm.fields.length);
  useEffect(() => {
    if (currentForm.fields.length > prevCount.current) {
      setSelectedFieldId(currentForm.fields[currentForm.fields.length - 1].id);
    }
    prevCount.current = currentForm.fields.length;
  }, [currentForm.fields.length]);

  const selectedField =
    currentForm.fields.find((f) => f.id === selectedFieldId) ?? null;

  const handleAddField = (type: FieldType) => {
    dispatch(addField({ type }));
  };

  const handleSaveForm = () => {
    if (!formNameInput.trim()) return;
    dispatch(setFormName(formNameInput));
    dispatch(saveForm());
    setFormNameInput("");
    setSaveDialogOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Form Builder
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Add Fields</Typography>
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}
          >
            {(
              [
                "text",
                "number",
                "textarea",
                "select",
                "radio",
                "checkbox",
                "date"
              ] as FieldType[]
            ).map((type) => (
              <Button
                key={type}
                variant="outlined"
                startIcon={<Add />}
                onClick={() => handleAddField(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          <FieldList
            fields={currentForm.fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
          />

          {currentForm.fields.length > 0 && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => setSaveDialogOpen(true)}
            >
              Save Form
            </Button>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedField ? (
            <FieldConfigurator
              field={selectedField}
              onUpdate={(updates) =>
                dispatch(updateField({ id: selectedField.id, updates }))
              }
              onDelete={() => {
                dispatch(removeField(selectedField.id));
                setSelectedFieldId(null);
              }}
            />
          ) : (
            <div style={{ padding: 16 }}>
              <Typography variant="body1" color="textSecondary">
                {currentForm.fields.length === 0
                  ? "Add a field to get started"
                  : "Select a field to configure it"}
              </Typography>
            </div>
          )}
        </Grid>
      </Grid>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <CustomTextField
            label="Form name"
            value={formNameInput}
            onChange={(e) => setFormNameInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            disabled={!formNameInput.trim()}
            variant="contained"
            onClick={() => handleSaveForm()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FormCreator;
