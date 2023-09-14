import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FormInputs } from './initial-data'
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
import { Error } from '@/shared/http'
import { formErrors } from '@/shared/utils/form-errors'
import { useQuery } from '@tanstack/react-query'
import { RolesService } from '../../service/roles-service'
import { LoadingButton } from '@mui/lab'

interface RoleFormProps {
  error: string
  submit: (body: FormInputs) => Promise<unknown>
  initialData: FormInputs
  onCancel: () => void
  submitTitle: string
}

export const RoleForm = (props: RoleFormProps) => {
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

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: RolesService.getPermissions,
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

        <FormControl fullWidth error={!!errors.permissions} className="mt-5">
          <InputLabel>Права *</InputLabel>
          <Controller
            name="permissions"
            rules={{ required: 'Обязательное поле' }}
            control={control}
            render={({ field }) => {
              return (
                <Select {...field} label="Права *" multiple>
                  {permissions?.data.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              )
            }}
          />
          {errors.permissions &&
            errors.permissions.message?.split(',').map((text) => (
              <FormHelperText key={text} error>
                {text}
              </FormHelperText>
            ))}
        </FormControl>
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
