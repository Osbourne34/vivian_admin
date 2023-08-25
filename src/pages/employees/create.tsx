import { ReactElement, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Alert,
  AlertTitle,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { useSnackbar } from 'notistack'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { Dayjs } from 'dayjs'
import 'dayjs/locale/ru'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { EmployeesService } from '@/features/employees'
import { UploadFile } from '@/features/employees/ui/upload-file/upload-file'
import { NumericFormatCustom } from '@/features/auth/ui/phone-input/phone-input'
import { Layout } from '@/shared/layouts/layout'
import { Error, ResponseWithMessage } from '@/shared/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface FormInputs {
  name: string
  phone: string
  birthday: Dayjs | null
  address: string
  description: string
  password: string
  password_confirmation: string
  active: boolean
  branch_id: string
  roles: string[]
  avatar: File | null
}

const initialForm = {
  active: true,
  address: '',
  birthday: null,
  description: '',
  name: '',
  password: '',
  password_confirmation: '',
  phone: '',
  roles: [],
  branch_id: '',
  avatar: null,
}

const CreateEmployees = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [error, setError] = useState('')

  const createMutation = useMutation<ResponseWithMessage, Error, FormData>({
    mutationFn: EmployeesService.createEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['employees'])
      router.push('/employees')
      reset()
      enqueueSnackbar(data.message, {
        variant: 'success',
      })
    },
    onError: (err) => {
      if (err.status === 401) {
        router.push('/login')
        return
      }

      if (err?.errors) {
        let temp = new Map()
        err.errors.forEach((item) => {
          let key = temp.get(item.input) ?? []
          key.push(item.message)
          temp.set(item.input, key)
        })

        temp.forEach((value, key) => {
          setFormError(key, { message: value.join(',') })
        })

        return
      }

      setError(err?.message!)
    },
  })

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError,
  } = useForm<FormInputs>({
    defaultValues: initialForm,
  })

  const onSubmit: SubmitHandler<FormInputs> = (data, event) => {
    data.phone = `998${data.phone}`
    const formData = new FormData(event?.target)
    formData.set(
      'birthday',
      data.birthday ? data.birthday.format('DD.MM.YYYY') : '',
    )
    formData.set('phone', data.phone)
    formData.set('active', data.active ? '1' : '0')

    setError('')
    createMutation.mutate(formData)
  }

  const { data: branches } = useQuery(['branches'], () =>
    EmployeesService.getBranches(),
  )

  const { data: roles } = useQuery(['roles'], () => EmployeesService.getRoles())

  return (
    <div>
      <Typography variant="h5" mb={3}>
        Создание сотрудника
      </Typography>

      <Paper elevation={4} className="p-5">
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
                      required: 'Обязательное поле',
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
                      required: 'Обязательное поле',
                      validate: (value, values) => {
                        if (value !== values.password)
                          return 'Пароли не совпадают'
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
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                        >
                          {branches?.data.map(({ id, name }) => (
                            <MenuItem key={id} value={id}>
                              {name}
                            </MenuItem>
                          ))}
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
                              typeof value === 'string'
                                ? value.split(',')
                                : value,
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
            <LoadingButton
              loading={createMutation.isLoading}
              type="submit"
              variant="contained"
            >
              Создать сотрудника
            </LoadingButton>
          </div>
        </form>
      </Paper>
    </div>
  )
}

CreateEmployees.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default CreateEmployees
