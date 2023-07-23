import { Layout } from '@/shared/layouts/layout'
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { ReactElement } from 'react'

import { useForm, Controller, SubmitHandler } from 'react-hook-form'

interface FormData {
  branch: string | number
  roles: string[] | number[]
}

const Test = () => {
  const { handleSubmit, formState, control } = useForm<FormData>({
    defaultValues: {
      branch: 10,
      roles: ['manager', 'admin'],
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormControl fullWidth>
        <InputLabel>Age</InputLabel>
        <Controller
          name="branch"
          control={control}
          render={({ field }) => (
            <Select
              label="Age"
              {...field}
              onChange={(event) => field.onChange(event.target.value)}
            >
              <MenuItem value={''}>Пусто</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          )}
        />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Roles</InputLabel>
        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <Select
              label="Roles"
              multiple
              {...field}
              onChange={(event) => {
                const value = event.target.value
                field.onChange(
                  typeof value === 'string' ? value.split(',') : value,
                )
              }}
            >
              <MenuItem value={'admin'}>admin</MenuItem>
              <MenuItem value={'manager'}>manager</MenuItem>
            </Select>
          )}
        />
      </FormControl>

      <Button type="submit" variant="outlined">
        Goo
      </Button>
    </form>
  )
}

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Test
