import React from 'react'
import type { FormField as FormFieldType } from '../../models/formModels'
import { CustomTextField } from './CustomTextField'
import { Checkbox, FormControlLabel, MenuItem } from '@mui/material'

interface Props {
  field: FormFieldType
  value: any
  onChange: (value: any) => void
  error?: string
}

export const FormField: React.FC<Props> = ({ field, value, onChange, error }) => {
  const handleChange = (e: any) => {
    if (field.type === 'checkbox') return onChange(e.target.checked)
    if (field.type === 'number') return onChange(e.target.value === '' ? '' : Number(e.target.value))
    return onChange(e.target.value)
  }

  if (field.type === 'textarea') {
    return (
      <CustomTextField
        multiline
        minRows={3}
        label={field.label}
        value={value ?? ''}
        onChange={handleChange}
        helperText={error}
        required={field.required}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <CustomTextField select label={field.label} value={value ?? ''} onChange={handleChange} helperText={error} required={field.required}>
        {field.options?.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </CustomTextField>
    )
  }

  if (field.type === 'radio') {
    return (
      <div>
        <div style={{ marginBottom: 6 }}>{field.label}{field.required ? ' *' : ''}</div>
        {field.options?.map((opt) => (
          <label style={{ display: 'block' }} key={opt}>
            <input type="radio" name={field.id} value={opt} checked={value === opt} onChange={handleChange} /> {opt}
          </label>
        ))}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    )
  }

  if (field.type === 'checkbox') {
    return <FormControlLabel control={<Checkbox checked={!!value} onChange={handleChange} />} label={field.label} />
  }

  // text, number, date
  return <CustomTextField type={field.type as any} label={field.label} value={value ?? ''} onChange={handleChange} helperText={error} required={field.required} />
}

export default FormField
