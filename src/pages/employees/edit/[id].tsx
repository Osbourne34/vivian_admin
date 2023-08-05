import { ReactElement, useEffect, useState } from 'react'

import { Layout } from '@/shared/layouts/layout'
import { useRouter } from 'next/router'
import { EmployeesService } from '@/features/employees'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FormInputs } from '../create'
import dayjs from 'dayjs'
import {
  Alert,
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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { NumericFormatCustom } from '@/features/auth/ui/phone-input/phone-input'
import { UploadFile } from '@/features/employees/ui/upload-file/upload-file'
import { useSnackbar } from 'notistack'
import { Error } from '@/shared/http'
import 'dayjs/locale/ru'

const EditEmployees = () => {
  const router = useRouter()
  const { id } = router.query
  const { enqueueSnackbar } = useSnackbar()

  const [initValues, setInitValues] = useState<FormInputs>()
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      EmployeesService.getEmployee(Number(id)).then(({ data }) => {
        setInitValues({
          ...data,
          address: data.address ? data.address : '',
          avatar: data.avatar ? new File([], data.avatar) : null,
          birthday: data.birthday ? dayjs(data.birthday) : null,
          branch_id: data.branch_id ? String(data.branch_id) : '',
          description: data.description ? data.description : '',
          manager_id: data.manager_id ? String(data.manager_id) : '',
          orient_id: data.manager_id ? String(data.orient_id) : '',
          password: '',
          password_confirmation: '',
          phone: data.phone.slice(3),
        })
      })
    }
  }, [router])

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<FormInputs>({
    defaultValues: {
      active: true,
      address: '',
      avatar: null,
      birthday: null,
      branch_id: '',
      description: '',
      manager_id: '',
      name: '',
      orient_id: '',
      password: '',
      password_confirmation: '',
      phone: '',
      roles: [],
    },
    values: initValues,
  })

  const onSubmit: SubmitHandler<FormInputs> = async (
    data: FormInputs,
    event,
  ) => {
    data.phone = `998${data.phone}`
    const formData = new FormData(event?.target)
    Object.entries(data).forEach(([key, value]) => {
      if (!value) {
        formData.delete(key)
      }
    })
    formData.set(
      'birthday',
      data.birthday ? data.birthday.format('DD.MM.YYYY') : '',
    )
    formData.set('phone', data.phone)
    formData.set('active', data.active ? '1' : '0')
    formData.append('_method', 'PUT')

    try {
      setError('')
      const { data } = await EmployeesService.updateEmployee(
        Number(id),
        formData,
      )
      router.push('/employees')
      enqueueSnackbar(data.message, {
        variant: 'success',
      })
    } catch (error) {
      const err = error as Error

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
    }
  }

  return (
    <div>
      <Typography variant="h5" mb={3}>
        Редактирование сотрудника
      </Typography>

      <Paper elevation={4} className="p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <Alert variant="filled" severity="error" className="mb-5">
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
                    // rules={{
                    //   required: 'Обязательное поле',
                    //   validate: (value, values) => {
                    //     if (value !== values.password)
                    //       return 'Пароли не совпадают'
                    //   },
                    // }}
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
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
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
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
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
                          value={field.value || []}
                          onChange={(event) => {
                            const value = event.target.value
                            field.onChange(
                              typeof value === 'string'
                                ? value.split(',')
                                : value,
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
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
            >
              Обновить
            </LoadingButton>
          </div>
        </form>
      </Paper>
    </div>
  )
}

EditEmployees.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default EditEmployees
