import React, { ReactElement, useState } from 'react'
import { Layout } from '@/shared/layouts/layout'
import {
  Alert,
  AlertTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { OrientsService } from '@/features/orients/service/orients-service'
import { ResponseWithMessage, Error } from '@/shared/http'
import { EmployeesService } from '@/features/employees'

type FormInputs = {
  name: string
  branch_id: string
}

const Create = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [error, setError] = useState('')

  const createMutation = useMutation<
    ResponseWithMessage,
    Error,
    {
      name: string
      branch_id: string
    }
  >({
    mutationFn: OrientsService.createOrient,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orients'])
      router.push('/orients')
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
    control,
    formState: { errors },
    handleSubmit,
    setError: setFormError,
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      branch_id: '',
    },
  })

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    setError('')
    console.log(data)

    createMutation.mutate(data)
  }

  const { data: branches } = useQuery(['branches'], () =>
    EmployeesService.getBranches(),
  )

  return (
    <div>
      <Typography variant="h5" mb={3}>
        Создание региона
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
            <Grid xs={6} item>
              <Controller
                name="name"
                rules={{ required: 'Обязательное поле' }}
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextField
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
            </Grid>
            <Grid xs={6} item>
              <FormControl fullWidth error={!!errors.branch_id}>
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
                      {branches?.data.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>
                          {name}
                        </MenuItem>
                      ))}
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
            </Grid>
          </Grid>

          <div className="mt-5 flex items-center justify-end">
            <LoadingButton
              loading={createMutation.isLoading}
              type="submit"
              variant="contained"
            >
              Создать
            </LoadingButton>
          </div>
        </form>
      </Paper>
    </div>
  )
}

Create.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Create
