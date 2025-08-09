import React from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import {
  List,
  ListItemButton,
  ListItemText,
  Button,
  Paper,
  Typography,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteForm } from "../../store/formSlice";

const MyForms: React.FC = () => {
  const saved = useAppSelector((s) => s.form.savedForms);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">My Forms</Typography>
        <Button variant="contained" onClick={() => navigate("/create")}>
          Create New
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        {saved.length === 0 ? (
          <Typography>No saved forms yet</Typography>
        ) : (
          <List>
            {saved.map((f) => (
              <ListItemButton
                key={f.id}
                onClick={() => navigate(`/preview/${f.id}`)}
              >
                <ListItemText
                  primary={f.name}
                  secondary={new Date(f.createdAt).toLocaleString()}
                />
                <Button
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(deleteForm(f.id));
                  }}
                >
                  Delete
                </Button>
              </ListItemButton>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default MyForms;
