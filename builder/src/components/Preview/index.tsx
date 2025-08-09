import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import FormField from "../Shared/FormField";
import { Box, Typography, Button, Paper } from "@mui/material";

const Preview: React.FC = () => {
  const { id } = useParams();
  const saved = useAppSelector((s) => s.form.savedForms);
  const build = useAppSelector((s) => s.form.currentForm);
  const navigate = useNavigate();

  const form = id ? saved.find((f) => f.id === id) : undefined;
  if (!form && id) return <Typography>Form not found</Typography>;

  // reuse FormRenderer style but keep simple
  const fields = form ? form.fields : build.fields;
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">
          {form ? form.name : build.name || "Preview"}
        </Typography>
        <Button onClick={() => navigate("/create")}>Open Builder</Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        {fields.length === 0 ? (
          <Typography>No fields to preview</Typography>
        ) : (
          fields.map((f) => (
            <div key={f.id} style={{ marginBottom: 12 }}>
              <FormField field={f as any} value={""} onChange={() => {}} />
            </div>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default Preview;
