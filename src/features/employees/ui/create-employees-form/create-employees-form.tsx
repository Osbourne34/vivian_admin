import { ChangeEvent, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Alert,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { LoadingButton } from '@mui/lab'

import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ru'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { useSnackbar } from 'notistack'

import { NumericFormatCustom } from '@/features/auth/ui/phone-input/phone-input'
import { EmployeesService } from '../../service/employees-service'
import { Error } from '@/shared/http'

interface FormInputs {
  name: string
  phone: string
  birthday: Dayjs | null
  address: string
  description: string
  password: string
  password_confirmation: string
  active: boolean
  branch_id: number | string
  orient_id: number | string
  manager_id: number | string
  roles: string[]
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
  manager_id: '',
  orient_id: '',
}

export const CreateEmployeesForm = () => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const fileInput = useRef<HTMLInputElement>(null)
  const [previewAvatar, setPreviewAvatar] = useState<{
    src: string
    file: File
  } | null>(null)

  const [error, setError] = useState('')

  const {
    clearErrors,
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError: setErrorForm,
  } = useForm<FormInputs>({
    defaultValues: initialForm,
  })

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    data.phone = `998${data.phone}`

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(`${key}[]`, item)
        })

        return
      }
      if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0')

        return
      }

      if (value === null) {
        formData.append(key, '')
        return
      }

      if (key === 'birthday') {
        formData.append(key, value.format('DD.MM.YYYY'))
        return
      }

      formData.append(key, value)
    })
    if (previewAvatar?.file) {
      formData.append('avatar', previewAvatar.file)
    }

    try {
      const response = await EmployeesService.createEmployees(formData)
      reset(initialForm)
      clearErrors('phone')
      setPreviewAvatar(null)
      enqueueSnackbar(response.data.message, {
        variant: 'success',
      })
    } catch (error) {
      const err = error as Error

      if (err.status === 401) {
        router.push('/login')
      }

      if (err?.errors) {
        let temp = new Map()
        err.errors.forEach((item) => {
          let key = temp.get(item.input) ?? []
          key.push(item.message)
          temp.set(item.input, key)
        })

        temp.forEach((value, key) => {
          setErrorForm(key, { message: value.join(',') })
        })
      }

      setError(err?.message!)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      setPreviewAvatar({
        file: event.currentTarget.files[0],
        src: URL.createObjectURL(event.currentTarget.files[0]),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="filled" severity="error" className="mb-5">
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid xs={3} item>
          <div className="flex justify-center">
            <input
              className="hidden"
              type="file"
              ref={fileInput}
              onChange={handleChange}
            />
            <div
              onClick={() => fileInput.current?.click()}
              className="h-40 w-40 cursor-pointer rounded-full border border-solid border-gray-200"
            >
              {previewAvatar ? (
                <div className="w-fulls group relative h-full">
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src={previewAvatar.src}
                    alt="avatar"
                  />

                  <div className="absolute left-0 top-0 hidden h-full w-full flex-col items-center justify-center rounded-full text-white hover:bg-gray-800/60 group-hover:flex">
                    <AddAPhotoIcon fontSize="large" />
                    <Typography className="mt-1">Загрузить аватар</Typography>
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 hover:text-gray-700">
                  <AddAPhotoIcon fontSize="large" />
                  <Typography className="mt-1">Загрузить аватар</Typography>
                </div>
              )}
            </div>
          </div>
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
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid xs={6} item>
              <FormControl fullWidth>
                <InputLabel>Ориентир</InputLabel>
                <Controller
                  name="orient_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Ориентир"
                      {...field}
                      onChange={(event) => field.onChange(event.target.value)}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid xs={6} item>
              <FormControl fullWidth>
                <InputLabel>Менеджер</InputLabel>
                <Controller
                  name="manager_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Менеджер"
                      {...field}
                      onChange={(event) => field.onChange(event.target.value)}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid xs={6} item>
              <FormControl fullWidth>
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
                      error={!!errors.roles}
                      onChange={(event) => {
                        const value = event.target.value
                        field.onChange(
                          typeof value === 'string' ? value.split(',') : value,
                        )
                      }}
                    >
                      <MenuItem value={'admin'}>Ten</MenuItem>
                      <MenuItem value={'manager'}>Twenty</MenuItem>
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
          Создать
        </LoadingButton>
      </div>
    </form>
  )
}
