import { BaseSyntheticEvent } from 'react'
import {
  Alert,
  AlertTitle,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useQuery } from '@tanstack/react-query'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { EmployeesService } from '../../service/employees-service'
import { UploadFile } from '../upload-file/upload-file'
import { NumericFormatCustom } from '@/features/auth/ui/phone-input/phone-input'
import { formErrors } from '@/shared/utils/form-errors'
import { Error } from '@/shared/http'
import { FormInputs } from './initial-data'
import { branchesSort } from '@/shared/utils/branches-sort'

interface EmployeeFormProps {
  error: string
  initialData: FormInputs
  submit: (
    body: FormInputs,
    event: BaseSyntheticEvent<object | any, any> | undefined,
  ) => Promise<unknown>
  requiredPassword: boolean
  titleSubmit: string
}

export const EmployeeForm = (props: EmployeeFormProps) => {
  const { error, initialData, submit, requiredPassword, titleSubmit } = props

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormInputs>({
    defaultValues: initialData,
    values: initialData,
  })

  const onSubmit: SubmitHandler<FormInputs> = async (data, event) => {
    try {
      await submit(data, event)
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
    () => EmployeesService.getBranches(),
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

  const { data: roles } = useQuery(['roles'], () =>
    EmployeesService.getRoles('client'),
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="filled" severity="error" className="mb-5">
          <AlertTitle>Ошибка</AlertTitle>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid xs={3} item>
          <UploadFile name="avatar" control={control} />

          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                className="mt-5"
                control={<Checkbox {...field} checked={field.value} />}
                label="Активировать аккаунт"
              />
            )}
          />
        </Grid>
        <Grid xs={9} item>
          <Grid container spacing={2}>
            <Grid xs={6} item>
              <Controller
                name="name"
                rules={{ required: 'Обязательное поле' }}
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextField
                      label="Имя *"
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
            </Grid>
            <Grid xs={6} item>
              <Controller
                name="phone"
                rules={{
                  required: 'Обязательное поле',
                  minLength: { value: 9, message: 'Невалидный номер' },
                }}
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextField
                      label="Номер телефона *"
                      variant="outlined"
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                      }}
                      error={!!errors.phone}
                      {...field}
                    />
                    {errors.phone &&
                      errors.phone.message?.split(',').map((text) => (
                        <FormHelperText key={text} error>
                          {text}
                        </FormHelperText>
                      ))}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid xs={6} item>
              <Controller
                name="birthday"
                rules={{
                  validate: (value) => {
                    if (value) {
                      if (!value?.isValid()) return 'Невалидное значение'
                    }
                  },
                }}
                control={control}
                render={({ field }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="ru"
                  >
                    <DatePicker
                      label="День рождения"
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.birthday,
                          helperText: errors.birthday?.message,
                        },
                      }}
                      {...field}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid xs={6} item>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Адресс"
                    variant="outlined"
                    fullWidth
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid xs={6} item>
              <Controller
                name="password"
                control={control}
                rules={{
                  [requiredPassword ? 'required' : '']: 'Обязательное поле',
                  minLength: { value: 6, message: 'Минимум 6 символов' },
                }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextField
                      type="password"
                      label="Пароль *"
                      variant="outlined"
                      error={!!errors.password}
                      {...field}
                    />
                    {errors.password &&
                      errors.password.message?.split(',').map((text) => (
                        <FormHelperText key={text} error>
                          {text}
                        </FormHelperText>
                      ))}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid xs={6} item>
              <Controller
                name="password_confirmation"
                control={control}
                rules={{
                  [requiredPassword ? 'required' : '']: 'Обязательное поле',
                  validate: (value, values) => {
                    if (value !== values.password) return 'Пароли не совпадают'
                  },
                }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextField
                      type="password"
                      label="Повторите пароль *"
                      variant="outlined"
                      error={!!errors.password_confirmation}
                      {...field}
                    />
                    {errors.password_confirmation &&
                      errors.password_confirmation.message
                        ?.split(',')
                        .map((text) => (
                          <FormHelperText key={text} error>
                            {text}
                          </FormHelperText>
                        ))}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid xs={6} item>
              <FormControl fullWidth>
                <InputLabel>Филиал</InputLabel>
                <Controller
                  name="branch_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Филиал"
                      {...field}
                      onChange={(event) => field.onChange(event.target.value)}
                    >
                      <MenuItem value={''}>Удалить значение</MenuItem>
                      {branches?.data.map(
                        ({ id, name, parent_id, parent_name }) => {
                          if (parent_id === 0 && !parent_name) {
                            return (
                              <ListSubheader key={id}>{name}</ListSubheader>
                            )
                          }
                          return (
                            <MenuItem key={id} value={id} className="pl-8">
                              {name}
                            </MenuItem>
                          )
                        },
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid xs={6} item>
              <FormControl fullWidth error={!!errors.roles}>
                <InputLabel>Роль *</InputLabel>
                <Controller
                  name="roles"
                  control={control}
                  rules={{ required: 'Обязательное поле' }}
                  render={({ field }) => (
                    <Select
                      multiple
                      label="Роль *"
                      {...field}
                      onChange={(event) => {
                        const value = event.target.value
                        field.onChange(
                          typeof value === 'string' ? value.split(',') : value,
                        )
                      }}
                    >
                      {roles?.data.map(({ id, name }) => (
                        <MenuItem key={id} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.roles &&
                  errors.roles.message?.split(',').map((text) => (
                    <FormHelperText key={text} error>
                      {text}
                    </FormHelperText>
                  ))}
              </FormControl>
            </Grid>
            <Grid xs={12} item>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Описание"
                    variant="outlined"
                    multiline
                    rows={3}
                    fullWidth
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <div className="mt-5 flex justify-end space-x-4">
        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
          {titleSubmit}
        </LoadingButton>
      </div>
    </form>
  )
}
