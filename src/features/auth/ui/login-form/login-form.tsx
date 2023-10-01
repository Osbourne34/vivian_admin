import { Alert, FormControl, FormHelperText, TextField } from '@mui/material'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import LoadingButton from '@mui/lab/LoadingButton'

import { NumericFormatCustom } from '../../../../shared/ui/phone-input/phone-input'
import { useState } from 'react'
import { AuthService } from '../../service/auth-service'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Error } from '@/shared/http'
import { formErrors } from '@/shared/utils/form-errors'

interface FormInputs {
  phone: string
  password: string
}

export const LoginForm = () => {
  const router = useRouter()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError: setErrorForm,
  } = useForm<FormInputs>({
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  const [error, setError] = useState('')

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    data.phone = `998${data.phone}`

    try {
      setError('')
      const result = await AuthService.login(data)
      Cookies.set('token', result.data.token, {
        path: '/',
        expires: 1,
      })
      router.push('/')
    } catch (error) {
      const err = error as Error

      if (err?.errors) {
        const errors = formErrors(err.errors)

        errors.forEach((value, key) => {
          setErrorForm(key, { message: value.join(',') })
        })
        return
      }

      setError(err?.message!)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
      {error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}

      <Controller
        name="phone"
        control={control}
        rules={{
          required: 'Обязательное поле',
          minLength: { value: 9, message: 'Невалидный номер' },
        }}
        render={({ field }) => (
          <FormControl>
            <TextField
              label="Номер телефона *"
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

      <LoadingButton
        loading={isSubmitting}
        type="submit"
        variant="contained"
        size="large"
      >
        Войти
      </LoadingButton>
    </form>
  )
}
