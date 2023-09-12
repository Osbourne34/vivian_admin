import { useQuery } from '@tanstack/react-query'
import { BranchesService } from '../../service/branches-service'
import {
  Alert,
  AlertTitle,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FormInputs } from './initial-data'
import { LoadingButton } from '@mui/lab'
import { Error } from '@/shared/http'
import { formErrors } from '@/shared/utils/form-errors'

interface BranchFormProps {
  error: string
  submit: (body: FormInputs) => Promise<unknown>
  initialData: FormInputs
  onCancel: () => void
  submitTitle: string
}

export const BranchForm = (props: BranchFormProps) => {
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

  const { data: branches } = useQuery({
    queryFn: BranchesService.getTreeBranches,
    queryKey: ['branches-form'],
  })

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

        <FormControl fullWidth className="mt-5" error={!!errors.parent_id}>
          <InputLabel>Родительский регион</InputLabel>
          <Controller
            name="parent_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Родительский регион"
                {...field}
                onChange={(event) => field.onChange(event.target.value)}
              >
                {branches?.data.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.parent_id &&
            errors.parent_id.message?.split(',').map((text) => (
              <FormHelperText key={text} error>
                {text}
              </FormHelperText>
            ))}
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={isSubmitting} variant="outlined">
          Отмена
        </Button>
        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
          {submitTitle}
        </LoadingButton>
      </DialogActions>
    </form>
  )
}