import { ChangeEvent, useRef, useState } from 'react'

import { Typography } from '@mui/material'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { UseControllerProps, useController } from 'react-hook-form'
import { FormInputs } from '../forms/initial-data'

export const UploadFile = ({
  name,
  control,
}: UseControllerProps<FormInputs>) => {
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement | null>()

  const { field } = useController({
    name,
    control,
  })

  const defaultPhoto = field.value as File | null

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0]
      setPreviewAvatar(URL.createObjectURL(file))
      field.onChange(file)
    }
  }

  return (
    <div className="flex justify-center">
      <input
        type="file"
        className="hidden"
        name={field.name}
        onChange={handleChange}
        ref={(instanse) => {
          fileInput.current = instanse
          field.ref(instanse)
        }}
      />
      <button
        onClick={() => fileInput.current?.click()}
        type="button"
        className="h-40 w-40 cursor-pointer rounded-full border border-solid border-gray-200 bg-transparent p-0"
      >
        {previewAvatar || defaultPhoto?.name ? (
          <div className="group relative h-full w-full">
            <img
              className="h-full w-full rounded-full object-cover"
              src={previewAvatar || defaultPhoto?.name}
              alt="avatar"
            />

            <div className="absolute left-0 top-0 flex h-0 w-0 flex-col items-center justify-center rounded-full text-white transition group-hover:h-full group-hover:w-full group-hover:bg-gray-800/60">
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
      </button>
    </div>
  )
}
