import React, { ReactElement } from 'react'
import { Layout } from '@/shared/layouts/layout'
import {
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

const Create = () => {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: '',
      parent_id: '',
      warehouse: false,
    },
  })

  const onSubmit: SubmitHandler<{ name: string }> = async (data, event) => {
    console.log(data)
  }

  return (
    <div>
      <Typography variant="h5" mb={3}>
        Создание региона
      </Typography>

      <Paper elevation={4} className="p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
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
              loading={isSubmitting}
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
