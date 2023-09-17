import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useSnackbar } from 'notistack'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useModal } from '@/shared/ui/modal/context/modal-context'
import { BranchDetail } from '../../types/Branch'
import { Error, ResponseWithMessage } from '@/shared/http'
import { BranchesService } from '../../service/branches-service'
import { FormInputs } from '../branch-form/initial-data'
import { CircularProgress } from '@mui/material'
import { BranchForm } from '../branch-form/branch-form'

interface EditBranchProps {
  id: number
}

const EditBranch = (props: EditBranchProps) => {
  const { id } = props

  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const { closeModal } = useModal()
  const [branch, setBranch] = useState<BranchDetail>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const updateMutation = useMutation<
    ResponseWithMessage,
    Error,
    {
      id: number
      body: { name: string; parent_id: string; warehouse: boolean }
    }
  >({
    mutationFn: BranchesService.updateBranch,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['branches'])
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
        const { data } = await BranchesService.getBranch(id)
        setBranch(data)
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
        <BranchForm
          error={error}
          onCancel={() => closeModal()}
          submit={handleSubmit}
          initialData={{
            name: branch?.name ? branch.name : '',
            parent_id: branch?.parent_id ? String(branch?.parent_id) : '',
            warehouse: Boolean(branch?.warehouse),
          }}
          submitTitle="Сохранить"
        />
      )}
    </>
  )
}

export default EditBranch
