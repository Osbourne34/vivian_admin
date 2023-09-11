import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'

interface ActionsProps {
  onUpdate: () => void
  onDelete: () => void
}

const Actions = (props: ActionsProps) => {
  const { onUpdate, onDelete } = props

  return (
    <div className={'flex gap-2'}>
      <IconButton onClick={onUpdate} size="small" color="primary">
        <EditRoundedIcon />
      </IconButton>
      <IconButton onClick={onDelete} size="small" color="error">
        <DeleteIcon />
      </IconButton>
    </div>
  )
}

export default Actions
