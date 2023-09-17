import React, { ReactElement, useState } from 'react'
import { Layout } from '@/shared/layouts/layout'
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
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BranchesService } from '@/features/branches'
import { enqueueSnackbar } from 'notistack'

import { Error, ResponseWithMessage } from '@/shared/http'
import { useRouter } from 'next/router'

type FormInputs = {
  name: string
  parent_id: string
  warehouse: boolean
}

const Create = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: branches } = useQuery(['branches'], () =>
    //@ts-ignore
    BranchesService.getBranches(),
  )

  const [error, setError] = useState('')

  const createMutation = useMutation<
    ResponseWithMessage,
    Error,
    {
      name: string
      parent_id: string
      warehouse: boolean
    }
  >({
    mutationFn: BranchesService.createBranch,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['branches'])
      router.push('/branches')
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
      parent_id: '',
      warehouse: false,
    },
  })

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    setError('')
    createMutation.mutate(data)
  }

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
              <FormControl fullWidth>
                <InputLabel>Родительский регион</InputLabel>
                <Controller
                  name="parent_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Родительский регион"
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
              </FormControl>
            </Grid>
            <Grid xs={12} item>
              <Controller
                name="warehouse"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Имеется склад?"
                  />
                )}
              />
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
