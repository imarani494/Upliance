import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Typography
} from "@mui/material";
import { DragIndicator, Delete } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { useAppDispatch } from "../../store/store";
import { reorderFields, removeField } from "../../store/formSlice";

interface Props {
  fields: any[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
}

export const FieldList: React.FC<Props> = ({
  fields,
  selectedFieldId,
  onSelectField
}) => {
  const dispatch = useAppDispatch();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    dispatch(
      reorderFields({
        startIndex: result.source.index,
        endIndex: result.destination.index
      })
    );
  };

  return (
    <div style={{ marginTop: 16 }}>
      <Typography variant="h6">Form Fields</Typography>
      {fields.length === 0 ? (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          No fields added yet
        </Typography>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={field.id}
                    index={index}
                  >
                    {(prov) => (
                      <ListItem
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        button
                        selected={selectedFieldId === field.id}
                        onClick={() => onSelectField(field.id)}
                      >
                        <div
                          {...prov.dragHandleProps}
                          style={{ display: "inline-flex", marginRight: 12 }}
                        >
                          <DragIndicator />
                        </div>
                        <ListItemText
                          primary={field.label}
                          secondary={field.type}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => dispatch(removeField(field.id))}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default FieldList;
