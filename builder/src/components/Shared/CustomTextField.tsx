import React from 'react'
import TextField from '@mui/material/TextField'
import type { TextFieldProps } from '@mui/material/TextField'

export const CustomTextField: React.FC<TextFieldProps> = (props) => {
  return <TextField variant="outlined" fullWidth margin="normal" {...props} />
}
export default CustomTextField
