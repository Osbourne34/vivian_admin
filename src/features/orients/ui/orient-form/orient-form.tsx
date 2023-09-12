import {
  Alert,
  AlertTitle,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { OrientsService } from '../../service/orients-service'
import { useQuery } from '@tanstack/react-query'
import { FormInputs } from './initial-data'
import { formErrors } from '@/shared/utils/form-errors'
import { Error } from '@/shared/http'
import { LoadingButton } from '@mui/lab'
import { branchesSort } from '@/shared/utils/branches-sort'

interface OrientFormProps {
  error: string
  submit: (body: FormInputs) => Promise<unknown>
  initialData: FormInputs
  onCancel: () => void
  submitTitle: string
}

export const OrientForm = (props: OrientFormProps) => {
  const { error, submit, initialData, onCancel, submitTitle } = props

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

  const { data: branches } = useQuery(
    ['branches'],
    () => OrientsService.getBranches(),
    {
      select: (data) => {
        const result = branchesSort(data.data)

        return {
          data: result,
          status: data.status,
        }
      },
    },
  )

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

        <FormControl fullWidth className="mt-5" error={!!errors.branch_id}>
          <InputLabel>Регион</InputLabel>
          <Controller
            name="branch_id"
            rules={{ required: 'Обязательное поле' }}
            control={control}
            render={({ field }) => (
              <Select
                label="Регион"
                {...field}
                onChange={(event) => field.onChange(event.target.value)}
              >
                {branches?.data.map(({ id, name, parent_id, parent_name }) => {
                  if (parent_id === 0 && !parent_name) {
                    return <ListSubheader key={id}>{name}</ListSubheader>
                  }
                  return (
                    <MenuItem key={id} value={id} className="pl-8">
                      {name}
                    </MenuItem>
                  )
                })}
              </Select>
            )}
          />
          {errors.branch_id &&
            errors.branch_id.message?.split(',').map((text) => (
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
