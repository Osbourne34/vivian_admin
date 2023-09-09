import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'

type ComboBoxProps<T extends Object> = {
  options: T[]
  labelKey: keyof T
  onChange: (event: any, value: T | null) => void
  refetch: () => void
  isLoading: boolean
  label: string
}

export function ComboBox<T extends Object>({
  isLoading,
  label,
  labelKey,
  onChange,
  options = [],
  refetch,
}: ComboBoxProps<T>) {
  const [opened, setOpened] = useState(false)

  const handleOpen = () => {
    if (!opened) {
      refetch()
      setOpened(true)
    }
  }

  return (
    <Autocomplete
      onChange={onChange}
      onOpen={handleOpen}
      options={options}
      getOptionLabel={(option) => String(option[labelKey])}
      noOptionsText={'Ничего не найдено'}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          size="small"
        />
      )}
    />
  )
}
