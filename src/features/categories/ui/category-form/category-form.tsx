import { Error } from '@/shared/http'
import { formErrors } from '@/shared/utils/form-errors'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  AlertTitle,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  TextField,
} from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FormInputs } from './initial-data'

interface CategoryFormProps {
  error: string
  submit: (body: FormInputs) => Promise<unknown>
  initialData: FormInputs
  onCancel: () => void
  submitTitle: string
}

export const CategoryForm = (props: CategoryFormProps) => {
  const { error, initialData, onCancel, submit, submitTitle } = props

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormInputs>({
    defaultValues: initialData,
    values: initialData,
  })

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await submit(data)
      reset(initialData)
    } catch (error) {
      const err = error as Error
      if (err.errors) {
        const errors = formErrors(err.errors)

        errors.forEach((value, key) => {
          setError(key, { message: value.join(',') })
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        {error && (
          <Alert variant="filled" severity="error" className="mb-5">
            <AlertTitle>Ошибка</AlertTitle>
            {error}
          </Alert>
        )}

        <Controller
          name="name"
          rules={{ required: 'Обязательное поле' }}
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <TextField
                autoFocus
                label="Название *"
                variant="outlined"
                error={!!errors.name}
                {...field}
              />
              {errors.name &&
                errors.name.message?.split(',').map((text) => (
                  <FormHelperText key={text} error>
                    {text}
                  </FormHelperText>
                ))}
            </FormControl>
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button disabled={isSubmitting} onClick={onCancel} variant="outlined">
          Отмена
        </Button>
        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
          {submitTitle}
        </LoadingButton>
      </DialogActions>
    </form>
  )
}
