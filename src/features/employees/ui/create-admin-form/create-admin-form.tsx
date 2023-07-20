import {
  Alert,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
} from '@mui/material'

import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ru'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { NumericFormatCustom } from '@/features/auth/ui/phone-input/phone-input'
import { EmployeesService } from '../../service/employees-service'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { Error } from '@/shared/http'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'

interface FormInputs {
  name: string
  phone: string
  birthday: Dayjs | null | string
  address: string
  description: string
  password: string
  password_confirmation: string
  active: boolean
}

interface CreateAdminFormProps {
  onClose: () => void
}

export const CreateAdminForm = (props: CreateAdminFormProps) => {
  const { onClose } = props
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [error, setError] = useState('')

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError: setErrorForm,
  } = useForm<FormInputs>({
    defaultValues: {
      active: false,
      address: '',
      birthday: null,
      description: '',
      name: '',
      password: '',
      password_confirmation: '',
      phone: '',
    },
  })

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    data.phone = `998${data.phone}`

    if (data?.birthday) {
      data.birthday = dayjs(data.birthday).format('DD.MM.YYYY')
    }

    if (data.birthday === 'Invalid Date' || data.birthday === null) {
      data.birthday = ''
    }

    try {
      const response = await EmployeesService.createAdmin(data)
      enqueueSnackbar(response.data.message, {
        variant: 'success',
      })
      onClose()
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent className="flex flex-col space-y-5 overflow-visible">
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}

        

        <Controller
          name="name"
          control={control}
          rules={{
            required: 'Обязательное поле',
          }}
          render={({ field }) => (
            <FormControl>
              <TextField
                label="Имя"
                InputLabelProps={{ shrink: true }}
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

        <Controller
          name="phone"
          control={control}
          rules={{ required: 'Обязательное поле' }}
          render={({ field }) => (
            <FormControl>
              <TextField
                label="Номер телефона"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputComponent: NumericFormatCustom as any,
                }}
                variant="outlined"
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

        <Controller
          name="birthday"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
              <DatePicker
                slotProps={{
                  textField: {
                    InputLabelProps: {
                      shrink: true,
                    },
                  },
                }}
                label="День рождения"
                {...field}
              />
            </LocalizationProvider>
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <FormControl>
              <TextField
                label="Адресс"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                {...field}
              />
            </FormControl>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormControl>
              <TextField
                label="Описание"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                {...field}
              />
            </FormControl>
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Обязательное поле',
            minLength: { value: 6, message: 'Минимум 6 символов' },
          }}
          render={({ field }) => (
            <FormControl>
              <TextField
                type="password"
                label="Пароль"
                InputLabelProps={{ shrink: true }}
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
            <FormControl>
              <TextField
                type="password"
                label="Повторите пароль"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                error={!!errors.password_confirmation}
                {...field}
              />
              {errors.password_confirmation &&
                errors.password_confirmation.message?.split(',').map((text) => (
                  <FormHelperText key={text} error>
                    {text}
                  </FormHelperText>
                ))}
            </FormControl>
          )}
        />

        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} />}
              label="Активировать"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Отмена
        </Button>
        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
          Создать
        </LoadingButton>
      </DialogActions>
    </form>
  )
}
