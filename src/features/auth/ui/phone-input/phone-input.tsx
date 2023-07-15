import { forwardRef } from 'react'
import { PatternFormat, PatternFormatProps } from 'react-number-format'

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

export const NumericFormatCustom = forwardRef<PatternFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props

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
        format="+998 (##) ###-##-##"
        mask="_"
        allowEmptyFormatting
      />
    )
  }
)
