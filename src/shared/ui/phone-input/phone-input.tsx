import { forwardRef, useState } from 'react'
import { PatternFormat, PatternFormatProps } from 'react-number-format'

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  onFocus: () => void
  onBlur: () => void
  name: string
}

export const NumericFormatCustom = forwardRef<PatternFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, onFocus, onBlur, ...other } = props
    const [state, setState] = useState(false)

    const handleFocus = () => {
      onFocus()
      setState(true)
    }

    const handleBlur = () => {
      onBlur()
      setState(false)
    }

    return (
      <PatternFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          })
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        format="+998 (##) ###-##-##"
        mask="_"
        allowEmptyFormatting={state}
      />
    )
  },
)
