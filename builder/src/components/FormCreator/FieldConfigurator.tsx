import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import type { FormField } from "../../models/formModels";
import CustomTextField from "../Shared/CustomTextField";

interface Props {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
}

export const FieldConfigurator: React.FC<Props> = ({
  field,
  onUpdate,
  onDelete
}) => {
  const [newOption, setNewOption] = useState("");
  const [newValidation, setNewValidation] = useState({
    type: "required",
    value: "",
    message: "This field is required"
  });

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    onUpdate({ options: [...(field.options || []), newOption.trim()] });
    setNewOption("");
  };

  const handleRemoveOption = (option: string) => {
    onUpdate({ options: field.options?.filter((o) => o !== option) });
  };

  const handleAddValidation = () => {
    if (!newValidation.message.trim()) return;
    onUpdate({
      validations: [...(field.validations || []), { ...newValidation } as any]
    });
    setNewValidation({
      type: "required",
      value: "",
      message: "This field is required"
    });
  };

  const handleRemoveValidation = (index: number) => {
    onUpdate({ validations: field.validations?.filter((_, i) => i !== index) });
  };

  const handleToggleDerived = (isDerived: boolean) => {
    if (!isDerived) {
      onUpdate({ isDerived: false, parentFields: [], derivationLogic: "" });
    } else {
      onUpdate({ isDerived: true });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configure Field
      </Typography>

      <CustomTextField
        label="Field Label"
        value={field.label}
        onChange={(e) => onUpdate({ label: e.target.value })}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
          />
        }
        label="Required"
      />

      {["text", "number", "date"].includes(field.type) && (
        <CustomTextField
          label="Default Value"
          value={field.defaultValue ?? ""}
          onChange={(e) => onUpdate({ defaultValue: e.target.value })}
        />
      )}

      {(field.type === "select" || field.type === "radio") && (
        <Box mt={2}>
          <Typography variant="subtitle1">Options</Typography>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <CustomTextField
              placeholder="New option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
            <Button variant="outlined" onClick={handleAddOption}>
              Add
            </Button>
          </div>
          <Box mt={1}>
            {field.options?.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                onDelete={() => handleRemoveOption(opt)}
                style={{ margin: 4 }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box mt={2}>
        <Typography variant="subtitle1">Validations</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={newValidation.type}
                label="Type"
                onChange={(e) =>
                  setNewValidation({
                    ...newValidation,
                    type: e.target.value as any
                  })
                }
              >
                <MenuItem value="required">Required</MenuItem>
                <MenuItem value="minLength">Min Length</MenuItem>
                <MenuItem value="maxLength">Max Length</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="password">Password</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {["minLength", "maxLength"].includes(newValidation.type) && (
            <Grid item xs={3}>
              <CustomTextField
                type="number"
                label="Value"
                value={newValidation.value}
                onChange={(e) =>
                  setNewValidation({ ...newValidation, value: e.target.value })
                }
              />
            </Grid>
          )}

          <Grid item xs={5}>
            <CustomTextField
              label="Error message"
              value={newValidation.message}
              onChange={(e) =>
                setNewValidation({ ...newValidation, message: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={handleAddValidation}
              sx={{ mt: 1 }}
            >
              Add validation
            </Button>
          </Grid>
        </Grid>

        <Box mt={1}>
          {field.validations?.map((v, idx) => (
            <Chip
              key={idx}
              label={`${v.type}: ${v.message}`}
              onDelete={() => handleRemoveValidation(idx)}
              style={{ margin: 4 }}
            />
          ))}
        </Box>
      </Box>

      <Box mt={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={!!field.isDerived}
              onChange={(e) => handleToggleDerived(e.target.checked)}
            />
          }
          label="Derived Field"
        />
        {field.isDerived && (
          <Box mt={1}>
            <CustomTextField
              label="Derivation logic (JS expression)"
              value={field.derivationLogic ?? ""}
              onChange={(e) => onUpdate({ derivationLogic: e.target.value })}
              placeholder="Example: parent1 + ' ' + parent2"
            />
            <Typography variant="caption">
              Use parent field IDs in the expression; they'll be replaced with
              their values when previewing.
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Button variant="contained" color="error" onClick={onDelete}>
        Delete Field
      </Button>
    </Box>
  );
};

export default FieldConfigurator;
