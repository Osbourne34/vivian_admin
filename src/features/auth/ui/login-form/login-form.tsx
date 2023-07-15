import { Alert, Button, FormHelperText, TextField } from '@mui/material'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import LoadingButton from '@mui/lab/LoadingButton'

import { NumericFormatCustom } from '../phone-input/phone-input'
import { useState } from 'react'
import { AuthService } from '../../service/authService'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Error } from '@/shared/http'

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
        let temp = new Map<string, Array<string>>()
        err.errors.forEach((item) => {
          let key = temp.get(item.input) ?? []
          key.push(item.message)
          temp.set(item.input, key)
        })

        console.log(temp)

        for (let entry of temp.entries()) {
          setErrorForm(entry[0], { message: entry[1] })
        }

        //  setErrorForm(item[0], { message: item[1] })
      }

      setError(err?.message!)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      {error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}

      <Controller
        name="phone"
        control={control}
        rules={{ required: 'Обязательное поле' }}
        render={({ field }) => (
          <>
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
              errors.phone.message.map((text) => (
                <FormHelperText error>{text}</FormHelperText>
              ))}
          </>
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: 'Обязательное поле',
          minLength: { value: 3, message: 'Минимум 6 символов' },
        }}
        render={({ field }) => (
          <>
            <TextField
              type="password"
              label="Пароль"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              error={!!errors.password}
              {...field}
            />
            {errors.password &&
              errors.password.message.map((text) => (
                <FormHelperText error>{text}</FormHelperText>
              ))}
          </>
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
