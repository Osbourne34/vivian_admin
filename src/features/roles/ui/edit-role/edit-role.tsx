import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { CircularProgress } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useModal } from '@/shared/ui/modal/context/modal-context'
import { Error, ResponseWithMessage } from '@/shared/http'
import { Role } from '../../types/role'
import { RolesService } from '../../service/roles-service'
import { FormInputs } from '../role-form/initial-data'
import { RoleForm } from '../role-form/role-form'

interface EditRoleProps {
  id: number
}

export const EditRole = (props: EditRoleProps) => {
  const { id } = props

  const router = useRouter()
  const queryClient = useQueryClient()

  const { closeModal } = useModal()
  const [role, setRole] = useState<Role>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const updateMutation = useMutation<
    ResponseWithMessage,
    Error,
    { id: number; body: { name: string; permissions: number[] } }
  >({
    mutationFn: RolesService.updateRole,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['roles'])
      closeModal()
      enqueueSnackbar(data.message, {
        variant: 'success',
      })
    },
    onError: (err) => {
      if (err.status === 401) {
        router.push('/login')
        return
      }

      setError(err?.message!)
    },
  })

  const handleSubmit = async (data: FormInputs) => {
    try {
      await updateMutation.mutateAsync({ id, body: data })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  useEffect(() => {
    const getOrient = async () => {
      setIsLoading(true)
      try {
        const { data } = await RolesService.getRole(id)
        setRole(data)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    getOrient()
  }, [id])

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center px-6 pb-8 pt-5">
          <CircularProgress />
        </div>
      ) : (
        <RoleForm
          error={error}
          onCancel={() => closeModal()}
          submit={handleSubmit}
          initialData={{
            name: role?.name || '',
            permissions: role?.permissions.map(({ id }) => id) || [],
          }}
          submitTitle="Сохранить"
        />
      )}
    </>
  )
}
